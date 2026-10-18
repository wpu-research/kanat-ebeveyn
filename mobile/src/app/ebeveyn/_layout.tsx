import type { ColorValue } from 'react-native'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import { alerts } from '@/data'
import { ChildProvider } from '@/lib/child-context'
import { colors } from '@/lib/theme'

type IconName = keyof typeof Ionicons.glyphMap

function icon(name: IconName) {
  return function TabIcon({ color, size }: { color: ColorValue; size: number }) {
    return <Ionicons name={name} size={size} color={color as string} />
  }
}

export default function ParentLayout() {
  const newAlerts = alerts.filter((a) => a.status === 'yeni').length
  return (
    <ChildProvider>
      <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.faint }}>
        <Tabs.Screen name="index" options={{ title: 'Genel', tabBarIcon: icon('grid') }} />
        <Tabs.Screen name="konum" options={{ title: 'Konum', tabBarIcon: icon('location') }} />
        <Tabs.Screen name="ekran" options={{ title: 'Ekran', tabBarIcon: icon('phone-portrait') }} />
        <Tabs.Screen
          name="uyarilar"
          options={{ title: 'Uyarılar', tabBarIcon: icon('shield'), tabBarBadge: newAlerts || undefined }}
        />
        <Tabs.Screen name="kurallar" options={{ title: 'Kurallar', tabBarIcon: icon('options') }} />
      </Tabs>
    </ChildProvider>
  )
}
