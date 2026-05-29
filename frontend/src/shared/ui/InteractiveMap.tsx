import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

interface MapPin {
  label: string
  tone: 'red' | 'orange' | 'blue'
  sucursal: string
  x?: string  // percentage styles from backend
  y?: string
}

interface InteractiveMapProps {
  pins: MapPin[]
}

// Latitudes and Longitudes of main cities in Ecuador
const cityCoordinates: { [key: string]: [number, number] } = {
  "Quito": [-0.1807, -78.4678],
  "Guayaquil": [-2.1708, -79.9224],
  "Cuenca": [-2.9001, -79.0059],
  "Esmeraldas": [0.9682, -79.6517],
  "Ibarra": [0.3517, -78.1222],
  "Portoviejo": [-1.0546, -80.4542],
  "Manta": [-0.9677, -80.7089],
  "Ambato": [-1.2491, -78.6168],
  "Riobamba": [-1.6709, -78.6473],
  "Loja": [-3.9931, -79.2042]
}

export function InteractiveMap({ pins }: InteractiveMapProps) {
  // Center of Ecuador
  const center: [number, number] = [-1.5000, -78.5000]
  const zoom = 6.8

  const getMarkerColor = (tone: string) => {
    switch (tone) {
      case 'red':
        return '#ef4444' // Crimson red for critical
      case 'orange':
        return '#f97316' // Orange for high
      default:
        return '#3b82f6' // Blue for normal/low
    }
  }

  const getMarkerRadius = (countStr: string) => {
    const count = parseInt(countStr, 10) || 5
    // Scale radius logarithmically or linearly between 8 and 22
    return Math.min(24, Math.max(8, count * 1.5))
  }

  return (
    <div style={{ height: '100%', width: '100%', borderRadius: '14px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(15, 23, 42, 0.08)' }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', background: '#f8fafc' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {pins.map((pin, idx) => {
          const coords = cityCoordinates[pin.sucursal] || center
          const color = getMarkerColor(pin.tone)
          const radius = getMarkerRadius(pin.label)

          return (
            <CircleMarker
              key={idx}
              center={coords}
              radius={radius}
              fillColor={color}
              color={color}
              weight={1.5}
              opacity={0.8}
              fillOpacity={0.4}
            >
              <Popup>
                <div style={{ fontFamily: 'sans-serif', fontSize: '13px', padding: '2px' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#0f172a', fontWeight: 'bold' }}>{pin.sucursal}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      display: 'inline-block', 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: color 
                    }} />
                    <span><strong>{pin.label}</strong> siniestros auditados</span>
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '11px', color: '#64748b' }}>
                    Nivel de Alerta: {pin.tone === 'red' ? 'Crítico' : pin.tone === 'orange' ? 'Alto' : 'Bajo'}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>
    </div>
  )
}
