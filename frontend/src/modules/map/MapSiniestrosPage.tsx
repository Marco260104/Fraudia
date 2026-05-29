import type { CSSProperties, ComponentType, MutableRefObject, ReactNode } from 'react'
import 'leaflet/dist/leaflet.css'
import { Link, useLocation } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Building2,
  Calculator,
  Car,
  Crosshair,
  Download,
  FileText,
  Flame,
  HelpCircle,
  Home,
  Layers3,
  Map,
  MapPin,
  Network,
  RefreshCw,
  Search,
  Settings,
  Shield,
  SlidersHorizontal,
  Sparkles,
  ChevronDown,
  Users,
  Wrench,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Map as LeafletMap, LeafletMouseEvent } from 'leaflet'
import { Circle, CircleMarker, MapContainer, Popup, TileLayer, Tooltip as LeafletTooltip, useMap } from 'react-leaflet'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

type RelaxedLeafletProps = {
  children?: ReactNode
  [key: string]: unknown
}

const LeafletMapContainer = MapContainer as unknown as ComponentType<RelaxedLeafletProps>
const LeafletTileLayer = TileLayer as unknown as ComponentType<RelaxedLeafletProps>
const LeafletCircle = Circle as unknown as ComponentType<RelaxedLeafletProps>
const LeafletCircleMarker = CircleMarker as unknown as ComponentType<RelaxedLeafletProps>
const LeafletPopup = Popup as unknown as ComponentType<RelaxedLeafletProps>
const LeafletTooltipLayer = LeafletTooltip as unknown as ComponentType<RelaxedLeafletProps>

type SidebarItem = {
  label: string
  icon: typeof Home
  href: string
  badge?: string
  group: 'main' | 'entities' | 'tools'
}

type SparkConfig = {
  title: string
  value: string
  subtitle: string
  icon: typeof MapPin
  iconTone: string
  stroke: string
  dataKey: string
  delta: string
}

type TooltipState = {
  x: number
  y: number
  title: string
  count: number
  level: string
  amount: string
  visible: boolean
}

type MapHotspot = {
  id: string
  name: string
  lat: number
  lng: number
  count: number
  level: string
  amount: string
  color: string
  radius: number
  kind: 'heat' | 'shop' | 'provider'
}

type MapPoint = {
  id: string
  lat: number
  lng: number
  title: string
  count: number
}

const sidebarItems: SidebarItem[] = [
  { label: 'Centro de inteligencia', icon: Home, href: '/demo', group: 'main' },
  { label: 'Casos críticos', icon: AlertTriangle, href: '/casos-criticos', badge: '18', group: 'main' },
  { label: 'Alertas IA', icon: Bell, href: '/alertas-ia', group: 'main' },
  { label: 'Mapa de siniestros', icon: Map, href: '/mapa-siniestros', group: 'main' },
  { label: 'Narrativas similares', icon: FileText, href: '/narrativas-similares', group: 'main' },
  { label: 'Vehículos', icon: Car, href: '/vehiculos', group: 'entities' },
  { label: 'Proveedores', icon: Building2, href: '/proveedores', group: 'entities' },
  { label: 'Asegurados', icon: Users, href: '/asegurados', group: 'entities' },
  { label: 'Talleres', icon: Wrench, href: '/talleres', group: 'entities' },
  { label: 'Calculadora de riesgo', icon: Calculator, href: '/calculadora', group: 'tools' },
  { label: 'Reportes Inteligentes', icon: FileText, href: '/reportes', group: 'tools' },
  { label: 'Configuración', icon: Settings, href: '/demo', group: 'tools' },
]

const sparkData = {
  siniestros: [820, 890, 950, 870, 920, 1050, 980, 1100, 1150, 1090, 1200, 1247],
  concentracion: [190, 220, 240, 210, 260, 280, 270, 290, 300, 285, 305, 312],
  ciudades: [12, 13, 14, 12, 15, 16, 14, 17, 16, 17, 18, 18],
  monto: [1.8, 1.9, 2.0, 1.85, 2.1, 2.2, 2.15, 2.3, 2.35, 2.3, 2.4, 2.45],
  proveedores: [110, 118, 125, 120, 130, 135, 128, 140, 145, 148, 152, 156],
}

const sparkConfigs: SparkConfig[] = [
  {
    title: 'Siniestros totales',
    value: '1,247',
    subtitle: '↑ 24% vs ayer',
    icon: MapPin,
    iconTone: 'red',
    stroke: '#dc2626',
    dataKey: 'siniestros',
    delta: '↑ 24% vs ayer',
  },
  {
    title: 'Alta concentración',
    value: '312',
    subtitle: 'Zonas críticas',
    icon: Flame,
    iconTone: 'orange',
    stroke: '#ea580c',
    dataKey: 'concentracion',
    delta: 'Zonas críticas',
  },
  {
    title: 'Ciudades activas',
    value: '18',
    subtitle: 'Con siniestros hoy',
    icon: Building2,
    iconTone: 'violet',
    stroke: '#7c3aed',
    dataKey: 'ciudades',
    delta: 'Con siniestros hoy',
  },
  {
    title: 'Monto reclamado',
    value: '$2.45M',
    subtitle: '↑ 32% vs ayer',
    icon: MapPin,
    iconTone: 'blue',
    stroke: '#2563eb',
    dataKey: 'monto',
    delta: '↑ 32% vs ayer',
  },
  {
    title: 'Proveedores vinculados',
    value: '156',
    subtitle: 'Con actividad sospechosa',
    icon: Wrench,
    iconTone: 'green',
    stroke: '#16a34a',
    dataKey: 'proveedores',
    delta: 'Con actividad sospechosa',
  },
]

const ECUADOR_CENTER: [number, number] = [-1.65, -78.5]
const ECUADOR_BOUNDS = [
  [1.6, -81.6],
  [-5.7, -75.0],
] as const

const mapHotspots: MapHotspot[] = [
  { id: 'quito', name: 'Quito Centro', lat: -0.1807, lng: -78.4678, count: 128, level: 'Crítico', amount: '$1.2M', color: '#dc2626', radius: 120000, kind: 'heat' },
  { id: 'guayaquil', name: 'Guayaquil Norte', lat: -2.1709, lng: -79.9224, count: 78, level: 'Alto', amount: '$680K', color: '#dc2626', radius: 90000, kind: 'heat' },
  { id: 'cuenca', name: 'Cuenca Centro', lat: -2.9005, lng: -79.0059, count: 45, level: 'Alto', amount: '$390K', color: '#ea580c', radius: 65000, kind: 'shop' },
  { id: 'manta', name: 'Manta', lat: -0.9677, lng: -80.7089, count: 36, level: 'Medio', amount: '$290K', color: '#f97316', radius: 50000, kind: 'shop' },
  { id: 'loja', name: 'Loja Centro', lat: -3.9931, lng: -79.2042, count: 22, level: 'Medio', amount: '$180K', color: '#ca8a04', radius: 42000, kind: 'shop' },
  { id: 'ambato', name: 'Ambato', lat: -1.2491, lng: -78.6168, count: 14, level: 'Bajo', amount: '$95K', color: '#2563eb', radius: 38000, kind: 'provider' },
  { id: 'santo-domingo', name: 'Santo Domingo', lat: -0.2527, lng: -79.1744, count: 9, level: 'Bajo', amount: '$62K', color: '#3b82f6', radius: 30000, kind: 'provider' },
]

