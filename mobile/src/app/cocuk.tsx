import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, AppState, Linking, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { router } from 'expo-router'
import * as Device from 'expo-device'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { fmtMin } from '@/data'
import { colors } from '@/lib/theme'
import { getPairedChild, heartbeat, pair, requestExtraTime, sendSos, UnpairedError, type DeviceState, type PairedChild } from '@/lib/api'
import { sendCurrentLocation, startTracking, trackingStatus, type TrackingStatus } from '@/lib/tracking'
import { Avatar, Button, Card, SectionTitle, s } from '@/components/ui'

// Çocuğun telefonundaki görünüm: neyin paylaşıldığı açıkça gösterilir (gizli takip yok).
const shared: { icon: keyof typeof Ionicons.glyphMap; title: string; desc: string; on: boolean }[] = [
  { icon: 'location', title: 'Konum', desc: 'Ailen nerede olduğunu görebilir', on: true },
  { icon: 'battery-half', title: 'Pil durumu', desc: 'Telefonunun şarjı bitmek üzereyse ailen bilir', on: true },
  { icon: 'hand-left', title: 'Yardım ve ek süre istekleri', desc: 'Yalnız sen gönderdiğinde', on: true },
  { icon: 'chatbubbles', title: 'Mesajların ve aramaların', desc: 'Paylaşılmaz', on: false },
]

export default function ChildScreen() {
  const [child, setChild] = useState<PairedChild | null | undefined>(undefined)

  useEffect(() => {
    getPairedChild().then(setChild)
  }, [])

  if (child === undefined) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    )
  }
  if (!child) return <PairScreen onPaired={setChild} />
  return <ChildHome child={child} onUnpaired={() => setChild(null)} />
}

function PairScreen({ onPaired }: { onPaired: (c: PairedChild) => void }) {
  const insets = useSafeAreaInsets()
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    setBusy(true)
    try {
      const c = await pair(code, Device.modelName ?? Device.deviceName, Platform.OS)
      onPaired(c)
    } catch (e) {
      Alert.alert('Eşleşmedi', (e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={[s.content, { paddingTop: insets.top + 32 }]} keyboardShouldPersistTaps="handled">
      <Ionicons name="link" size={40} color={colors.primary} />
      <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text }}>Telefonu ailene bağla</Text>
      <Text style={s.muted}>
        Annen ya da baban Kanat panelinde seni eklediğinde 6 haneli bir kod görür. O kodu buraya gir.
      </Text>
      <TextInput
        value={code}
        onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))}
        keyboardType="number-pad"
        placeholder="000000"
        placeholderTextColor={colors.faint}
        maxLength={6}
        style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 16, paddingVertical: 16, fontSize: 32, letterSpacing: 10, textAlign: 'center', fontWeight: '700', color: colors.text }}
      />
      {busy ? <ActivityIndicator color={colors.primary} /> : <Button label="Bağla" onPress={code.length === 6 ? submit : undefined} />}
      <Card>
        <SectionTitle>Bağlanınca ailenle neler paylaşılır?</SectionTitle>
        <SharedList />
      </Card>
      <Button label="Rol seçimine dön" variant="outline" onPress={() => router.replace('/')} />
    </ScrollView>
  )
}

