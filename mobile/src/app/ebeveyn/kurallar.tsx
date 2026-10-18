import { useState } from 'react'
import { Alert, Pressable, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import { tierInfo, type AgeTier, type Child } from '@/data'
import { useChild } from '@/lib/child-context'
import { colors } from '@/lib/theme'
import { Button, Card, Screen, SectionTitle, Toggle, s } from '@/components/ui'

const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum']
const bedtimeFor: Record<AgeTier, string> = { kucuk: '21:30', ergen: '22:30', genc: '23:30' }

export default function RulesScreen() {
  const { child } = useChild()
  // Çocuk değişince form o çocuğun varsayılanlarıyla yeniden kurulur
  return <RulesForm key={child.id} child={child} />
}

function RulesForm({ child }: { child: Child }) {
  const [tier, setTier] = useState<AgeTier>(child.tier)
  const [schoolMode, setSchoolMode] = useState(true)
  const [schoolDays, setSchoolDays] = useState(days)
  const [bedtime, setBedtime] = useState(true)
  const [approval, setApproval] = useState(child.tier === 'kucuk')
  const [filter, setFilter] = useState(child.tier === 'genc' ? 'temel' : 'siki')


  return (
    <Screen title="Kurallar">
      <Card>
        <SectionTitle>Yaş profili</SectionTitle>
        <Text style={[s.muted, { marginTop: -6, marginBottom: 12 }]}>Çocuk büyüdükçe kurallar gevşer.</Text>
        <View style={{ gap: 10 }}>
          {(Object.keys(tierInfo) as AgeTier[]).map((t) => {
            const info = tierInfo[t]
            const active = tier === t
            return (
              <Pressable
                key={t}
                onPress={() => setTier(t)}
                style={{
                  borderWidth: 2, borderRadius: 14, padding: 12,
                  borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primarySoft : '#fff',
                }}
              >
                <View style={s.row}>
                  <Text style={s.strong}>{info.label}</Text>
                  <Text style={s.faint}>{info.range}</Text>
                  {active && <Ionicons name="checkmark-circle" size={20} color={colors.primary} style={{ marginLeft: 'auto' }} />}
                </View>
                <Text style={[s.muted, { marginTop: 4 }]}>{info.desc}</Text>
                {active && <Text style={[s.faint, { marginTop: 6 }]}>{info.rules.join(' · ')}</Text>}
              </Pressable>
            )
          })}
        </View>
      </Card>

      <Card>
        <RuleRow icon="school" color={colors.green} title="Okul saati modu" desc="Ders saatinde oyun ve sosyal medya kapanır; arama ve eğitim açık kalır." value={schoolMode} onChange={setSchoolMode} />
        {schoolMode && (
          <View style={{ marginTop: 12, gap: 10 }}>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {days.map((d) => {
                const on = schoolDays.includes(d)
                return (
                  <Pressable
                    key={d}
                    onPress={() => setSchoolDays((st) => (on ? st.filter((x) => x !== d) : [...st, d]))}
                    style={{
                      flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center', borderWidth: 1,
                      backgroundColor: on ? colors.green : '#fff', borderColor: on ? colors.green : colors.border,
                    }}
                  >
                    <Text style={{ color: on ? '#fff' : colors.text, fontSize: 12, fontWeight: '600' }}>{d}</Text>
                  </Pressable>
                )
              })}
            </View>
            <Text style={s.muted}>🕗 08:30 – 15:10 · 📍 Okul bölgesine girince de otomatik başlar</Text>
          </View>
        )}
      </Card>

      <Card>
        <RuleRow icon="moon" color={colors.primary} title="Yatma saati" desc="Cihaz yalnızca arama ve alarm için açık kalır." value={bedtime} onChange={setBedtime} />
        {bedtime && <Text style={[s.muted, { marginTop: 10 }]}>🌙 {bedtimeFor[tier]} – 07:00</Text>}
      </Card>

      <Card>
        <RuleRow icon="download" color={colors.sky} title="Uygulama yükleme onayı" desc="Yeni uygulama için izin istenir." value={approval} onChange={setApproval} />
      </Card>

      <Card>
        <SectionTitle>Web filtresi</SectionTitle>
        <View style={{ flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 10, padding: 4 }}>
          {[['temel', 'Temel'], ['orta', 'Orta'], ['siki', 'Sıkı']].map(([v, l]) => (
            <Pressable
              key={v}
              onPress={() => setFilter(v)}
              style={{ flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center', backgroundColor: filter === v ? '#fff' : 'transparent' }}
            >
              <Text style={{ fontWeight: filter === v ? '700' : '400', color: filter === v ? colors.text : colors.muted }}>{l}</Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <Button label={`${child.name} için kaydet`} onPress={() => Alert.alert('Kaydedildi', 'Kurallar cihaza gönderildi (demo).')} />
      <Button label="Rol seçimine dön" variant="outline" onPress={() => router.replace('/')} />
    </Screen>
  )
}

function RuleRow({ icon, color, title, desc, value, onChange }: { icon: keyof typeof Ionicons.glyphMap; color: string; title: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={s.row}>
      <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: color + '1a', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.strong}>{title}</Text>
        <Text style={s.faint}>{desc}</Text>
      </View>
      <Toggle value={value} onChange={onChange} />
    </View>
  )
}
