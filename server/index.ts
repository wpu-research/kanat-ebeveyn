import { Hono, type Context, type Next } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { readFileSync } from 'node:fs'
import { hashPassword, newPairCode, newToken, sha256, verifyPassword } from './auth'
import { migrate, q } from './db'

type Vars = { parentId: string; childId: string; deviceId: string }
const app = new Hono<{ Variables: Vars }>()

const PAIR_TTL_HOURS = 24
const colors = ['#ec4899', '#0ea5e9', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444']

class BadRequest extends Error {}
const bad = (msg: string): never => {
  throw new BadRequest(msg)
}

app.onError((err, c) => {
  if (err instanceof BadRequest) return c.json({ error: err.message }, 400)
  console.error(err)
  return c.json({ error: 'Sunucu hatası' }, 500)
})

app.use('/api/*', cors())

// --- Yardımcılar -----------------------------------------------------------

async function body(c: Context): Promise<Record<string, any>> {
  try {
    const b = await c.req.json()
    return b && typeof b === 'object' ? b : {}
  } catch {
    return {}
  }
}

const str = (v: unknown, name: string, max = 200): string => {
  if (typeof v !== 'string' || !v.trim()) bad(`${name} gerekli`)
  return (v as string).trim().slice(0, max)
}
const optStr = (v: unknown, max = 200) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null)
const num = (v: unknown, min: number, max: number): number | null =>
  typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max ? v : null
const time = (v: unknown): Date => {
  const d = typeof v === 'string' || typeof v === 'number' ? new Date(v) : new Date()
  return Number.isNaN(d.getTime()) ? new Date() : d
}

// Basit IP başına oran sınırlayıcı (giriş ve eşleştirme kodu deneme saldırılarına karşı).
const hits = new Map<string, { n: number; reset: number }>()
function limit(key: string, max: number, windowMs: number) {
  const now = Date.now()
  const h = hits.get(key)
  if (!h || h.reset < now) {
    hits.set(key, { n: 1, reset: now + windowMs })
    return
  }
  if (++h.n > max) bad('Çok fazla deneme, birkaç dakika sonra tekrar deneyin')
}
const ip = (c: Context) => c.req.header('x-forwarded-for')?.split(',')[0].trim() ?? 'local'
const bearer = (c: Context) => c.req.header('authorization')?.replace(/^Bearer\s+/i, '') ?? ''

async function requireParent(c: Context<{ Variables: Vars }>, next: Next) {
  const token = bearer(c)
  const r = token ? await q('SELECT parent_id FROM sessions WHERE token_hash = $1', [sha256(token)]) : null
  if (!r?.rowCount) return c.json({ error: 'Oturum geçersiz' }, 401)
  c.set('parentId', r.rows[0].parent_id)
  await next()
}

async function requireDevice(c: Context<{ Variables: Vars }>, next: Next) {
  const token = bearer(c)
  const r = token
    ? await q('UPDATE devices SET last_seen = now() WHERE token_hash = $1 RETURNING id, child_id', [sha256(token)])
    : null
  if (!r?.rowCount) return c.json({ error: 'Cihaz eşleşmesi kaldırılmış' }, 401)
  c.set('deviceId', r.rows[0].id)
  c.set('childId', r.rows[0].child_id)
  await next()
}

// Ebeveynin bu çocuğa erişimi var mı?
async function ownChild(c: Context<{ Variables: Vars }>) {
  const id = c.req.param('id')
  if (!id || !/^[0-9a-f-]{36}$/.test(id)) bad('Geçersiz çocuk')
  const r = await q('SELECT id FROM children WHERE id = $1 AND parent_id = $2', [id, c.get('parentId')])
  if (!r.rowCount) bad('Çocuk bulunamadı')
  return id as string
}

app.get('/api/health', async (c) => {
  await q('SELECT 1')
  return c.json({ ok: true })
})

// --- Ebeveyn hesabı --------------------------------------------------------