function ChildHome({ child, onUnpaired }: { child: PairedChild; onUnpaired: () => void }) {
  const insets = useSafeAreaInsets()
  const [state, setState] = useState<DeviceState | null>(null)
  const [tracking, setTracking] = useState<TrackingStatus | null>(null)
  const [offline, setOffline] = useState(false)

  const refresh = useCallback(async () => {
    try {
      setState(await heartbeat())
      setOffline(false)
      setTracking(await trackingStatus())
      await sendCurrentLocation()
    } catch (e) {
      if (e instanceof UnpairedError) onUnpaired()
      else setOffline(true)
    }
  }, [onUnpaired])

  useEffect(() => {
    // Önce izin istenir, sonra ilk konum ve durum gönderilir.
    startTracking()
      .catch((): TrackingStatus => 'kapali')
      .then((st) => {
        setTracking(st)
        refresh()
      })
    const t = setInterval(refresh, 60_000)
    const sub = AppState.addEventListener('change', (st) => st === 'active' && refresh())
    return () => {
      clearInterval(t)
      sub.remove()
    }
  }, [refresh])

  const sos = () =>
    Alert.alert('Acil durum', 'Konumun ve yardım isteğin ailene gönderilsin mi?', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Gönder',
        style: 'destructive',
        onPress: async () => {
          try {
            const p = await sendCurrentLocation()
            await sendSos(p ?? {})
            Alert.alert('Gönderildi', 'Ailene yardım isteğin ve konumun iletildi.')
          } catch (e) {
            Alert.alert('Gönderilemedi', `${(e as Error).message}\nİnternet yoksa 112'yi arayabilirsin.`)
          }
        },
      },
    ])

  const askExtra = async () => {
    try {
      setState(await requestExtraTime(30))
    } catch (e) {
      Alert.alert('Gönderilemedi', (e as Error).message)
    }
  }

  const limit = state ? state.rules.dailyLimitMin + state.extraMinutesToday : null
  const lastReq = state?.requests[0]
  const pendingReq = lastReq?.status === 'yeni'

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={[s.content, { paddingTop: insets.top + 16 }]}>
      <View style={[s.row, { marginBottom: 4 }]}>
        <Avatar letter={child.name[0]?.toUpperCase() ?? '?'} color={state?.child.color ?? child.color} size={44} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text }}>Merhaba {state?.child.name ?? child.name} 👋</Text>
          <Text style={s.muted}>{offline ? 'İnternet yok — bağlanınca gönderilecek' : 'Ailene bağlısın'}</Text>
        </View>
      </View>

      <Pressable onPress={sos} style={({ pressed }) => ({ backgroundColor: pressed ? '#dc2626' : colors.red, borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 14 })}>
        <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#ffffff33', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="alert" size={30} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>Yardım lazım</Text>
          <Text style={{ color: '#fee2e2', fontSize: 13 }}>Ailene konumunu ve yardım isteğini gönder</Text>
        </View>
      </Pressable>

      {tracking && tracking !== 'arka-plan' && (
        <Card style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}>
          <Text style={[s.strong, { color: '#92400e' }]}>
            {tracking === 'kapali' ? 'Konum izni kapalı' : 'Konum yalnız uygulama açıkken paylaşılıyor'}
          </Text>
          <Text style={{ color: '#b45309', fontSize: 13, marginTop: 4, marginBottom: 10 }}>
            {tracking === 'kapali'
              ? 'Ailen nerede olduğunu göremez. Ayarlardan konum iznini açabilirsin.'
              : 'Uygulama kapalıyken de paylaşmak için ayarlardan "Her zaman izin ver" seçeneğini aç.'}
          </Text>
          <Button label="Ayarları aç" variant="outline" onPress={() => Linking.openSettings()} />
        </Card>
      )}

      <Card>
        <SectionTitle right={limit !== null ? <Text style={s.muted}>{fmtMin(limit)}</Text> : null}>Bugünkü ekran süresi sınırın</SectionTitle>
        {state && state.extraMinutesToday > 0 && (
          <Text style={[s.faint, { marginBottom: 8 }]}>Bugün +{state.extraMinutesToday} dk ek süre onaylandı</Text>
        )}
        {pendingReq ? (
          <Text style={[s.muted, { textAlign: 'center' }]}>⏳ Ek süre isteğin ailene iletildi</Text>
        ) : (
          <>
            {lastReq?.status === 'reddedildi' && <Text style={[s.faint, { marginBottom: 8 }]}>Son ek süre isteğin reddedildi</Text>}
            <Button label="+30 dk ek süre iste" variant="outline" onPress={askExtra} />
          </>
        )}
      </Card>

      <Card>
        <SectionTitle>Ailenle neler paylaşılıyor?</SectionTitle>
        <SharedList />
      </Card>
    </ScrollView>
  )
}

function SharedList() {
  return (
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
  )
}
