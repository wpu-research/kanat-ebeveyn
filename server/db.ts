import pg from 'pg'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL tanımlı değil — Railway\'de Postgres servisini bağlayın.')
  process.exit(1)
}

export const pool = new pg.Pool({
  connectionString: url,
  max: 10,
  // Railway'in public proxy'si SSL ister; iç ağ (railway.internal) ve localhost istemez.
  ssl: /localhost|127\.0\.0\.1|\.railway\.internal/.test(url) ? undefined : { rejectUnauthorized: false },
})

export const q = <T extends pg.QueryResultRow = any>(text: string, params: unknown[] = []) =>
  pool.query<T>(text, params)

// Şema idempotent: her açılışta çalışır, yalnız eksikleri ekler.
const schema = `
CREATE TABLE IF NOT EXISTS parents (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text NOT NULL UNIQUE,
  name        text NOT NULL,
  pass_hash   text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash  text PRIMARY KEY,
  parent_id   uuid NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS children (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id     uuid NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  name          text NOT NULL,
  color         text NOT NULL,
  pair_code     text UNIQUE,
  pair_expires  timestamptz,
  rules         jsonb NOT NULL DEFAULT '{"dailyLimitMin":180,"sharing":{"location":true}}',
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS devices (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id     uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  token_hash   text NOT NULL UNIQUE,
  name         text,
  platform     text,
  app_version  text,
  battery      real,
  charging     boolean,
  last_seen    timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS locations (
  id           bigserial PRIMARY KEY,
  child_id     uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  lat          double precision NOT NULL,
  lng          double precision NOT NULL,
  accuracy     real,
  recorded_at  timestamptz NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS locations_child_time ON locations (child_id, recorded_at DESC);

CREATE TABLE IF NOT EXISTS events (
  id          bigserial PRIMARY KEY,
  child_id    uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  kind        text NOT NULL,
  data        jsonb NOT NULL DEFAULT '{}',
  status      text NOT NULL DEFAULT 'yeni',
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS events_child_time ON events (child_id, created_at DESC);

CREATE TABLE IF NOT EXISTS app_usage (
  child_id  uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  day       date NOT NULL,
  app       text NOT NULL,
  minutes   integer NOT NULL,
  PRIMARY KEY (child_id, day, app)
);

CREATE TABLE IF NOT EXISTS calls (
  id            bigserial PRIMARY KEY,
  child_id      uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  contact       text,
  direction     text NOT NULL,
  duration_sec  integer NOT NULL DEFAULT 0,
  at            timestamptz NOT NULL,
  UNIQUE (child_id, at, direction)
);
`

export async function migrate() {
  await q(schema)
  // Veri minimizasyonu: 30 günden eski konumlar silinir.
  await q(`DELETE FROM locations WHERE recorded_at < now() - interval '30 days'`)
}
