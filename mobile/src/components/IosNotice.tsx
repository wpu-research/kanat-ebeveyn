import { Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { colors } from '@/lib/theme'
import { s } from './ui'

export default function IosNotice() {
  return (
    <View style={{ backgroundColor: colors.bg, borderRadius: 12, padding: 14, gap: 6 }}>
      <View style={s.row}>
        <Ionicons name="logo-apple" size={18} color={colors.text} />
        <Text style={s.strong}>{"iOS'ta mesaj analizi yapılamaz"}</Text>
      </View>
      <Text style={[s.muted, { lineHeight: 19 }]}>
        Apple, bir uygulamanın başka uygulamaların mesajlarını okumasına izin vermez. iPhone kullanan çocuklar için konum, ekran
        süresi (Screen Time) ve web filtresi sunulur.
      </Text>
    </View>
  )
}
