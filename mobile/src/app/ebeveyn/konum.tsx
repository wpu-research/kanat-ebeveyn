import { useState } from 'react'
import { Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { geofences, timeline, type Geofence } from '@/data'
import { useChild } from '@/lib/child-context'
import { colors, fenceColor } from '@/lib/theme'
import ChildMap from '@/components/ChildMap'
import { Card, Screen, SectionTitle, Toggle, s } from '@/components/ui'

const kindIcon = { ev: 'home', okul: 'school', servis: 'bus', kurs: 'barbell' } as const

export default function LocationScreen() {
  const { child } = useChild()
  const [fences, setFences] = useState<Record<string, Geofence[]>>(geofences)

  const toggle = (id: string) =>
    setFences((f) => ({ ...f, [child.id]: f[child.id].map((g) => (g.id === id ? { ...g, notify: !g.notify } : g)) }))

  return (
    <Screen title="Konum">
      <Card>
        <Text style={s.strong}>{child.name} şu an: {child.location.place}</Text>
        <Text style={[s.faint, { marginBottom: 12 }]}>{`${child.location.since}'den beri · 1 dk önce güncellendi`}</Text>
        <ChildMap child={child} height={320} />
      </Card>

      <Card>
        <SectionTitle right={<Text style={{ color: colors.primary, fontWeight: '600' }}>+ Ekle</Text>}>Güvenli bölgeler</SectionTitle>
        <View style={{ gap: 12 }}>
          {fences[child.id].map((g) => (
            <View key={g.id} style={s.row}>
              <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: fenceColor[g.kind] + '1f', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={kindIcon[g.kind]} size={18} color={fenceColor[g.kind]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.body, { fontWeight: '500' }]}>{g.name}</Text>
                <Text style={s.faint}>{g.radius} m yarıçap · {g.notify ? 'Bildirim açık' : 'Bildirim kapalı'}</Text>
              </View>
              <Toggle value={g.notify} onChange={() => toggle(g.id)} />
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <SectionTitle>Konum geçmişi</SectionTitle>
        {timeline[child.id]
          .filter((e) => e.kind !== 'uyari')
          .map((e, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 12, paddingVertical: 5 }}>
              <Text style={[s.faint, { width: 42 }]}>{e.time}</Text>
              <Text style={[s.body, { flex: 1 }]}>{e.text}</Text>
            </View>
          ))}
      </Card>
    </Screen>
  )
}