const individualClaims: MapPoint[] = [
  { id: 'p1', lat: -0.42, lng: -78.6, title: 'Siniestro individual', count: 1 },
  { id: 'p2', lat: -0.05, lng: -78.2, title: 'Siniestro individual', count: 1 },
  { id: 'p3', lat: -1.05, lng: -78.95, title: 'Siniestro individual', count: 1 },
  { id: 'p4', lat: -1.55, lng: -79.35, title: 'Siniestro individual', count: 1 },
  { id: 'p5', lat: -2.2, lng: -79.0, title: 'Siniestro individual', count: 1 },
  { id: 'p6', lat: -2.7, lng: -78.6, title: 'Siniestro individual', count: 1 },
  { id: 'p7', lat: -3.2, lng: -78.2, title: 'Siniestro individual', count: 1 },
  { id: 'p8', lat: -0.95, lng: -80.15, title: 'Siniestro individual', count: 1 },
  { id: 'p9', lat: -1.85, lng: -80.2, title: 'Siniestro individual', count: 1 },
  { id: 'p10', lat: -3.55, lng: -79.6, title: 'Siniestro individual', count: 1 },
  { id: 'p11', lat: -4.2, lng: -78.7, title: 'Siniestro individual', count: 1 },
  { id: 'p12', lat: -0.6, lng: -79.8, title: 'Siniestro individual', count: 1 },
]

const cityRows = [
  { name: 'Medellín', value: 428, tone: 'red', width: '100%' },
  { name: 'Envigado', value: 256, tone: 'orange', width: '60%' },
  { name: 'Bello', value: 184, tone: 'orange', width: '43%' },
  { name: 'Itagüí', value: 128, tone: 'yellow', width: '30%' },
  { name: 'Sabaneta', value: 86, tone: 'green', width: '20%' },
]

const suspiciousShops = [
  { name: 'Taller Express', cases: 58, tone: 'red' },
  { name: 'AutoMecánica L&R', cases: 41, tone: 'red' },
  { name: 'Car Center Pro', cases: 33, tone: 'red' },
  { name: 'Taller La 80', cases: 27, tone: 'orange' },
  { name: 'MotorFix', cases: 19, tone: 'orange' },
]

const patternCards = [
  {
    title: 'Narrativas similares',
    value: 327,
    delta: '↑ 18% vs ayer',
    icon: FileText,
    tone: 'red',
  },
  {
    title: 'Redes colaborativas',
    value: 42,
    delta: '↑ 12% vs ayer',
    icon: Network,
    tone: 'blue',
  },
  {
    title: 'Siniestros recurrentes',
    value: 198,
    delta: '↑ 22% vs ayer',
    icon: RefreshCw,
    tone: 'green',
  },
  {
    title: 'Zonas nuevas críticas',
    value: 7,
    delta: '↑ 100% vs ayer',
    icon: MapPin,
    tone: 'red',
  },
]

const filters = {
  fechas: ['Hoy', 'Ayer', 'Últimos 7 días', 'Últimos 30 días', 'Personalizado'],
  ciudades: ['Todas', 'Medellín', 'Envigado', 'Bello', 'Itagüí', 'Sabaneta', 'Bogotá', 'Cali'],
  tipos: ['Todos', 'Vehículos', 'Salud', 'Hogar', 'SOAT', 'Vida'],
  riesgo: ['Todos', 'Crítico', 'Alto', 'Medio', 'Bajo'],
}

const alerts = [
  {
    title: 'Nueva zona crítica detectada',
    subtitle: 'Sector La 80 - Medellín',
    time: '09:42',
    icon: AlertTriangle,
    tone: 'red',
  },
  {
    title: 'Concentración inusual de siniestros',
    subtitle: 'Envigado - Zúñiga',
    time: '09:35',
    icon: Flame,
    tone: 'orange',
  },
  {
    title: 'Taller vinculado a 5 siniestros',
    subtitle: 'Taller Express - Itagüí',
    time: '09:28',
    icon: Users,
    tone: 'violet',
  },
  {
    title: 'Patrón recurrente detectado',
    subtitle: 'Bello - Niquía',
    time: '09:21',
    icon: RefreshCw,
    tone: 'blue',
  },
]

