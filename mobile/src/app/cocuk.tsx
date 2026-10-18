import { useState } from 'react'
import { Alert, Pressable, ScrollView, Text, View } from 'react-native'
import { router } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { children, fmtMin, tierInfo } from '@/data'
import { colors } from '@/lib/theme'
import { Avatar, Button, Card, Progress, SectionTitle, s } from '@/components/ui'

// Çocuğun telefonundaki görünüm: neyin paylaşıldığı açıkça gösterilir (gizli takip yok).
const child = children[0]

const shared: { icon: keyof typeof Ionicons.glyphMap; title: string; desc: string; on: boolean }[] = [
  { icon: 'location', title: 'Konum', desc: 'Ailen nerede olduğunu görebilir', on: true },
  { icon: 'phone-portrait', title: 'Ekran süresi', desc: 'Hangi uygulamayı ne kadar kullandığın', on: true },
  { icon: 'shield-checkmark', title: 'Güvenlik uyarıları', desc: 'Yalnız risk algılanırsa kısa bir uyarı gider. Mesajların okunmaz.', on: true },
  { icon: 'chatbubbles', title: 'Mesajlarının tamamı', desc: 'Paylaşılmaz', on: false },
]

export default function ChildHome() {
  const insets = useSafeAreaInsets()
  const [requested, setRequested] = useState(false)
  const left = child.screenLimit - child.screenToday

  const sos = () =>
    Alert.alert('Acil durum', 'Konumun ailene gönderilsin ve annen/baban aransın mı?', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Gönder', style: 'destructive', onPress: () => Alert.alert('Gönderildi', 'Ailene konumun ve acil durum bildirimi iletildi (demo).') },
    ])

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={[s.content, { paddingTop: insets.top + 16 }]}>
      <View style={[s.row, { marginBottom: 4 }]}>
        <Avatar letter={child.avatar} color={child.color} size={44} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text }}>Merhaba {child.name} 👋</Text>
          <Text style={s.muted}>{tierInfo[child.tier].label} profili</Text>
        </View>
      </View>

      <Pressable onPress={sos} style={({ pressed }) => ({ backgroundColor: pressed ? '#dc2626' : colors.red, borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 14 })}>
        <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#ffffff33', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="alert" size={30} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>Yardım lazım</Text>
          <Text style={{ color: '#fee2e2', fontSize: 13 }}>Ailene konumunu gönder ve ara</Text>
        </View>
      </Pressable>

      <Card>
        <SectionTitle right={<Text style={s.muted}>{fmtMin(left)} kaldı</Text>}>Bugünkü ekran süren</SectionTitle>
        <Progress value={(child.screenToday / child.screenLimit) * 100} />
        <Text style={[s.faint, { marginTop: 8 }]}>{fmtMin(child.screenToday)} / {fmtMin(child.screenLimit)}</Text>
        <View style={{ marginTop: 12 }}>
          {requested ? (
            <Text style={[s.muted, { textAlign: 'center' }]}>⏳ Ek süre isteğin ailene iletildi</Text>
          ) : (
            <Button label="+30 dk ek süre iste" variant="outline" onPress={() => setRequested(true)} />
          )}
        </View>
      </Card>

      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }}>
        <Ionicons name="school" size={22} color="#047857" />
        <View style={{ flex: 1 }}>
          <Text style={[s.strong, { color: '#065f46' }]}>Okul saati modu açık</Text>
          <Text style={{ color: '#047857', fontSize: 13 }}>{"15:10'a kadar oyun ve sosyal medya kapalı"}</Text>
        </View>
      </Card>

      <Card>
        <SectionTitle>Ailenle neler paylaşılıyor?</SectionTitle>
        <View style={{ gap: 14 }}>
          {shared.map((x) => (
            <View key={x.title} style={s.row}>
              <Ionicons name={x.icon} size={20} color={x.on ? colors.primary : colors.faint} />
              <View style={{ flex: 1 }}>
                <Text style={[s.body, { fontWeight: '600' }]}>{x.title}</Text>
                <Text style={s.faint}>{x.desc}</Text>
              </View>
              <Ionicons name={x.on ? 'eye' : 'eye-off'} size={18} color={x.on ? colors.green : colors.faint} />
            </View>
          ))}
        </View>
      </Card>

      <Button label="Rol seçimine dön" variant="outline" onPress={() => router.replace('/')} />
    </ScrollView>
  )
}
