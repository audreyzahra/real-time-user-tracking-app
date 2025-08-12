'use client'
import dynamic from 'next/dynamic'
import Sidebar from '@/components/Sidebar'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const MapContainer = dynamic(() => import('@/components/MapContainer'), { ssr: false })

export default function Page() {
  return (
    <div className={inter.className} style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Sidebar />
      <MapContainer />
    </div>
  )
}