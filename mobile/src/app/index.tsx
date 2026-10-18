import { router } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import { colors } from '@/lib/theme'

// Rol seçimi — gerçek uygulamada eşleştirme (pairing) akışıyla bir kez belirlenir.
export default function RoleSelect() {
  const insets = useSafeAreaInsets()
  return (
    <View style={[st.wrap, { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24 }]}>
      <View style={st.logo}>
        <Ionicons name="shield-checkmark" size={36} color="#fff" />
      </View>
      <Text style={st.brand}>Kanat</Text>
      <Text style={st.tagline}>Çocuğunuzun dijital dünyasında, mahremiyetine saygılı koruma.</Text>

      <View style={{ gap: 12, marginTop: 'auto' }}>
        <RoleCard
          icon="people"
          title="Ebeveynim"
          desc="Konum, ekran süresi, risk uyarıları ve kurallar"
          onPress={() => router.replace('/ebeveyn')}
        />
        <RoleCard
          icon="happy"
          title="Çocuğum"
          desc="Bu telefon korunan çocuğa ait"
          onPress={() => router.replace('/cocuk')}
        />
      </View>
      <Text style={st.demo}>Demo · Mock veri</Text>
    </View>
  )
}

function RoleCard({ icon, title, desc, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; desc: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [st.card, pressed && { opacity: 0.85 }]}>
      <View style={st.cardIcon}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={st.cardTitle}>{title}</Text>
        <Text style={st.cardDesc}>{desc}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#a5b4fc" />
    </Pressable>
  )
}

const st = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.dark, paddingHorizontal: 24 },
  logo: { width: 72, height: 72, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  brand: { color: '#fff', fontSize: 36, fontWeight: '800', marginTop: 20 },
  tagline: { color: '#cbd5e1', fontSize: 16, lineHeight: 23, marginTop: 8 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#1e293b', borderRadius: 18, padding: 18 },
  cardIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#e0e7ff', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  cardDesc: { color: '#94a3b8', fontSize: 13, marginTop: 2 },
  demo: { color: '#475569', fontSize: 12, textAlign: 'center', marginTop: 20 },
})
