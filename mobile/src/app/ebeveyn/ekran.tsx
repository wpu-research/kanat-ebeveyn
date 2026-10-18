import { useState } from 'react'
import { Alert, Pressable, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { appUsage, fmtMin, weekly, type AppUsage } from '@/data'
import { useChild } from '@/lib/child-context'
import { colors } from '@/lib/theme'
import { AppIcon, Button, Card, Progress, Screen, SectionTitle, s } from '@/components/ui'

export default function ScreenTimeScreen() {
  const { child } = useChild()
  const [apps, setApps] = useState<Record<string, AppUsage[]>>(appUsage)
  const [extra, setExtra] = useState<Record<string, number>>({})
  const limit = child.screenLimit + (extra[child.id] ?? 0)
  const pct = Math.min(100, Math.round((child.screenToday / limit) * 100))
  const week = weekly[child.id]
  const max = Math.max(...week.map((d) => d.dakika), child.screenLimit)
  const avg = Math.round(week.reduce((t, d) => t + d.dakika, 0) / week.length)

  const update = (name: string, fn: (a: AppUsage) => AppUsage) =>
    setApps((st) => ({ ...st, [child.id]: st[child.id].map((a) => (a.name === name ? fn(a) : a)) }))

  return (
    <Screen title="Ekran Süresi">
      <Card style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 40, fontWeight: '800', color: pct >= 90 ? colors.red : colors.text }}>%{pct}</Text>
        <Text style={[s.strong, { marginTop: 2 }]}>{fmtMin(child.screenToday)}</Text>
        <Text style={s.muted}>Günlük limit: {fmtMin(limit)}</Text>
        <View style={{ alignSelf: 'stretch', marginTop: 14 }}>
          <Progress value={pct} danger={pct >= 90} />
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          <Button label="+15 dk ver" variant="outline" onPress={() => setExtra((e) => ({ ...e, [child.id]: (e[child.id] ?? 0) + 15 }))} />
          <Button label="Cihazı kilitle" onPress={() => Alert.alert('Cihaz kilitlendi', `${child.name}'in telefonu kilitlendi (demo).`)} />
        </View>
      </Card>

      <Card>
        <SectionTitle right={<Text style={s.muted}>Ort. {fmtMin(avg)}</Text>}>Bu hafta</SectionTitle>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 150, gap: 8 }}>
          {week.map((d) => (
            <View key={d.day} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
              <View
                style={{
                  width: '100%',
                  height: (d.dakika / max) * 124,
                  borderRadius: 6,
                  backgroundColor: d.dakika > child.screenLimit ? '#f87171' : colors.primary,
                }}
              />
              <Text style={s.faint}>{d.day}</Text>
            </View>
          ))}
        </View>
        <Text style={[s.faint, { marginTop: 8 }]}>Kırmızı çubuklar limiti aşan günler.</Text>
      </Card>

      <Card>
        <SectionTitle>Uygulamalar ve limitler</SectionTitle>
        <View style={{ gap: 16 }}>
          {apps[child.id].map((a) => (
            <View key={a.name} style={{ gap: 8 }}>
              <View style={s.row}>
                <AppIcon name={a.name} color={a.color} />
                <View style={{ flex: 1 }}>
                  <Text style={[s.body, { fontWeight: '500' }]}>{a.name}</Text>
                  <Text style={s.faint}>
                    {a.blocked ? 'Engellendi' : `${fmtMin(a.minutes)} · ${a.limit ? `limit ${fmtMin(a.limit)}` : 'limitsiz'}`}
                  </Text>
                </View>
                {!a.blocked && (
                  <>
                    <Step icon="remove" onPress={() => update(a.name, (x) => ({ ...x, limit: Math.max(15, (x.limit ?? 60) - 15) }))} />
                    <Step icon="add" onPress={() => update(a.name, (x) => ({ ...x, limit: (x.limit ?? 45) + 15 }))} />
                  </>
                )}
                <Pressable onPress={() => update(a.name, (x) => ({ ...x, blocked: !x.blocked }))}>
                  <Ionicons name={a.blocked ? 'lock-closed' : 'lock-open-outline'} size={22} color={a.blocked ? colors.red : colors.faint} />
                </Pressable>
              </View>
              {!a.blocked && <Progress value={(a.minutes / (a.limit ?? 120)) * 100} danger={!!a.limit && a.minutes >= a.limit} />}
            </View>
          ))}
        </View>
      </Card>
    </Screen>
  )
}

function Step({ icon, onPress }: { icon: 'add' | 'remove'; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{ width: 30, height: 30, borderRadius: 8, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}
    >
      <Ionicons name={icon} size={16} color={colors.text} />
    </Pressable>
  )
}
