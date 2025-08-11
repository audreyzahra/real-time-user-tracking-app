'use client'
import dynamic from 'next/dynamic'
import Sidebar from '@/components/Sidebar'

const MapContainer = dynamic(() => import('@/components/MapContainer'), { ssr: false })

export default function Page() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Sidebar />
      <MapContainer />
    </div>
  )
}