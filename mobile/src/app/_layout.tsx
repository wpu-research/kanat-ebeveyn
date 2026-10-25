import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
// Arka plan konum görevini kaydeder; en üst seviyede yüklenmeli.
import '@/lib/tracking'

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  )
}