app.post('/api/auth/register', async (c) => {
  limit(`reg:${ip(c)}`, 10, 60 * 60_000)
  const b = await body(c)
  const email = str(b.email, 'E-posta').toLowerCase()
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) bad('Geçerli bir e-posta girin')
  const password = str(b.password, 'Şifre', 200)
  if (password.length < 8) bad('Şifre en az 8 karakter olmalı')
  const name = str(b.name, 'Ad', 80)
  const exists = await q('SELECT 1 FROM parents WHERE email = $1', [email])
  if (exists.rowCount) bad('Bu e-posta ile kayıtlı bir hesap var')
  const r = await q('INSERT INTO parents (email, name, pass_hash) VALUES ($1, $2, $3) RETURNING id', [
    email,
    name,
    hashPassword(password),
  ])
  const token = newToken()
  await q('INSERT INTO sessions (token_hash, parent_id) VALUES ($1, $2)', [sha256(token), r.rows[0].id])
  return c.json({ token, parent: { id: r.rows[0].id, email, name } })
})

app.post('/api/auth/login', async (c) => {
  limit(`login:${ip(c)}`, 20, 15 * 60_000)
  const b = await body(c)
  const email = str(b.email, 'E-posta').toLowerCase()
  const password = str(b.password, 'Şifre')
  const r = await q('SELECT id, name, pass_hash FROM parents WHERE email = $1', [email])
  if (!r.rowCount || !verifyPassword(password, r.rows[0].pass_hash)) bad('E-posta veya şifre hatalı')
  const token = newToken()
  await q('INSERT INTO sessions (token_hash, parent_id) VALUES ($1, $2)', [sha256(token), r.rows[0].id])
  return c.json({ token, parent: { id: r.rows[0].id, email, name: r.rows[0].name } })
})

app.post('/api/auth/logout', async (c) => {
  await q('DELETE FROM sessions WHERE token_hash = $1', [sha256(bearer(c))])
  return c.json({ ok: true })
})

app.get('/api/me', requireParent, async (c) => {
  const r = await q('SELECT id, email, name FROM parents WHERE id = $1', [c.get('parentId')])
  return c.json(r.rows[0])
})

// --- Ebeveyn: çocuklar ve izleme ------------------------------------------

app.get('/api/children', requireParent, async (c) => {
  const r = await q(
    `SELECT ch.id, ch.name, ch.color, ch.rules, ch.created_at,
            CASE WHEN ch.pair_expires > now() THEN ch.pair_code END AS pair_code,
            CASE WHEN ch.pair_expires > now() THEN ch.pair_expires END AS pair_expires,
            d.device, l.location,
            (SELECT count(*)::int FROM events e WHERE e.child_id = ch.id AND e.status = 'yeni') AS new_events
       FROM children ch
       LEFT JOIN LATERAL (
         SELECT json_build_object('id', id, 'name', name, 'platform', platform, 'appVersion', app_version,
                                  'battery', battery, 'charging', charging, 'lastSeen', last_seen) AS device
           FROM devices WHERE child_id = ch.id ORDER BY last_seen DESC NULLS LAST LIMIT 1) d ON true
       LEFT JOIN LATERAL (
         SELECT json_build_object('lat', lat, 'lng', lng, 'accuracy', accuracy, 'at', recorded_at) AS location
           FROM locations WHERE child_id = ch.id ORDER BY recorded_at DESC LIMIT 1) l ON true
      WHERE ch.parent_id = $1
      ORDER BY ch.created_at`,
    [c.get('parentId')],
  )
  return c.json(
    r.rows.map((x) => ({
      id: x.id,
      name: x.name,
      color: x.color,
      rules: x.rules,
      pairCode: x.pair_code,
      pairExpires: x.pair_expires,
      device: x.device,
      location: x.location,
      newEvents: x.new_events,
    })),
  )
})

async function issuePairCode(childId: string) {
  // Çakışma olasılığı düşük; olursa yeniden dene.
  for (let i = 0; i < 5; i++) {
    const code = newPairCode()
    try {
      await q(
        `UPDATE children SET pair_code = $1, pair_expires = now() + make_interval(hours => $2) WHERE id = $3`,
        [code, PAIR_TTL_HOURS, childId],
      )
      return code
    } catch (e: any) {
      if (e.code !== '23505') throw e
    }
  }
  return bad('Kod üretilemedi, tekrar deneyin')
}

