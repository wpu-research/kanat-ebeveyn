import { MapContainer, TileLayer, Circle, Polyline, Marker, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import { geofences, paths, type Child } from '../data'

const fenceColor = { ev: '#6366f1', okul: '#10b981', servis: '#f59e0b', kurs: '#06b6d4' }

function childIcon(child: Child) {
  return L.divIcon({
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    html: `<div style="position:relative;width:40px;height:40px">
      <span style="position:absolute;inset:0;border-radius:9999px;background:${child.color};opacity:.25;animation:ping 1.6s infinite"></span>
      <span style="position:absolute;inset:6px;border-radius:9999px;background:${child.color};border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);display:grid;place-items:center;color:#fff;font:600 12px Inter,sans-serif">${child.avatar}</span>
    </div>`,
  })
}

export default function MapView({ child, height = 360, showPath = true }: { child: Child; height?: number; showPath?: boolean }) {
  const { lat, lng } = child.location
  return (
    <div className="rounded-xl overflow-hidden" style={{ height }}>
      <style>{'@keyframes ping{75%,100%{transform:scale(1.8);opacity:0}}'}</style>
      <MapContainer key={child.id} center={[lat, lng]} zoom={15} scrollWheelZoom={false} style={{ height: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geofences[child.id].map((g) => (
          <Circle
            key={g.id}
            center={[g.lat, g.lng]}
            radius={g.radius}
            pathOptions={{ color: fenceColor[g.kind], fillOpacity: 0.12, weight: 2, dashArray: g.notify ? undefined : '4 4' }}
          >
            <Tooltip direction="top">{g.name}</Tooltip>
          </Circle>
        ))}
        {showPath && <Polyline positions={paths[child.id]} pathOptions={{ color: child.color, weight: 4, opacity: 0.7, dashArray: '1 8', lineCap: 'round' }} />}
        <Marker position={[lat, lng]} icon={childIcon(child)}>
          <Tooltip direction="right" offset={[18, 0]} permanent>
            {child.location.place}
          </Tooltip>
        </Marker>
      </MapContainer>
    </div>
  )
}
