import type { ReactNode } from 'react'
import { Pressable, ScrollView, StyleSheet, Switch as RNSwitch, Text, View, type ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { children } from '@/data'
import { useChild } from '@/lib/child-context'
import { colors } from '@/lib/theme'

export function Screen({ title, children: body, scroll = true }: { title: string; children: ReactNode; scroll?: boolean }) {
  const insets = useSafeAreaInsets()
  const header = (
    <View style={[s.header, { paddingTop: insets.top + 8 }]}>
      <Text style={s.title}>{title}</Text>
      <ChildSwitcher />
    </View>
  )
  return (
    <View style={s.screen}>
      {header}
      {scroll ? (
        <ScrollView contentContainerStyle={s.content}>{body}</ScrollView>
      ) : (
        <View style={[s.content, { flex: 1 }]}>{body}</View>
      )}
    </View>
  )
}

function ChildSwitcher() {
  const { child, setChildId } = useChild()
  return (
    <View style={s.switcher}>
      {children.map((c) => {
        const active = c.id === child.id
        return (
          <Pressable
            key={c.id}
            onPress={() => setChildId(c.id)}
            style={[s.chip, active && { borderColor: colors.primary, backgroundColor: colors.primarySoft }]}
          >
            <Avatar letter={c.avatar} color={c.color} size={24} />
            <Text style={[s.chipText, active && { color: colors.primary }]}>{c.name}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

export function Avatar({ letter, color, size = 40 }: { letter: string; color: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: size * 0.42 }}>{letter}</Text>
    </View>
  )
}

export function Card({ children: body, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[s.card, style]}>{body}</View>
}

export function SectionTitle({ children: text, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <View style={s.sectionRow}>
      <Text style={s.sectionTitle}>{text}</Text>
      {right}
    </View>
  )
}

export function Progress({ value, danger }: { value: number; danger?: boolean }) {
  return (
    <View style={s.track}>
      <View style={[s.fill, { width: `${Math.min(100, value)}%`, backgroundColor: danger ? colors.red : colors.primary }]} />
    </View>
  )
}

export function Pill({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <View style={{ backgroundColor: bg, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' }}>
      <Text style={{ color: fg, fontSize: 11, fontWeight: '600' }}>{label}</Text>
    </View>
  )
}

export function Button({ label, onPress, variant = 'primary' }: { label: string; onPress?: () => void; variant?: 'primary' | 'outline' | 'danger' }) {
  const v = {
    primary: { bg: colors.primary, fg: '#fff', border: colors.primary },
    outline: { bg: '#fff', fg: colors.text, border: colors.border },
    danger: { bg: '#fff', fg: colors.red, border: '#fecaca' },
  }[variant]
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.button, { backgroundColor: v.bg, borderColor: v.border, opacity: pressed ? 0.8 : 1 }]}
    >
      <Text style={{ color: v.fg, fontWeight: '600', fontSize: 14 }}>{label}</Text>
    </Pressable>
  )
}

export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return <RNSwitch value={value} onValueChange={onChange} trackColor={{ true: colors.primary, false: '#cbd5e1' }} thumbColor="#fff" />
}

export function AppIcon({ name, color, size = 38 }: { name: string; color: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: 10, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#fff', fontWeight: '800' }}>{name[0]}</Text>
    </View>
  )
}

export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: '#fff', paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 10 },
  switcher: { flexDirection: 'row', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingLeft: 4, paddingRight: 12, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: colors.border },
  chipText: { fontSize: 14, color: colors.text, fontWeight: '500' },
  content: { padding: 16, gap: 14, paddingBottom: 32 },
  card: { backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 16 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, flex: 1 },
  track: { height: 6, backgroundColor: '#f1f5f9', borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
  button: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  muted: { color: colors.muted, fontSize: 13 },
  faint: { color: colors.faint, fontSize: 12 },
  body: { color: colors.text, fontSize: 14 },
  strong: { color: colors.text, fontSize: 15, fontWeight: '600' },
})
