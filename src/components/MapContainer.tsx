'use client'
import { useEffect, useRef, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useUserStore } from '@/store/useUserStore'
import { useFakeSocket } from '@/hooks/useFakeSocket'
import { User } from '@/utils/simulateUsers'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

export default function MapContainer() {
    const mapRef = useRef<mapboxgl.Map | null>(null)
    const markersRef = useRef<Record<string, mapboxgl.Marker>>({})
    const popupRef = useRef<mapboxgl.Popup | null>(null)
    const setUsers = useUserStore((s) => s.setUsers)
    const followUserId = useUserStore((s) => s.followUserId)
    const setFollowUserId = useUserStore((s) => s.setFollowUserId)

    useEffect(() => {
        if (mapRef.current) return
        mapRef.current = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [106.8456, -6.2088],
            zoom: 11
        })

        mapRef.current.addControl(new mapboxgl.NavigationControl())

        popupRef.current = new mapboxgl.Popup({ closeButton: true, closeOnClick: true })

        return () => {
            mapRef.current?.remove()
            mapRef.current = null
        }
    }, [])

    const renderPopup = (user: User) => {
        const detailHTML = `
            <div>
                <h4 style="margin:0;">${user.name}</h4>
                <p style="margin:0; font-size: 12px;">ID: ${user.id}</p>
                <p style="margin:0; font-size: 12px;">Latitude: ${user.latitude.toFixed(5)}</p>
                <p style="margin:0; font-size: 12px;">Longitude: ${user.longitude.toFixed(5)}</p>
            </div>
        `
        return detailHTML
    }

    const handleMessage = useCallback((payload: any) => {
        if (payload.type === 'snapshot') {
            setUsers(payload.users)
        } 
        else if (payload.type === 'update') {
            setUsers(payload.users)
            const mRef = markersRef.current
            const map = mapRef.current
            if (!map) return

            payload.users.forEach((u: any) => {
                const lngLat: [number, number] = [u.longitude, u.latitude]
                if (!mRef[u.id]) {
                    const el = document.createElement('div')
                    el.className = 'user-marker'
                    el.style.width = '12px'
                    el.style.height = '12px'
                    el.style.borderRadius = '50%'
                    el.style.background = '#00bcd4'
                    el.style.border = '2px solid white'
                    el.style.boxShadow = '0 0 4px rgba(0,0,0,0.6)'
                    el.style.cursor = 'pointer'

                    const marker = new mapboxgl.Marker({ element: el })
                        .setLngLat(lngLat)
                        .addTo(map)

                    el.addEventListener('click', ((user, lngLatCopy) => (e: MouseEvent) => {
                        e.stopPropagation()
                        
                        if (popupRef.current) {
                            popupRef.current.setLngLat(lngLatCopy).setHTML(renderPopup(user)).addTo(map);
                            (popupRef.current as any)._userId = user.id;
                        }
                    })(u, lngLat))

                    mRef[u.id] = marker
                } 
                else {
                    mRef[u.id].setLngLat(lngLat)
                }

                if ((popupRef.current as any)?._userId === u.id && popupRef.current?.isOpen()) {
                    popupRef.current.setLngLat([u.longitude, u.latitude]).setHTML(renderPopup(u))
                }

                if (u.id === followUserId) {
                    map.easeTo({
                        center: lngLat,
                        duration: 1000
                    })

                    // popupRef.current?.remove()
                    popupRef.current?.setLngLat(lngLat).setHTML(renderPopup(u)).addTo(map)
                }
            })
        }
    }, [setUsers, followUserId])

    useFakeSocket(handleMessage)

    return <div id="map" style={{ width: '100%', height: '100%' }} />
}