app.post('/api/children', requireParent, async (c) => {
  const b = await body(c)
  const name = str(b.name, 'Ad', 40)
  const count = await q('SELECT count(*)::int AS n FROM children WHERE parent_id = $1', [c.get('parentId')])
  if (count.rows[0].n >= 10) bad('En fazla 10 çocuk eklenebilir')
  const r = await q('INSERT INTO children (parent_id, name, color) VALUES ($1, $2, $3) RETURNING id', [
    c.get('parentId'),
    name,
    colors[count.rows[0].n % colors.length],
  ])
  const pairCode = await issuePairCode(r.rows[0].id)
  return c.json({ id: r.rows[0].id, pairCode })
})

app.post('/api/children/:id/pair-code', requireParent, async (c) => {
  const id = await ownChild(c)
  return c.json({ pairCode: await issuePairCode(id) })
})

app.patch('/api/children/:id', requireParent, async (c) => {
  const id = await ownChild(c)
  const b = await body(c)
  if (b.name !== undefined) await q('UPDATE children SET name = $1 WHERE id = $2', [str(b.name, 'Ad', 40), id])
  if (b.rules && typeof b.rules === 'object') {
    const limitMin = num(b.rules.dailyLimitMin, 0, 24 * 60)
    if (limitMin !== null) {
      await q(`UPDATE children SET rules = jsonb_set(rules, '{dailyLimitMin}', to_jsonb($1::int)) WHERE id = $2`, [
        Math.round(limitMin),
        id,
      ])
    }
  }
  return c.json({ ok: true })
})

app.delete('/api/children/:id', requireParent, async (c) => {
  const id = await ownChild(c)
  await q('DELETE FROM children WHERE id = $1', [id])
  return c.json({ ok: true })
})

app.delete('/api/children/:id/devices', requireParent, async (c) => {
  const id = await ownChild(c)
  await q('DELETE FROM devices WHERE child_id = $1', [id])
  return c.json({ ok: true })
})

app.get('/api/children/:id/locations', requireParent, async (c) => {
  const id = await ownChild(c)
  const hours = num(Number(c.req.query('hours') ?? 24), 1, 24 * 30) ?? 24
  const r = await q(
    `SELECT lat, lng, accuracy, recorded_at AS at FROM locations
      WHERE child_id = $1 AND recorded_at > now() - make_interval(hours => $2)
      ORDER BY recorded_at DESC LIMIT 2000`,
    [id, hours],
  )
  return c.json(r.rows)
})

app.get('/api/children/:id/events', requireParent, async (c) => {
  const id = await ownChild(c)
  const r = await q(
    `SELECT id, kind, data, status, created_at AS at FROM events WHERE child_id = $1
      ORDER BY created_at DESC LIMIT 100`,
    [id],
  )
  return c.json(r.rows)
})

app.patch('/api/events/:eventId', requireParent, async (c) => {
  const status = (await body(c)).status
  if (!['incelendi', 'onaylandi', 'reddedildi'].includes(status)) bad('Geçersiz durum')
  const r = await q(
    `UPDATE events e SET status = $1 FROM children ch
      WHERE e.id = $2 AND e.child_id = ch.id AND ch.parent_id = $3 RETURNING e.id`,
    [status, Number(c.req.param('eventId')) || 0, c.get('parentId')],
  )
  if (!r.rowCount) bad('Olay bulunamadı')
  return c.json({ ok: true })
})

app.get('/api/children/:id/usage', requireParent, async (c) => {
  const id = await ownChild(c)
  const day = /^\d{4}-\d{2}-\d{2}$/.test(c.req.query('day') ?? '') ? c.req.query('day') : null
  const r = await q(
    `SELECT app, minutes FROM app_usage WHERE child_id = $1 AND day = coalesce($2::date, current_date)
      ORDER BY minutes DESC`,
    [id, day],
  )
  return c.json(r.rows)
})