function toClassName(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function highlight(text: string, query: string) {
  if (!query.trim()) return text

  const index = text.toLowerCase().indexOf(query.toLowerCase())
  if (index < 0) return text

  const before = text.slice(0, index)
  const match = text.slice(index, index + query.length)
  const after = text.slice(index + query.length)

  return (
    <>
      {before}
      <mark>{match}</mark>
      {after}
    </>
  )
}

function projectToSvg(lat: number, lng: number) {
  const west = ECUADOR_BOUNDS[0][1]
  const east = ECUADOR_BOUNDS[1][1]
  const north = ECUADOR_BOUNDS[0][0]
  const south = ECUADOR_BOUNDS[1][0]
  const x = ((lng - west) / (east - west)) * 800
  const y = ((north - lat) / (north - south)) * 450

  return { x, y }
}

function SparklineCard({
  config,
  data,
  displayValue,
}: {
  config: SparkConfig
  data: number[]
  displayValue: string
}) {
  const Icon = config.icon
  return (
    <article className="kpi-card">
      <div className="kpi-top">
        <span className={`kpi-icon tone-${config.iconTone}`}>
          <Icon size={16} />
        </span>
        <div>
          <p>{config.title}</p>
          <strong>{displayValue}</strong>
        </div>
      </div>
      <span className="kpi-delta">{config.delta}</span>
      <div className="kpi-chart">
        <ResponsiveContainer width="100%" height={40}>
          <LineChart data={data.map((value) => ({ value }))}>
            <Tooltip content={() => null} />
            <CartesianGrid stroke="transparent" />
            <Line
              type="monotone"
              dataKey="value"
              stroke={config.stroke}
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}

function MapSyncController({
  zoom,
  mapRef,
}: {
  zoom: number
  mapRef: MutableRefObject<LeafletMap | null>
}) {
  const map = useMap()

  useEffect(() => {
    mapRef.current = map
    map.setView(ECUADOR_CENTER, zoom, { animate: false })
    map.invalidateSize()
  }, [map, mapRef, zoom])

  useEffect(() => {
    map.setZoom(zoom, { animate: true })
  }, [map, zoom])

  return null
}

function EcuadorLayers({
  layers,
  setTooltip,
}: {
  layers: {
    heat: boolean
    suspiciousShops: boolean
    providers: boolean
    individualClaims: boolean
    riskZones: boolean
  }
  setTooltip: (value: TooltipState | ((current: TooltipState) => TooltipState)) => void
}) {
  const map = useMap()

  const showTooltip = (item: MapHotspot | MapPoint, lat: number, lng: number, count: number, level: string, amount: string) => {
    const point = map.latLngToContainerPoint([lat, lng])
    setTooltip({
      x: point.x + 12,
      y: point.y,
      title: 'name' in item ? item.name : item.title,
      count,
      level,
      amount,
      visible: true,
    })
  }

  return (
    <>
      {layers.riskZones ? (
        <>
          <LeafletCircle
            center={[-0.15, -78.55]}
            radius={160000}
            pathOptions={{ color: '#dc2626', fillColor: '#dc2626', fillOpacity: 0.08, weight: 1 }}
          />
          <LeafletCircle
            center={[-2.2, -79.92]}
            radius={120000}
            pathOptions={{ color: '#ea580c', fillColor: '#ea580c', fillOpacity: 0.08, weight: 1 }}
          />
        </>
      ) : null}

      {layers.heat
        ? mapHotspots.filter((hotspot) => hotspot.kind === 'heat').map((hotspot) => (
            <LeafletCircle
              key={hotspot.id}
              center={[hotspot.lat, hotspot.lng]}
              radius={hotspot.radius}
              pathOptions={{
                color: hotspot.color,
                fillColor: hotspot.color,
                fillOpacity: 0.18,
                weight: 2,
              }}
              eventHandlers={{
                mouseover: (event: LeafletMouseEvent) => showTooltip(hotspot, event.latlng.lat, event.latlng.lng, hotspot.count, hotspot.level, hotspot.amount),
                mousemove: (event: LeafletMouseEvent) => showTooltip(hotspot, event.latlng.lat, event.latlng.lng, hotspot.count, hotspot.level, hotspot.amount),
                mouseout: () => setTooltip((current) => ({ ...current, visible: false })),
              }}
            >
              <LeafletTooltipLayer permanent direction="center" className="cluster-tooltip">
                {hotspot.count}
              </LeafletTooltipLayer>
              <LeafletPopup>
                <strong>{hotspot.name}</strong>
                <br />
                {hotspot.count} siniestros
                <br />
                {hotspot.level}
                <br />
                {hotspot.amount}
              </LeafletPopup>
            </LeafletCircle>
          ))
        : null}

      {layers.suspiciousShops
        ? mapHotspots.filter((hotspot) => hotspot.kind === 'shop').map((hotspot) => (
            <LeafletCircleMarker
              key={hotspot.id}
              center={[hotspot.lat, hotspot.lng]}
              radius={11}
              pathOptions={{ color: hotspot.color, fillColor: hotspot.color, fillOpacity: 0.9, weight: 2 }}
              eventHandlers={{
                mouseover: (event: LeafletMouseEvent) => showTooltip(hotspot, event.latlng.lat, event.latlng.lng, hotspot.count, hotspot.level, hotspot.amount),
                mousemove: (event: LeafletMouseEvent) => showTooltip(hotspot, event.latlng.lat, event.latlng.lng, hotspot.count, hotspot.level, hotspot.amount),
                mouseout: () => setTooltip((current) => ({ ...current, visible: false })),
              }}
            >
              <LeafletTooltipLayer direction="top" sticky className="cluster-tooltip">
                {hotspot.name}
              </LeafletTooltipLayer>
            </LeafletCircleMarker>
          ))
        : null}

      {layers.providers
        ? mapHotspots.filter((hotspot) => hotspot.kind === 'provider').map((hotspot) => (
            <LeafletCircleMarker
              key={hotspot.id}
              center={[hotspot.lat, hotspot.lng]}
              radius={9}
              pathOptions={{ color: hotspot.color, fillColor: hotspot.color, fillOpacity: 0.9, weight: 2 }}
              eventHandlers={{
                mouseover: (event: LeafletMouseEvent) => showTooltip(hotspot, event.latlng.lat, event.latlng.lng, hotspot.count, hotspot.level, hotspot.amount),
                mousemove: (event: LeafletMouseEvent) => showTooltip(hotspot, event.latlng.lat, event.latlng.lng, hotspot.count, hotspot.level, hotspot.amount),
                mouseout: () => setTooltip((current) => ({ ...current, visible: false })),
              }}
            >
              <LeafletTooltipLayer direction="top" sticky className="cluster-tooltip">
                {hotspot.name}
              </LeafletTooltipLayer>
            </LeafletCircleMarker>
          ))
        : null}

      {layers.individualClaims
        ? individualClaims.map((point) => (
            <LeafletCircleMarker
              key={point.id}
              center={[point.lat, point.lng]}
              radius={4}
              pathOptions={{ color: '#ec4899', fillColor: '#ec4899', fillOpacity: 0.9, weight: 1 }}
              eventHandlers={{
                mouseover: (event: LeafletMouseEvent) => showTooltip(point, event.latlng.lat, event.latlng.lng, point.count, 'Crítico', 'Siniestro individual'),
                mousemove: (event: LeafletMouseEvent) => showTooltip(point, event.latlng.lat, event.latlng.lng, point.count, 'Crítico', 'Siniestro individual'),
                mouseout: () => setTooltip((current) => ({ ...current, visible: false })),
              }}
            />
          ))
        : null}
    </>
  )
}

function MapMarkerTooltip({ tooltip }: { tooltip: TooltipState }) {
  if (!tooltip.visible) return null

  return (
    <div className="map-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
      <strong>{tooltip.title}</strong>
      <span>{tooltip.count} siniestros</span>
      <span className={`risk-chip risk-${toClassName(tooltip.level)}`}>{tooltip.level}</span>
      <span>{tooltip.amount}</span>
    </div>
  )
}

export default function MapaSiniestrosPage() {
  const activeSidebar = useLocation().pathname
  const [mapMode, setMapMode] = useState<'map' | 'satellite'>('map')
  const [zoom, setZoom] = useState(1)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [layers, setLayers] = useState({
    heat: true,
    suspiciousShops: true,
    providers: true,
    individualClaims: true,
    riskZones: false,
  })
  const [tooltip, setTooltip] = useState<TooltipState>({
    x: 0,
    y: 0,
    title: '',
    count: 0,
    level: '',
    amount: '',
    visible: false,
  })
  const [kpiTargets, setKpiTargets] = useState({
    siniestros: 1247,
    concentracion: 312,
    ciudades: 18,
    monto: 2.45,
    proveedores: 156,
  })
  const [displayValues, setDisplayValues] = useState(kpiTargets)
  const mapSvgRef = useRef<SVGSVGElement | null>(null)
  const leafletMapRef = useRef<LeafletMap | null>(null)
  const exportMapRef = useRef<HTMLDivElement | null>(null)
  const displayRef = useRef(kpiTargets)

  const filteredAlerts = useMemo(
    () =>
      alerts.filter((alertItem) => {
        const haystack = `${alertItem.title} ${alertItem.subtitle}`.toLowerCase()
        return haystack.includes(searchQuery.toLowerCase())
      }),
    [searchQuery],
  )

  const cityRowsComputed = useMemo(() => {
    const variance = [1.04, 1.03, 1.02, 1.01, 1.02]
    return cityRows.map((row, index) => ({
      ...row,
      value: loading ? Math.max(1, Math.round(row.value * variance[index])) : row.value,
    }))
  }, [loading])

  useEffect(() => {
    const duration = loading ? 1200 : 700
    const start = performance.now()
    const from = displayRef.current
    const to = kpiTargets
    let frameId = 0

    const animate = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      const frameValues = {
        siniestros: Math.round(from.siniestros + (to.siniestros - from.siniestros) * eased),
        concentracion: Math.round(from.concentracion + (to.concentracion - from.concentracion) * eased),
        ciudades: Math.round(from.ciudades + (to.ciudades - from.ciudades) * eased),
        monto: Number((from.monto + (to.monto - from.monto) * eased).toFixed(2)),
        proveedores: Math.round(from.proveedores + (to.proveedores - from.proveedores) * eased),
      }

      setDisplayValues(frameValues)
      displayRef.current = frameValues

      if (progress < 1) requestAnimationFrame(animate)
    }

    frameId = requestAnimationFrame(animate)
    displayRef.current = kpiTargets

    return () => cancelAnimationFrame(frameId)
  }, [kpiTargets, loading])

  const applyFilters = useCallback(() => {
    setLoading(true)
    const next = {
      siniestros: 1247 + Math.round((Math.random() - 0.5) * 20),
      concentracion: 312 + Math.round((Math.random() - 0.5) * 10),
      ciudades: 18,
      monto: Number((2.45 + (Math.random() - 0.5) * 0.08).toFixed(2)),
      proveedores: 156 + Math.round((Math.random() - 0.5) * 8),
    }

    window.setTimeout(() => {
      setKpiTargets(next)
      setLoading(false)
    }, 1200)
  }, [])

  const handleExport = useCallback(async () => {
    const svg = mapSvgRef.current
    if (!svg) return

    const serializer = new XMLSerializer()
    const source = serializer.serializeToString(svg)
    const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    const image = new Image()

    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1600
      canvas.height = 900
      const context = canvas.getContext('2d')
      if (!context) return

      context.fillStyle = mapMode === 'satellite' ? '#20311f' : '#dfe5ee'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      canvas.toBlob((blob) => {
        if (!blob) return
        const downloadUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = 'fraudia-mapa-siniestros.png'
        link.click()
        URL.revokeObjectURL(downloadUrl)
      }, 'image/png')

      URL.revokeObjectURL(url)
    }

    image.src = url
  }, [mapMode])

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((current) => ({ ...current, [key]: !current[key] }))
  }

  return (
    <main className="page map-page" ref={exportMapRef}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700;800&display=swap');

        .map-page {
          --bg-primary: #f5f7fb;
          --bg-secondary: #ffffff;
          --bg-tertiary: #eef3fb;
          --bg-card: #ffffff;
          --accent-blue: #2563eb;
          --accent-red: #dc2626;
          --accent-orange: #ea580c;
          --accent-yellow: #d97706;
          --accent-green: #16a34a;
          --accent-purple: #7c3aed;
          --text-primary: #0f172a;
          --text-secondary: #64748b;
          --text-muted: #94a3b8;
          --border: #d7dfee;
          --border-subtle: #e5eaf3;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-family: 'IBM Plex Sans', sans-serif;
          min-height: 100vh;
        }

        .map-page * {
          box-sizing: border-box;
        }

        .map-shell {
          height: 100vh;
          display: grid;
          grid-template-columns: 220px minmax(0, 1fr) 280px;
          overflow: hidden;
        }

        .map-sidebar,
        .map-content,
        .map-right {
          min-height: 100vh;
        }

        .map-sidebar {
          display: flex;
          flex-direction: column;
          gap: 18px;
          padding: 16px 14px;
          border-right: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.92);
          overflow-y: auto;
        }

        .map-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 4px 14px;
          border-bottom: 1px solid var(--border-subtle);
          text-decoration: none;
          color: var(--text-primary);
        }

        .map-brand:hover {
          opacity: 0.96;
        }

        .map-brand-title {
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .map-shield {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.18), rgba(124, 58, 237, 0.18));
          color: var(--accent-blue);
          box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.08);
          animation: hueSpin 8s linear infinite;
        }

        .sidebar-group {
          display: grid;
          gap: 6px;
        }

        .sidebar-label {
          margin: 0 0 4px;
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
          font-weight: 700;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 8px;
          color: var(--text-secondary);
          text-decoration: none;
          transition: background 180ms ease, color 180ms ease, transform 180ms ease;
        }

        .sidebar-item:hover {
          background: rgba(37, 99, 235, 0.06);
          transform: translateX(2px);
        }

        .sidebar-item.is-active {
          background: rgba(37, 99, 235, 0.12);
          color: var(--text-primary);
          box-shadow: inset 3px 0 0 var(--accent-blue);
        }

        .sidebar-badge {
          margin-left: auto;
          min-width: 24px;
          height: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 8px;
          border-radius: 999px;
          background: var(--accent-red);
          color: #fff;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 700;
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid var(--border-subtle);
        }

        .assistant-card {
          padding: 16px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(245, 247, 251, 0.98));
          display: grid;
          gap: 12px;
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
        }

        .assistant-top {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
        }

        .assistant-sparkle {
          color: #60a5fa;
          animation: pulseGlow 2.8s ease-in-out infinite;
        }

        .assistant-card p {
          margin: 0;
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 13px;
        }

        .outline-button,
        .ghost-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 38px;
          padding: 0 14px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-primary);
          font: inherit;
          text-decoration: none;
          cursor: pointer;
          transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;
        }

        .outline-button:hover,
        .ghost-button:hover {
          background: var(--bg-tertiary);
          transform: translateY(-1px);
        }

        .assistant-card .outline-button {
          width: 100%;
          justify-content: space-between;
        }

        .map-main-wrapper {
          display: grid;
          grid-template-rows: 60px minmax(0, 1fr);
          min-width: 0;
          overflow: hidden;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          height: 60px;
          padding: 0 20px;
          background: rgba(255, 255, 255, 0.9);
          border-bottom: 1px solid var(--border-subtle);
          backdrop-filter: blur(18px);
        }

        .search-shell {
          width: min(480px, 100%);
          margin: 0 auto;
          position: relative;
        }

        .search-input {
          width: 100%;
          height: 40px;
          padding: 0 44px 0 42px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--bg-secondary);
          color: var(--text-primary);
          outline: none;
        }

        .search-input::placeholder {
          color: var(--text-secondary);
        }

        .search-icon,
        .search-shortcut {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
          font-size: 12px;
        }

        .search-icon { left: 14px; }
        .search-shortcut {
          right: 12px;
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--bg-primary);
          font-family: 'JetBrains Mono', monospace;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .icon-chip {
          position: relative;
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: var(--text-primary);
        }

        .bell-wrapper {
          position: relative;
        }

        .bell-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: var(--accent-red);
          color: white;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          display: grid;
          place-items: center;
          border: 2px solid var(--bg-secondary);
        }

        .vertical-divider {
          width: 1px;
          height: 28px;
          background: var(--border);
        }

        .profile-chip {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .profile-chip strong {
          display: block;
          font-size: 13px;
        }

        .profile-chip span {
          display: block;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .avatar {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: var(--accent-blue);
          color: white;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
        }

        .online-dot {
          position: absolute;
          right: -1px;
          bottom: -1px;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: var(--accent-green);
          border: 2px solid var(--bg-primary);
        }

        .scroll-pane {
          overflow-y: auto;
          min-width: 0;
          padding: 18px 18px 20px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 14px;
        }

        .page-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .page-head h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
        }

        .page-head p {
          margin: 6px 0 0;
          color: var(--text-secondary);
          font-size: 13px;
        }

        .head-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .real-time-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 40px;
          padding: 0 14px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: var(--bg-card);
          color: var(--text-primary);
          font-size: 13px;
        }

        .pulse-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: var(--accent-green);
          box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.55);
          animation: pulseRing 2s ease-out infinite;
        }

        .primary-button {
          min-height: 40px;
          padding: 0 14px;
          border-radius: 10px;
          border: 1px solid var(--accent-blue);
          background: var(--accent-blue);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: transform 160ms ease, opacity 160ms ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .primary-button:hover {
          transform: translateY(-1px);
          opacity: 0.95;
        }

        .secondary-button {
          min-height: 40px;
          padding: 0 14px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-primary);
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 160ms ease, transform 160ms ease, border-color 160ms ease;
        }

        .secondary-button:hover {
          background: var(--bg-tertiary);
          transform: translateY(-1px);
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }

        .kpi-card {
          border: 1px solid var(--border);
          border-radius: 10px;
          background: var(--bg-card);
          padding: 16px;
          min-height: 180px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
          animation: fadeUp 420ms ease both;
        }

        .kpi-top {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .kpi-top p {
          margin: 0;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .kpi-top strong {
          display: block;
          margin-top: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 28px;
          letter-spacing: -0.03em;
          color: var(--text-primary);
        }

        .kpi-icon {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          flex: 0 0 auto;
        }

        .kpi-icon.tone-red { background: rgba(220, 38, 38, 0.1); color: #ef4444; }
        .kpi-icon.tone-orange { background: rgba(234, 88, 12, 0.1); color: #fb923c; }
        .kpi-icon.tone-violet { background: rgba(124, 58, 237, 0.1); color: #a78bfa; }
        .kpi-icon.tone-blue { background: rgba(37, 99, 235, 0.1); color: #60a5fa; }
        .kpi-icon.tone-green { background: rgba(22, 163, 74, 0.1); color: #4ade80; }

        .kpi-delta {
          color: #16a34a;
          font-size: 12px;
          margin-top: 2px;
        }

        .kpi-chart {
          margin-top: auto;
          min-height: 40px;
        }

        .map-panel {
          position: relative;
          border: 1px solid var(--border);
          border-radius: 10px;
          background:
            radial-gradient(circle at 20% 15%, rgba(59, 130, 246, 0.12), transparent 22%),
            radial-gradient(circle at 75% 30%, rgba(249, 115, 22, 0.1), transparent 18%),
            linear-gradient(180deg, #eef3fb 0%, #dde6f3 100%);
          overflow: hidden;
          height: 420px;
        }

        .map-tabs {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 6;
          display: inline-flex;
          gap: 0;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
        }

        .map-tab {
          padding: 8px 14px;
          border: 0;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          font-weight: 600;
          transition: background 160ms ease, color 160ms ease;
        }

        .map-tab.is-active {
          color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
          box-shadow: inset 0 -2px 0 #3b82f6;
        }

        .map-toolbar {
          position: absolute;
          left: 12px;
          top: 74px;
          z-index: 6;
          display: grid;
          gap: 8px;
        }

        .tool-button {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.96);
          color: var(--text-primary);
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: transform 160ms ease, background 160ms ease;
        }

        .tool-button:hover {
          transform: translateY(-1px);
          background: rgba(37, 99, 235, 0.08);
        }

        .map-layers {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 6;
          width: 200px;
          padding: 12px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid var(--border);
          backdrop-filter: blur(12px);
        }

        .layers-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .layer-check {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 0;
          color: var(--text-primary);
          font-size: 13px;
          cursor: pointer;
        }

        .layer-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
        }

        .risk-legend {
          position: absolute;
          left: 12px;
          bottom: 12px;
          z-index: 6;
          padding: 12px;
          width: 190px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid var(--border);
        }

        .risk-bar {
          margin-top: 8px;
          height: 10px;
          border-radius: 999px;
          background: linear-gradient(90deg, #2563eb 0%, #16a34a 25%, #d97706 50%, #ea580c 75%, #dc2626 100%);
        }

        .risk-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .mini-map {
          position: absolute;
          right: 12px;
          bottom: 12px;
          width: 130px;
          height: 86px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid var(--border);
          overflow: hidden;
          opacity: 0.85;
          transition: opacity 160ms ease;
          z-index: 6;
        }

        .mini-map:hover {
          opacity: 1;
        }

        .map-svg {
          width: 100%;
          height: 100%;
          transform-origin: center center;
          transition: transform 220ms ease, filter 220ms ease;
        }

        .map-svg.is-loading {
          filter: blur(1px) saturate(0.9);
        }

        .map-svg.satellite {
          filter: saturate(0.7) brightness(0.7) contrast(1.05);
        }

        .map-loading {
          position: absolute;
          inset: 0;
          z-index: 7;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.42), rgba(255, 255, 255, 0.16));
          background-size: 200% 100%;
          animation: shimmer 1.2s linear infinite;
        }

        .map-tooltip {
          position: absolute;
          z-index: 8;
          min-width: 180px;
          padding: 12px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid var(--border);
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
          pointer-events: none;
          display: grid;
          gap: 6px;
          transform: translateY(-100%);
        }

        .map-tooltip strong {
          font-size: 13px;
        }

        .map-tooltip span {
          color: var(--text-secondary);
          font-size: 12px;
        }

        .risk-chip {
          width: fit-content;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
        }

        .risk-chip.risk-crítico { background: rgba(220, 38, 38, 0.12); color: #fca5a5; }
        .risk-chip.risk-alto { background: rgba(234, 88, 12, 0.12); color: #fdba74; }
        .risk-chip.risk-medio { background: rgba(217, 119, 6, 0.12); color: #fcd34d; }
        .risk-chip.risk-bajo { background: rgba(22, 163, 74, 0.12); color: #86efac; }

        .map-grid {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: inherit;
        }

        .leaflet-map {
          width: 100%;
          height: 100%;
          background: var(--bg-primary);
        }

        .leaflet-container {
          font-family: 'IBM Plex Sans', sans-serif;
        }

        .map-export-snapshot {
          position: absolute;
          left: -9999px;
          top: -9999px;
          width: 800px;
          height: 450px;
          opacity: 0;
          pointer-events: none;
        }

        .map-footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
        }

        .panel {
          border: 1px solid var(--border);
          border-radius: 10px;
          background: var(--bg-card);
          padding: 16px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
        }

        .panel h3 {
          margin: 0 0 14px;
          font-size: 14px;
          font-weight: 700;
        }

        .city-list {
          display: grid;
          gap: 12px;
        }

        .city-row {
          display: grid;
          grid-template-columns: 90px minmax(0, 1fr) 38px;
          gap: 10px;
          align-items: center;
        }

        .track {
          height: 8px;
          border-radius: 999px;
          background: var(--bg-tertiary);
          overflow: hidden;
        }

        .fill {
          height: 100%;
          border-radius: inherit;
        }

        .fill.red { background: linear-gradient(90deg, #dc2626, #fb7185); }
        .fill.orange { background: linear-gradient(90deg, #ea580c, #fb923c); }
        .fill.yellow { background: linear-gradient(90deg, #d97706, #fbbf24); }
        .fill.green { background: linear-gradient(90deg, #16a34a, #34d399); }

        .mono {
          font-family: 'JetBrains Mono', monospace;
        }

        .shops-list {
          display: grid;
          gap: 10px;
        }

        .shop-row {
          display: grid;
          grid-template-columns: 24px 1fr auto;
          gap: 10px;
          align-items: center;
          padding: 8px 10px;
          border-radius: 8px;
          transition: background 160ms ease;
          cursor: pointer;
        }

        .shop-row:hover {
          background: var(--bg-tertiary);
        }

        .shop-index {
          color: var(--text-muted);
          font-family: 'JetBrains Mono', monospace;
        }

        .shop-count.red { color: #f87171; }
        .shop-count.orange { color: #fb923c; }

        .pattern-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .pattern-mini {
          padding: 12px;
          border-radius: 10px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
        }

        .pattern-mini-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          color: var(--text-secondary);
          font-size: 12px;
        }

        .pattern-mini strong.value {
          display: block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 24px;
          margin: 0 0 4px;
        }

        .pattern-delta {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .alerts-side {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .alerts-panel-title {
          margin: 0 0 10px;
          font-size: 14px;
          font-weight: 700;
        }

        .filter-shell {
          display: grid;
          gap: 10px;
        }

        .field {
          display: grid;
          gap: 6px;
        }

        .field label {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .field select {
          width: 100%;
          height: 40px;
          padding: 0 12px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--bg-tertiary);
          color: var(--text-primary);
          outline: none;
        }

        .field select:focus {
          border-color: var(--accent-blue);
        }

        .apply-button {
          width: 100%;
          justify-content: center;
        }

        .geo-alerts {
          display: grid;
          gap: 10px;
        }

        .geo-item {
          display: grid;
          grid-template-columns: 10px 32px 1fr auto;
          gap: 10px;
          align-items: center;
          padding: 10px 8px;
          border-radius: 8px;
          transition: background 160ms ease;
          cursor: pointer;
        }

        .geo-item:hover {
          background: var(--bg-tertiary);
        }

        .geo-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
        }

        .geo-ico {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: grid;
          place-items: center;
          background: rgba(37, 99, 235, 0.08);
        }

        .geo-copy strong,
        .geo-copy span {
          display: block;
        }

        .geo-copy strong {
          font-size: 13px;
          color: var(--text-primary);
        }

        .geo-copy span {
          margin-top: 2px;
          color: var(--text-secondary);
          font-size: 12px;
        }

        .geo-time {
          color: var(--text-secondary);
          font-size: 12px;
        }

        .geo-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #60a5fa;
          text-decoration: none;
          font-size: 13px;
          margin-top: 4px;
        }

        .alert-skeleton {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          opacity: 0;
          pointer-events: none;
        }

        .alert-skeleton.is-loading {
          opacity: 1;
          background: linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.12), rgba(255,255,255,0.02));
          background-size: 200% 100%;
          animation: shimmer 1.2s linear infinite;
        }

        .map-fit {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }

        .map-zoom-level {
          --zoom: ${zoom};
        }

        .heat {
          animation: heatPulse 3s ease-in-out infinite;
        }

        .heat.delay-1 { animation-delay: 0.4s; }
        .heat.delay-2 { animation-delay: 0.8s; }
        .heat.delay-3 { animation-delay: 1.2s; }
        .heat.delay-4 { animation-delay: 1.6s; }

        .city-mark, .individual-point {
          cursor: pointer;
          transition: transform 150ms ease, opacity 150ms ease;
        }

        .city-mark:hover, .individual-point:hover {
          transform: scale(1.12);
        }

        .city-mark text {
          pointer-events: none;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          fill: #fff;
        }

        .city-label {
          font-size: 15px;
          fill: #1f2937;
          font-weight: 700;
          paint-order: stroke;
          stroke: rgba(255,255,255,0.85);
          stroke-width: 6px;
        }

        .city-label.dark {
          fill: #e5e7eb;
          stroke: rgba(13,17,23,0.65);
        }

        .line-road {
          stroke: rgba(37, 99, 235, 0.12);
          stroke-width: 1.1;
        }

        .line-road.major {
          stroke: rgba(37, 99, 235, 0.2);
          stroke-width: 2.5;
        }

        .line-road.dark {
          stroke: rgba(17, 24, 39, 0.28);
        }

        .view-satellite .line-road {
          stroke: rgba(3, 7, 18, 0.35);
        }

        .view-satellite .city-label {
          fill: #d1fae5;
          stroke: rgba(3, 7, 18, 0.45);
        }

        .view-satellite .heat-rgb {
          filter: saturate(0.8) brightness(0.8);
        }

        .view-satellite .map-bg {
          fill: url(#satelliteBg);
        }

        .clusters-svg {
          overflow: visible;
        }

        .mini-svg {
          width: 100%;
          height: 100%;
        }

        .cluster-shadow {
          filter: drop-shadow(0 8px 16px rgba(0,0,0,0.25));
        }

        .cluster-tooltip {
          position: absolute;
          z-index: 9;
          min-width: 210px;
          pointer-events: none;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid var(--border);
          color: var(--text-primary);
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
          border-radius: 10px;
        }

        .right-column {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          border-left: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.92);
          overflow-y: auto;
        }

        .right-column h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
        }

        .right-section {
          padding: 16px;
          border: 1px solid var(--border);
          border-radius: 10px;
          background: var(--bg-card);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
        }

        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
        }

        .toggle-row small {
          color: var(--text-secondary);
        }

        .map-controls-shell {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .city-progress {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-primary);
        }

        .city-progress .name {
          width: 90px;
          font-size: 13px;
        }

        .city-progress .value {
          font-family: 'JetBrains Mono', monospace;
          width: 34px;
          text-align: right;
        }

        .model-row {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 10px;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid var(--border-subtle);
        }

        .model-row:last-child {
          border-bottom: 0;
        }

        .model-name {
          font-weight: 600;
        }

        .model-detail {
          display: block;
          color: var(--text-secondary);
          font-size: 12px;
          margin-top: 2px;
        }

        .model-state {
          color: var(--accent-green);
          font-size: 12px;
          font-weight: 700;
        }

        .alert-highlight mark {
          background: rgba(96, 165, 250, 0.25);
          color: var(--text-primary);
          padding: 0 2px;
          border-radius: 4px;
        }

        .kpi-card,
        .panel,
        .right-section,
        .assistant-card {
          animation: fadeUp 500ms ease both;
        }

        .kpi-card:nth-child(1) { animation-delay: 0ms; }
        .kpi-card:nth-child(2) { animation-delay: 100ms; }
        .kpi-card:nth-child(3) { animation-delay: 200ms; }
        .kpi-card:nth-child(4) { animation-delay: 300ms; }
        .kpi-card:nth-child(5) { animation-delay: 400ms; }

        .right-column {
          animation: slideInRight 420ms ease both;
        }

        .alerts-fade > * {
          animation: fadeIn 320ms ease both;
        }

        .alerts-fade > *:nth-child(1) { animation-delay: 0ms; }
        .alerts-fade > *:nth-child(2) { animation-delay: 50ms; }
        .alerts-fade > *:nth-child(3) { animation-delay: 100ms; }
        .alerts-fade > *:nth-child(4) { animation-delay: 150ms; }
        .alerts-fade > *:nth-child(5) { animation-delay: 200ms; }

        .shimmer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.18), rgba(255,255,255,0.03));
          background-size: 200% 100%;
          animation: shimmer 1.2s linear infinite;
          opacity: 0;
          transition: opacity 200ms ease;
        }

        .shimmer.visible {
          opacity: 1;
        }

        .map-root-wrap {
          position: relative;
          height: 100%;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(16px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes heatPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.45; }
        }

        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.45); }
          70% { box-shadow: 0 0 0 10px rgba(22, 163, 74, 0); }
          100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }

        @keyframes hueSpin {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }

        @media (max-width: 1440px) {
          .map-shell {
            grid-template-columns: 220px minmax(0, 1fr) 280px;
          }
        }

        @media (max-width: 1280px) {
          .map-shell {
            grid-template-columns: 220px minmax(0, 1fr);
          }

          .right-column {
            display: none;
          }

          .kpi-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 1024px) {
          .map-shell {
            grid-template-columns: 1fr;
            height: auto;
          }

          .map-sidebar {
            min-height: auto;
            position: static;
          }

          .map-main-wrapper {
            min-height: auto;
          }

          .topbar {
            position: sticky;
            top: 0;
            z-index: 30;
          }
        }

        @media (max-width: 900px) {
          .kpi-grid,
          .map-footer-grid {
            grid-template-columns: 1fr;
          }

          .page-head,
          .head-actions {
            flex-direction: column;
            align-items: flex-start;
          }

          .search-shell {
            width: 100%;
          }
        }
      `}</style>

      <div className="map-shell">
        <aside className="map-sidebar">
          <Link to="/demo" className="map-brand">
            <span className="map-shield">
              <Shield size={18} strokeWidth={2.5} />
            </span>
            <span className="map-brand-title">fraudia</span>
          </Link>

          <div className="sidebar-group">
            <p className="sidebar-label">Menú principal</p>
            {sidebarItems.filter((item) => item.group === 'main').map((item) => {
              const Icon = item.icon
              const active = activeSidebar === item.href

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`sidebar-item ${active ? 'is-active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {item.badge ? <span className="sidebar-badge">{item.badge}</span> : null}
                </Link>
              )
            })}
          </div>

          <div className="sidebar-group">
            <p className="sidebar-label">Entidades</p>
            {sidebarItems.filter((item) => item.group === 'entities').map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.label} to={item.href} className="sidebar-item">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="sidebar-group">
            <p className="sidebar-label">Herramientas</p>
            {sidebarItems.filter((item) => item.group === 'tools').map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.label} to={item.href} className="sidebar-item">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="sidebar-footer">
            <section className="assistant-card">
              <div className="assistant-top">
                <Sparkles className="assistant-sparkle" size={18} />
                <span>IA Assistant</span>
              </div>
              <p>Obtén insights sobre zonas, patrones y redes sospechosas.</p>
              <button className="outline-button" type="button">
                <span>Abrir chat</span>
                <ArrowRight size={16} />
              </button>
            </section>
          </div>
        </aside>

        <div className="map-main-wrapper">
          <header className="topbar">
            <div style={{ width: 220 }} />
            <div className="search-shell">
              <Search className="search-icon" size={16} />
              <input
                className="search-input"
                placeholder="Buscar ubicación, zona, ciudad, taller, asegurado..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <span className="search-shortcut">⌘ K</span>
            </div>

            <div className="topbar-right">
              <button className="icon-chip bell-wrapper" type="button" aria-label="Notificaciones">
                <Bell size={18} />
                <span className="bell-badge">8</span>
              </button>
              <button className="icon-chip" type="button" aria-label="Ayuda">
                <HelpCircle size={18} />
              </button>
              <div className="vertical-divider" />
              <div className="profile-chip">
                <div>
                  <strong>Analista Senior</strong>
                  <span>Unidad Antifraude</span>
                </div>
                <div className="avatar">
                  AS
                  <span className="online-dot" />
                </div>
              </div>
            </div>
          </header>

          <div className="scroll-pane">
            <div className="content-grid">
              <div className="page-head">
                <div>
                  <h1>Mapa de siniestros</h1>
                  <p>Visualiza la concentración, distribución y patrones de siniestros en tiempo real</p>
                </div>

                <div className="head-actions">
                  <span className="real-time-chip">
                    <span className="pulse-dot" />
                    Tiempo real
                  </span>
                  <button className="secondary-button" type="button">
                    <SlidersHorizontal size={16} />
                    Filtros
                  </button>
                  <button className="primary-button" type="button" onClick={handleExport}>
                    <Download size={16} />
                    Exportar mapa
                  </button>
                </div>
              </div>

              <div className="kpi-grid">
                {sparkConfigs.map((config) => {
                  const value = displayValues[config.dataKey as keyof typeof displayValues]
                  const displayValue =
                    config.dataKey === 'monto'
                      ? `$${Number(value).toFixed(2)}M`
                      : Number(value).toLocaleString('en-US')

                  return (
                    <SparklineCard
                      key={config.title}
                      config={config}
                      data={sparkData[config.dataKey as keyof typeof sparkData]}
                      displayValue={displayValue}
                    />
                  )
                })}
              </div>

              <section className="map-panel map-root-wrap">
                <div className="map-tabs">
                  <button className={`map-tab ${mapMode === 'map' ? 'is-active' : ''}`} onClick={() => setMapMode('map')}>
                    Mapa
                  </button>
                  <button
                    className={`map-tab ${mapMode === 'satellite' ? 'is-active' : ''}`}
                    onClick={() => setMapMode('satellite')}
                  >
                    Satélite
                  </button>
                </div>

                <div className="map-toolbar">
                  <button className="tool-button" type="button" onClick={() => setZoom((current) => Math.min(2, Number((current + 0.1).toFixed(1))))}>
                    +
                  </button>
                  <button className="tool-button" type="button" onClick={() => setZoom((current) => Math.max(0.8, Number((current - 0.1).toFixed(1))))}>
                    −
                  </button>
                  <button className="tool-button" type="button" aria-label="Mi ubicación">
                    <Crosshair size={15} />
                  </button>
                  <button className="tool-button" type="button" aria-label="Capas">
                    <Layers3 size={15} />
                  </button>
                </div>

                <div className="map-layers">
                  <div className="layers-head">
                    <span>Capas</span>
                    <ChevronDown size={14} />
                  </div>
                  <label className="layer-check">
                    <input type="checkbox" checked={layers.heat} onChange={() => toggleLayer('heat')} />
                    <span className="layer-dot" style={{ background: '#dc2626' }} />
                    Calor de siniestros
                  </label>
                  <label className="layer-check">
                    <input type="checkbox" checked={layers.suspiciousShops} onChange={() => toggleLayer('suspiciousShops')} />
                    <span className="layer-dot" style={{ background: '#ea580c' }} />
                    Talleres sospechosos
                  </label>
                  <label className="layer-check">
                    <input type="checkbox" checked={layers.providers} onChange={() => toggleLayer('providers')} />
                    <span className="layer-dot" style={{ background: '#2563eb' }} />
                    Proveedores
                  </label>
                  <label className="layer-check">
                    <input type="checkbox" checked={layers.individualClaims} onChange={() => toggleLayer('individualClaims')} />
                    <span className="layer-dot" style={{ background: '#ec4899' }} />
                    Siniestros individuales
                  </label>
                  <label className="layer-check">
                    <input type="checkbox" checked={layers.riskZones} onChange={() => toggleLayer('riskZones')} />
                    <span className="layer-dot" style={{ background: '#f9a8d4' }} />
                    Zonas de riesgo
                  </label>
                </div>

                <div className="risk-legend">
                  <strong>Nivel de riesgo</strong>
                  <div className="risk-bar" />
                  <div className="risk-labels">
                    <span>Bajo</span>
                    <span>Medio</span>
                    <span>Alto</span>
                    <span>Crítico</span>
                  </div>
                </div>

                <div className="mini-map">
                  <svg viewBox="0 0 130 86" className="mini-svg">
                    <rect x="0" y="0" width="130" height="86" fill="#0f172a" opacity="0.15" />
                    <path d="M10 70 C 35 54, 42 44, 65 38 C 86 33, 97 18, 118 12" stroke="#60a5fa" fill="none" strokeWidth="2" />
                    <rect x="65" y="22" width="38" height="30" fill="none" stroke="#ef4444" strokeWidth="2" />
                  </svg>
                </div>

                <div className="map-loading" style={{ opacity: loading ? 1 : 0 }} />

                <div className="map-grid" style={{ ['--zoom' as never]: zoom } as CSSProperties}>
                  <LeafletMapContainer
                    key={mapMode}
                    center={ECUADOR_CENTER}
                    zoom={zoom}
                    minZoom={5}
                    maxZoom={10}
                    zoomControl={false}
                    scrollWheelZoom={false}
                    bounds={ECUADOR_BOUNDS as unknown as [[number, number], [number, number]]}
                    maxBounds={ECUADOR_BOUNDS as unknown as [[number, number], [number, number]]}
                    maxBoundsViscosity={1}
                    className={`leaflet-map ${mapMode === 'satellite' ? 'satellite' : ''}`}
                  >
                    <LeafletTileLayer
                      attribution={
                        mapMode === 'satellite'
                          ? '&copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community'
                          : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      }
                      url={
                        mapMode === 'satellite'
                          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                      }
                    />
                    <MapSyncController zoom={zoom} mapRef={leafletMapRef} />
                    <EcuadorLayers layers={layers} setTooltip={setTooltip} />
                  </LeafletMapContainer>

                  <svg ref={mapSvgRef} viewBox="0 0 800 450" className="map-export-snapshot" aria-hidden="true">
                    <defs>
                      <linearGradient id="snapshotBg" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#eef3fb" />
                        <stop offset="100%" stopColor="#dde6f3" />
                      </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="800" height="450" fill="url(#snapshotBg)" />
                    {mapHotspots.map((item) => {
                      const { x, y } = projectToSvg(item.lat, item.lng)
                      return (
                        <g key={item.id}>
                          <circle cx={x} cy={y} r={Math.max(20, item.radius / 6500)} fill={item.color} opacity={0.14} />
                          <circle cx={x} cy={y} r={Math.max(10, item.count / 6)} fill={item.color} opacity={0.92} />
                          <text x={x} y={y + 6} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight="700" fill="#fff">
                            {item.count}
                          </text>
                        </g>
                      )
                    })}
                    {individualClaims.map((point) => {
                      const { x, y } = projectToSvg(point.lat, point.lng)
                      return <circle key={point.id} cx={x} cy={y} r={4} fill="#ec4899" />
                    })}
                  </svg>
                </div>

                <MapMarkerTooltip tooltip={tooltip} />
              </section>

              <section className="map-footer-grid">
                <article className="panel">
                  <h3>Concentración por ciudad</h3>
                  <div className="city-list">
                    {cityRowsComputed.map((city) => (
                      <div className="city-progress" key={city.name}>
                        <span className="name">{city.name}</span>
                        <div className="track">
                          <div className={`fill ${city.tone}`} style={{ width: city.width }} />
                        </div>
                        <span className="value mono">{city.value}</span>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="panel">
                  <h3>Top talleres sospechosos</h3>
                  <div className="shops-list">
                    {suspiciousShops.map((shop, index) => (
                      <div className="shop-row" key={shop.name}>
                        <span className="shop-index">{index + 1}.</span>
                        <span>{shop.name}</span>
                        <span className={`shop-count ${shop.tone} mono`}>{shop.cases} casos</span>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="panel">
                  <h3>Patrones detectados por IA</h3>
                  <div className="pattern-grid">
                    {patternCards.map((item) => {
                      const Icon = item.icon
                      return (
                        <div className="pattern-mini" key={item.title}>
                          <div className="pattern-mini-top">
                            <span className={`kpi-icon tone-${item.tone}`}>
                              <Icon size={14} />
                            </span>
                            <span>{item.title}</span>
                          </div>
                          <strong className="value mono">{item.value}</strong>
                          <div className="pattern-delta">{item.delta}</div>
                        </div>
                      )
                    })}
                  </div>
                </article>
              </section>
            </div>
          </div>
        </div>

        <aside className="right-column">
          <section className="right-section">
            <h3>Filtros avanzados</h3>
            <div className="filter-shell">
              <div className="field">
                <label>Rango de fechas</label>
                <select>
                  {filters.fechas.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Ciudad</label>
                <select>
                  {filters.ciudades.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Tipo de siniestro</label>
                <select>
                  {filters.tipos.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Nivel de riesgo</label>
                <select>
                  {filters.riesgo.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
              <button type="button" className="secondary-button apply-button" onClick={applyFilters}>
                <SlidersHorizontal size={16} />
                Aplicar filtros
              </button>
            </div>
          </section>

          <section className="right-section alerts-fade">
            <h3 className="alerts-panel-title">Alertas geográficas (IA)</h3>
            <div className="geo-alerts">
              {filteredAlerts.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="geo-item">
                    <span className={`geo-dot tone-${item.tone}`} />
                    <div className="geo-ico" style={{ background: item.tone === 'red' ? 'rgba(220,38,38,0.08)' : item.tone === 'orange' ? 'rgba(234,88,12,0.08)' : item.tone === 'violet' ? 'rgba(124,58,237,0.08)' : 'rgba(37,99,235,0.08)' }}>
                      <Icon size={16} className={`tone-${item.tone}`} />
                    </div>
                    <div className="geo-copy">
                      <strong>{highlight(item.title, searchQuery)}</strong>
                      <span>{highlight(item.subtitle, searchQuery)}</span>
                    </div>
                    <span className="geo-time">{item.time}</span>
                  </div>
                )
              })}
            </div>
            <a href="#" className="geo-link">
              Ver todas las alertas <ArrowRight size={14} />
            </a>
          </section>
        </aside>
      </div>
    </main>
  )
}

