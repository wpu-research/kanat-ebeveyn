import MapView, { Circle, Marker, Polyline } from 'react-native-maps'
import { Text, View } from 'react-native'
import { geofences, paths, type Child } from '@/data'
import { fenceColor } from '@/lib/theme'

export default function ChildMap({ child, height = 240 }: { child: Child; height?: number }) {
  const { lat, lng } = child.location
  return (
    <View style={{ height, borderRadius: 14, overflow: 'hidden' }}>
      <MapView
        key={child.id}
        style={{ flex: 1 }}
        initialRegion={{ latitude: lat, longitude: lng, latitudeDelta: 0.012, longitudeDelta: 0.012 }}
      >
        {geofences[child.id].map((g) => (
          <Circle
            key={g.id}
            center={{ latitude: g.lat, longitude: g.lng }}
            radius={g.radius}
            strokeColor={fenceColor[g.kind]}
            fillColor={fenceColor[g.kind] + '22'}
            strokeWidth={2}
          />
        ))}
        <Polyline
          coordinates={paths[child.id].map(([la, ln]) => ({ latitude: la, longitude: ln }))}
          strokeColor={child.color}
          strokeWidth={4}
          lineDashPattern={[2, 8]}
        />
        <Marker coordinate={{ latitude: lat, longitude: lng }} title={child.name} description={child.location.place}>
          <View
            style={{
              width: 30, height: 30, borderRadius: 15, backgroundColor: child.color,
              borderWidth: 3, borderColor: '#fff', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>{child.avatar}</Text>
          </View>
        </Marker>
      </MapView>
    </View>
  )
}