app.get('/api/children/:id/calls', requireParent, async (c) => {
  const id = await ownChild(c)
  const r = await q(
    `SELECT contact, direction, duration_sec AS "durationSec", at FROM calls WHERE child_id = $1
      ORDER BY at DESC LIMIT 200`,
    [id],
  )
  return c.json(r.rows)
})

// --- Cihaz (çocuğun telefonu) ---------------------------------------------

app.post('/api/device/pair', async (c) => {
  limit(`pair:${ip(c)}`, 10, 10 * 60_000)
  const b = await body(c)
  const code = str(b.code, 'Kod', 10).replace(/\D/g, '')
  const r = await q(
    `UPDATE children SET pair_code = NULL, pair_expires = NULL
      WHERE pair_code = $1 AND pair_expires > now() RETURNING id, name, color, rules`,
    [code],
  )
  if (!r.rowCount) bad('Kod geçersiz veya süresi dolmuş')
  const child = r.rows[0]
  const token = newToken()
  const platform = ['android', 'ios'].includes(b.platform) ? b.platform : null
  const deviceName = optStr(b.deviceName, 80)
  await q(
    `INSERT INTO devices (child_id, token_hash, name, platform, app_version, last_seen)
     VALUES ($1, $2, $3, $4, $5, now())`,
    [child.id, sha256(token), deviceName, platform, optStr(b.appVersion, 20)],
  )
  await q(`INSERT INTO events (child_id, kind, data, status) VALUES ($1, 'eslesme', $2, 'incelendi')`, [
    child.id,
    { deviceName, platform },
  ])
  return c.json({ token, child: { id: child.id, name: child.name, color: child.color } })
})

async function deviceState(childId: string) {
  const r = await q(
    `SELECT ch.name, ch.color, ch.rules,
            coalesce((SELECT sum((data->>'minutes')::int) FROM events
                       WHERE child_id = ch.id AND kind = 'ek_sure' AND status = 'onaylandi'
                         AND created_at >= date_trunc('day', now() AT TIME ZONE 'Europe/Istanbul') AT TIME ZONE 'Europe/Istanbul'), 0)::int AS extra,
            (SELECT json_agg(x) FROM (SELECT id, data->'minutes' AS minutes, status, created_at AS at FROM events
                       WHERE child_id = ch.id AND kind = 'ek_sure' ORDER BY created_at DESC LIMIT 5) x) AS requests
       FROM children ch WHERE ch.id = $1`,
    [childId],
  )
  const x = r.rows[0]
  return { child: { name: x.name, color: x.color }, rules: x.rules, extraMinutesToday: x.extra, requests: x.requests ?? [] }
}

app.get('/api/device/state', requireDevice, async (c) => c.json(await deviceState(c.get('childId'))))

app.post('/api/device/heartbeat', requireDevice, async (c) => {
  const b = await body(c)
  const battery = num(b.battery, 0, 1)
  await q('UPDATE devices SET battery = coalesce($1, battery), charging = coalesce($2, charging), app_version = coalesce($3, app_version) WHERE id = $4', [
    battery,
    typeof b.charging === 'boolean' ? b.charging : null,
    optStr(b.appVersion, 20),
    c.get('deviceId'),
  ])
  return c.json(await deviceState(c.get('childId')))
})

app.post('/api/device/locations', requireDevice, async (c) => {
  const b = await body(c)
  const points = Array.isArray(b.points) ? b.points.slice(0, 500) : []
  const valid = points
    .map((p: any) => ({ lat: num(p?.lat, -90, 90), lng: num(p?.lng, -180, 180), acc: num(p?.accuracy, 0, 100_000), at: time(p?.at) }))
    .filter((p: any) => p.lat !== null && p.lng !== null)
  if (!valid.length) bad('Konum yok')
  await q(
    `INSERT INTO locations (child_id, lat, lng, accuracy, recorded_at)
     SELECT $1, * FROM unnest($2::float8[], $3::float8[], $4::real[], $5::timestamptz[])`,
    [c.get('childId'), valid.map((p: any) => p.lat), valid.map((p: any) => p.lng), valid.map((p: any) => p.acc), valid.map((p: any) => p.at)],
  )
  return c.json({ saved: valid.length })
})

