import { useState } from 'react'
import { Linking, Pressable, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { alerts as initial, categoryInfo, type RiskAlert } from '@/data'
import { useChild } from '@/lib/child-context'
import { colors } from '@/lib/theme'
import IosNotice from '@/components/IosNotice'
import { Button, Card, Pill, Screen, s } from '@/components/ui'

const sev = { yuksek: ['Yüksek', colors.red], orta: ['Orta', colors.amber], dusuk: ['Düşük', colors.faint] } as const

const guidance: Record<RiskAlert['category'], string> = {
  zorbalik: 'Suçlamadan konuşun, yalnız olmadığını hissettirin. Gerekirse okul rehberlik servisiyle iletişime geçin.',
  grooming: 'Hesabı engelleyip bildirin, mesajları silmeyin. Ciddi durumda 155 veya ihbarweb.org.tr üzerinden bildirimde bulunun.',
  'kendine-zarar': 'Sakin ve yargısız bir konuşma açın. Destek için 112 veya bir uzmana başvurun.',
  madde: 'Merakla soru sorun, ders vermekten kaçının. Gerekirse bir uzmana danışın.',
  mustehcen: 'Yaşa uygun bir dille konuşun. Web filtresi seviyesini gözden geçirin.',
}

export default function AlertsScreen() {
  const { child } = useChild()
  const [items, setItems] = useState(initial)
  const [onlyNew, setOnlyNew] = useState(false)

  if (child.platform === 'ios') {
    return (
      <Screen title="Risk Uyarıları">
        <IosNotice />
      </Screen>
    )
  }

  const list = items.filter((a) => a.childId === child.id && (!onlyNew || a.status === 'yeni'))
  const markRead = (id: string) => setItems((st) => st.map((a) => (a.id === id ? { ...a, status: 'incelendi' } : a)))

  return (
    <Screen title="Risk Uyarıları">
      <Card style={{ flexDirection: 'row', gap: 10, backgroundColor: colors.primarySoft, borderColor: '#e0e7ff' }}>
        <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
        <Text style={[s.body, { flex: 1, lineHeight: 20 }]}>
          {`Analiz ${child.name}'in cihazında yapılır. Mesajların tamamı size gönderilmez, yalnızca risk kategorisi ve maskelenmiş kısa bir bağlam gösterilir.`}
        </Text>
      </Card>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[false, true].map((v) => (
          <Pressable
            key={String(v)}
            onPress={() => setOnlyNew(v)}
            style={{
              paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1,
              backgroundColor: onlyNew === v ? colors.dark : '#fff', borderColor: onlyNew === v ? colors.dark : colors.border,
            }}
          >
            <Text style={{ color: onlyNew === v ? '#fff' : colors.text, fontSize: 13 }}>{v ? 'Yeni' : 'Tümü'}</Text>
          </Pressable>
        ))}
      </View>

      {list.length === 0 && (
        <Card>
          <Text style={[s.muted, { textAlign: 'center' }]}>Yeni uyarı yok 🎉</Text>
        </Card>
      )}

      {list.map((a) => (
        <Card key={a.id} style={a.status === 'yeni' ? { borderColor: '#fecaca' } : undefined}>
          <View style={[s.row, { gap: 8 }]}>
            <Pill label={categoryInfo[a.category].label} bg={categoryInfo[a.category].bg} fg={categoryInfo[a.category].fg} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: sev[a.severity][1] }} />
            <Text style={s.faint}>{sev[a.severity][0]} risk</Text>
          </View>
          <Text style={[s.strong, { marginTop: 10 }]}>{a.summary}</Text>
          <Text style={[s.faint, { marginTop: 2 }]}>{a.app} · {a.time}</Text>

          <View style={{ flexDirection: 'row', gap: 8, backgroundColor: colors.bg, borderRadius: 10, padding: 10, marginTop: 10 }}>
            <Ionicons name="eye-off-outline" size={16} color={colors.faint} />
            <Text style={[s.muted, { flex: 1, fontStyle: 'italic' }]}>{a.context}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, backgroundColor: '#ecfdf5', borderRadius: 10, padding: 10, marginTop: 8 }}>
            <Ionicons name="heart-outline" size={16} color="#047857" />
            <Text style={{ flex: 1, color: '#065f46', fontSize: 13, lineHeight: 19 }}>{guidance[a.category]}</Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            {a.status === 'yeni' ? (
              <Button label="İncelendi" onPress={() => markRead(a.id)} />
            ) : (
              <Text style={[s.faint, { alignSelf: 'center' }]}>✓ İncelendi</Text>
            )}
            <Button label={`${child.name}'i ara`} variant="outline" onPress={() => Linking.openURL('tel:05000000000')} />
          </View>
        </Card>
      ))}
    </Screen>
  )
}
