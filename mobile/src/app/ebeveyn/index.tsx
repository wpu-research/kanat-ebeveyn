import { Text, View } from 'react-native'
import { router } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import { alerts, appUsage, categoryInfo, fmtMin, tierInfo, timeline } from '@/data'
import { useChild } from '@/lib/child-context'
import { colors } from '@/lib/theme'
import ChildMap from '@/components/ChildMap'
import IosNotice from '@/components/IosNotice'
import { AppIcon, Avatar, Card, Pill, Progress, Screen, SectionTitle, s } from '@/components/ui'

const dot = { giris: colors.green, cikis: colors.faint, uyari: colors.amber, bilgi: colors.primary }

export default function Overview() {
  const { child } = useChild()
  const childAlerts = alerts.filter((a) => a.childId === child.id)
  const open = childAlerts.filter((a) => a.status === 'yeni').length
  const pct = Math.round((child.screenToday / child.screenLimit) * 100)

  return (
    <Screen title="Genel Bakış">
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Avatar letter={child.avatar} color={child.color} size={52} />
        <View style={{ flex: 1 }}>
          <Text style={[s.strong, { fontSize: 18 }]}>{child.name}</Text>
          <Text style={s.muted}>
            {tierInfo[child.tier].label} profili · {child.age} yaş
          </Text>
          <Text style={s.faint}>
            {child.device} · {child.online ? 'Çevrimiçi' : 'Çevrimdışı'}
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Ionicons name="battery-half" size={22} color={child.battery < 35 ? colors.red : colors.green} />
          <Text style={s.faint}>%{child.battery}</Text>
        </View>
      </Card>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Stat icon="location" color={colors.primary} label="Şu an" value={child.location.place} sub={`${child.location.since}'den beri`} />
        <Stat icon="phone-portrait" color={colors.sky} label="Ekran süresi" value={fmtMin(child.screenToday)} sub={`Limitin %${pct}'i`} />
      </View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Stat
          icon="shield"
          color={open ? colors.red : colors.green}
          label="Açık uyarı"
          value={child.platform === 'ios' ? '—' : String(open)}
          sub={child.platform === 'ios' ? "iOS'ta yok" : 'Son 7 gün'}
        />
        <Stat icon="school" color={colors.green} label="Okul saati modu" value="Aktif" sub="08:30 – 15:10" />
      </View>

      <Card>
        <SectionTitle right={<Link label="Detay" onPress={() => router.navigate('/ebeveyn/konum')} />}>Canlı konum</SectionTitle>
        <ChildMap child={child} height={220} />
      </Card>

      <Card>
        <SectionTitle>Bugün</SectionTitle>
        {timeline[child.id].map((e, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 12, paddingVertical: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: dot[e.kind], marginTop: 4 }} />
            <Text style={[s.faint, { width: 42 }]}>{e.time}</Text>
            <Text style={[s.body, { flex: 1 }]}>{e.text}</Text>
          </View>
        ))}
      </Card>

      <Card>
        <SectionTitle right={<Link label="Tümü" onPress={() => router.navigate('/ebeveyn/ekran')} />}>En çok kullanılanlar</SectionTitle>
        <View style={{ gap: 12 }}>
          {appUsage[child.id].slice(0, 4).map((a) => (
            <View key={a.name} style={s.row}>
              <AppIcon name={a.name} color={a.color} />
              <View style={{ flex: 1, gap: 6 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[s.body, { flex: 1, fontWeight: '500' }]}>{a.name}</Text>
                  <Text style={s.muted}>{fmtMin(a.minutes)}</Text>
                </View>
                <Progress value={(a.minutes / (a.limit ?? 90)) * 100} danger={!!a.limit && a.minutes >= a.limit} />
              </View>
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <SectionTitle right={<Link label="Tümü" onPress={() => router.navigate('/ebeveyn/uyarilar')} />}>Son risk uyarıları</SectionTitle>
        {child.platform === 'ios' ? (
          <IosNotice />
        ) : (
          <View style={{ gap: 10 }}>
            {childAlerts.slice(0, 3).map((a) => (
              <View key={a.id} style={{ backgroundColor: colors.bg, borderRadius: 12, padding: 12, gap: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Pill label={categoryInfo[a.category].label} bg={categoryInfo[a.category].bg} fg={categoryInfo[a.category].fg} />
                  {a.status === 'yeni' && <View style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: 4, backgroundColor: colors.red }} />}
                </View>
                <Text style={s.body}>{a.summary}</Text>
                <Text style={s.faint}>{a.app} · {a.time}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>
    </Screen>
  )
}

function Stat({ icon, color, label, value, sub }: { icon: keyof typeof Ionicons.glyphMap; color: string; label: string; value: string; sub: string }) {
  return (
    <Card style={{ flex: 1, padding: 14 }}>
      <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: color + '1a', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={[s.faint, { marginTop: 10 }]}>{label}</Text>
      <Text style={s.strong} numberOfLines={1}>{value}</Text>
      <Text style={s.faint}>{sub}</Text>
    </Card>
  )
}

function Link({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Text onPress={onPress} style={{ color: colors.primary, fontWeight: '600', fontSize: 14 }}>
      {label} ›
    </Text>
  )
}
