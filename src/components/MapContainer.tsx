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
    const activePopupUserId = useRef<string | null>(null)
    const isFollowingRef = useRef<boolean>(false)

    const setUsers = useUserStore((s) => s.setUsers)
    const followUserId = useUserStore((s) => s.followUserId)
    const setFollowUserId = useUserStore((s) => s.setFollowUserId)
    const isFollowing = useUserStore((s) => s.isFollowing)
    const setIsFollowing = useUserStore((s) => s.setIsFollowing)

    useEffect(() => {
        if (mapRef.current) return
        mapRef.current = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [106.8456, -6.2088],
            zoom: 11
        })

        mapRef.current.addControl(new mapboxgl.NavigationControl())

        popupRef.current = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: false,
            anchor: 'bottom',
            offset: [0, -10]
        })

        popupRef.current.on('close', () => {
            activePopupUserId.current = null
            if (isFollowing) {
                setFollowUserId(null)
                setIsFollowing(false)
                popupRef.current?.remove()
                activePopupUserId.current = null
            }
        })

        mapRef.current.on('click', (e) => {
            try {
                const orig = (e.originalEvent as MouseEvent | undefined)
                const el = orig?.target as HTMLElement | undefined
                if (el && el.closest && el.closest('.user-marker')) {
                    return
                }
            } catch (err) {
                console.error('Error checking click target:', err)
            }

            if (isFollowing) return

            popupRef.current?.remove()
            activePopupUserId.current = null
        })

        return () => {
            mapRef.current?.remove()
            mapRef.current = null
        }
    }, [setFollowUserId])

    useEffect(() => {
        (window as any).followUser = (userId: string) => {
            setFollowUserId(userId)
            setIsFollowing(true)
        }

        (window as any).unfollowUser = () => {
            setFollowUserId(null)
            setIsFollowing(false)
            popupRef.current?.remove()
            activePopupUserId.current = null
        }

        return () => {
            delete (window as any).followUser
            delete (window as any).unfollowUser
        }
    }, [setFollowUserId])

    const renderPopup = useCallback((user: User, isFollowing = false) => {
        return `
            <div style="font-family: sans-serif; min-width: 180px;">
                <h3 style="margin: 0 0 4px;">${user.name}</h3>
                <p style="margin: 0; font-size: 12px;">ID: ${user.id}</p>
                <p style="margin: 0; font-size: 12px;">Latitude: ${user.latitude.toFixed(5)}</p>
                <p style="margin: 0; font-size: 12px;">Longitude: ${user.longitude.toFixed(5)}</p>
                ${isFollowing
                ? `<button onclick="window.unfollowUser()" style="margin-top:8px; width:100%; padding:6px; background:#ef4444; color:white; border:none; border-radius:4px;cursor:pointer;">Unfollow</button>`
                : `<button onclick="window.followUser('${user.id}')" style="margin-top:8px; width:100%; padding:6px; background:#3b82f6; color:white; border:none; border-radius:4px; cursor:pointer;">Follow</button>`
                }
            </div>
        `
    }, [])

    const handleMessage = useCallback((payload: any) => {
        if (payload.type === 'snapshot') {
            setUsers(payload.users)
        } else if (payload.type === 'update') {
            setUsers(payload.users)
            const mRef = markersRef.current
            const map = mapRef.current
            if (!map) return

            payload.users.forEach((u: User) => {
                const lngLat: [number, number] = [u.longitude, u.latitude]

                if (!mRef[u.id]) {
                    const el = document.createElement('div')
                    el.className = 'user-marker'
                    el.style.cssText = `
                        width:12px;height:12px;border-radius:50%;
                        background:#00bcd4;border:2px solid white;
                        box-shadow:0 0 4px rgba(0,0,0,0.6);
                        cursor:pointer;
                    `

                    const marker = new mapboxgl.Marker({ element: el })
                        .setLngLat(lngLat)
                        .addTo(map)

                    el.addEventListener('click', (ev: MouseEvent) => {
                        ev.stopPropagation()
                        ev.preventDefault()

                        if (popupRef.current) {
                            popupRef.current
                                .setLngLat(lngLat)
                                .setHTML(renderPopup(u, followUserId === u.id))
                                .addTo(map)
                            activePopupUserId.current = u.id
                        }
                    })

                    mRef[u.id] = marker
                } else {
                    mRef[u.id].setLngLat(lngLat)
                }

                if (activePopupUserId.current === u.id && popupRef.current?.isOpen()) {
                    popupRef.current
                        .setLngLat([u.longitude, u.latitude])
                        .setHTML(renderPopup(u, followUserId === u.id))
                }

                if (u.id === followUserId) {
                    map.easeTo({ center: lngLat, duration: 1000 })
                    if (popupRef.current && (!activePopupUserId.current || activePopupUserId.current !== u.id)) {
                        popupRef.current
                            .setLngLat(lngLat)
                            .setHTML(renderPopup(u, true))
                            .addTo(map)
                        activePopupUserId.current = u.id
                    }
                }
            })
        }
    }, [setUsers, followUserId, renderPopup])

    useFakeSocket(handleMessage)

    return <div id="map" style={{ width: '100%', height: '100%' }} />
}