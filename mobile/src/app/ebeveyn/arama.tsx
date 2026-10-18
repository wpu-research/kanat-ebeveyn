import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { calls, fmtDur, type CallLog } from '@/data'
import { useChild } from '@/lib/child-context'
import { colors } from '@/lib/theme'
import { Card, Screen, s } from '@/components/ui'

const dirMeta = {
  gelen: { icon: 'call-outline', color: colors.green, label: 'Gelen' },
  giden: { icon: 'arrow-redo-outline', color: colors.sky, label: 'Giden' },
  cevapsiz: { icon: 'close-circle-outline', color: colors.red, label: 'Cevapsız' },
} as const

export default function CallsScreen() {
  const { child } = useChild()
  const [onlyUnknown, setOnlyUnknown] = useState(false)
  const list = calls[child.id] ?? []
  const shown = onlyUnknown ? list.filter((c) => !c.known) : list
  const risky = list.filter((c) => c.risky).length
  const totalMin = Math.round(list.reduce((t, c) => t + c.duration, 0) / 60)

  return (
    <Screen title="Arama Kayıtları">
      <Card style={{ flexDirection: 'row', gap: 10, backgroundColor: colors.primarySoft, borderColor: '#e0e7ff' }}>
        <Ionicons name="lock-closed" size={20} color={colors.primary} />
        <Text style={[s.body, { flex: 1, lineHeight: 20 }]}>
          Yalnızca arama meta-verisi gösterilir: kiminle, ne zaman, ne kadar. Görüşmelerin sesi kaydedilmez ve dinlenmez.
        </Text>
      </Card>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat label="Arama" value={String(list.length)} />
        <Stat label="Süre" value={`${totalMin} dk`} />
        <Stat label="Riskli" value={String(risky)} danger={risky > 0} />
      </View>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[false, true].map((v) => (
          <Pressable
            key={String(v)}
            onPress={() => setOnlyUnknown(v)}
            style={{
              paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1,
              backgroundColor: onlyUnknown === v ? colors.dark : '#fff', borderColor: onlyUnknown === v ? colors.dark : colors.border,
            }}
          >
            <Text style={{ color: onlyUnknown === v ? '#fff' : colors.text, fontSize: 13 }}>{v ? 'Bilinmeyen' : 'Tümü'}</Text>
          </Pressable>
        ))}
      </View>

      <Card style={{ padding: 0 }}>
        {shown.map((c, i) => (
          <CallRow key={c.id} call={c} last={i === shown.length - 1} />
        ))}
        {shown.length === 0 && <Text style={[s.muted, { textAlign: 'center', padding: 20 }]}>Kayıt yok.</Text>}
      </Card>

      <Text style={[s.faint, { lineHeight: 17 }]}>
        {"ⓘ Üretimde arama geçmişi Android'de okunur; iOS arama kaydını üçüncü parti uygulamaya vermez."}
      </Text>
    </Screen>
  )
}

function CallRow({ call, last }: { call: CallLog; last: boolean }) {
  const m = dirMeta[call.dir]
  return (
    <View style={[s.row, { padding: 14, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.border }]}>
      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={m.icon} size={18} color={m.color} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Text style={[s.body, { fontWeight: '600' }]}>{call.name ?? 'Bilinmeyen numara'}</Text>
          {!call.known && <Badge text="rehberde yok" bg="#f1f5f9" fg={colors.muted} />}
          {call.risky && <Badge text="riskli" bg="#fee2e2" fg={colors.red} />}
        </View>
        <Text style={s.faint}>{call.number} · {m.label}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={s.muted}>{fmtDur(call.duration)}</Text>
        <Text style={s.faint}>{call.time}</Text>
      </View>
    </View>
  )
}

function Badge({ text, bg, fg }: { text: string; bg: string; fg: string }) {
  return (
    <View style={{ backgroundColor: bg, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
      <Text style={{ color: fg, fontSize: 11 }}>{text}</Text>
    </View>
  )
}

function Stat({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <Card style={{ flex: 1, padding: 12 }}>
      <Text style={s.faint}>{label}</Text>
      <Text style={{ fontSize: 22, fontWeight: '700', color: danger ? colors.red : colors.text }}>{value}</Text>
    </Card>
  )
}