app.post('/api/device/sos', requireDevice, async (c) => {
  const b = await body(c)
  const lat = num(b.lat, -90, 90)
  const lng = num(b.lng, -180, 180)
  if (lat !== null && lng !== null) {
    await q('INSERT INTO locations (child_id, lat, lng, accuracy, recorded_at) VALUES ($1, $2, $3, $4, now())', [
      c.get('childId'),
      lat,
      lng,
      num(b.accuracy, 0, 100_000),
    ])
  }
  await q(`INSERT INTO events (child_id, kind, data) VALUES ($1, 'sos', $2)`, [c.get('childId'), { lat, lng }])
  return c.json({ ok: true })
})

app.post('/api/device/extra-time', requireDevice, async (c) => {
  limit(`extra:${c.get('deviceId')}`, 10, 60 * 60_000)
  const minutes = num((await body(c)).minutes, 5, 240)
  if (minutes === null) bad('Süre 5–240 dk olmalı')
  await q(`INSERT INTO events (child_id, kind, data) VALUES ($1, 'ek_sure', $2)`, [
    c.get('childId'),
    { minutes: Math.round(minutes!) },
  ])
  return c.json(await deviceState(c.get('childId')))
})

app.post('/api/device/usage', requireDevice, async (c) => {
  const b = await body(c)
  const day = typeof b.day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(b.day) ? b.day : null
  if (!day) bad('day (YYYY-AA-GG) gerekli')
  const apps = (Array.isArray(b.apps) ? b.apps.slice(0, 300) : [])
    .map((a: any) => ({ app: optStr(a?.app, 120), minutes: num(a?.minutes, 0, 24 * 60) }))
    .filter((a: any) => a.app && a.minutes !== null)
  for (const a of apps) {
    await q(
      `INSERT INTO app_usage (child_id, day, app, minutes) VALUES ($1, $2, $3, $4)
       ON CONFLICT (child_id, day, app) DO UPDATE SET minutes = EXCLUDED.minutes`,
      [c.get('childId'), day, a.app, Math.round(a.minutes as number)],
    )
  }
  return c.json({ saved: apps.length })
})

// Yalnız meta-veri: kim / ne zaman / ne kadar. Ses kaydı alınmaz.
app.post('/api/device/calls', requireDevice, async (c) => {
  const b = await body(c)
  const calls = (Array.isArray(b.calls) ? b.calls.slice(0, 500) : []).filter((x: any) =>
    ['gelen', 'giden', 'cevapsiz'].includes(x?.direction),
  )
  for (const x of calls) {
    await q(
      `INSERT INTO calls (child_id, contact, direction, duration_sec, at) VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT DO NOTHING`,
      [c.get('childId'), optStr(x.contact, 80), x.direction, Math.round(num(x.durationSec, 0, 86_400) ?? 0), time(x.at)],
    )
  }
  return c.json({ saved: calls.length })
})

app.post('/api/device/unpair', requireDevice, async (c) => {
  await q('DELETE FROM devices WHERE id = $1', [c.get('deviceId')])
  return c.json({ ok: true })
})

app.all('/api/*', (c) => c.json({ error: 'Bulunamadı' }, 404))

// --- Web paneli (Vite çıktısı) --------------------------------------------

const dist = process.env.STATIC_DIR ?? 'dist'
app.use('/*', serveStatic({ root: dist }))
let indexHtml: string | null = null
app.get('*', (c) => {
  try {
    indexHtml ??= readFileSync(`${dist}/index.html`, 'utf8')
  } catch {
    return c.text('Panel derlenmemiş (npm run build)', 404)
  }
  return c.html(indexHtml)
})

await migrate()
const port = Number(process.env.PORT ?? 3000)
serve({ fetch: app.fetch, port, hostname: process.env.HOST ?? '::' }, () =>
  console.log(`Kanat API ${port} portunda`),
)
