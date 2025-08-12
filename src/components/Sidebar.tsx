'use client'
import { useState, useEffect, useRef } from 'react'
import { useUserStore } from '@/store/useUserStore'
import mapboxgl from 'mapbox-gl'

export default function Sidebar() {
    const popupRef = useRef<mapboxgl.Popup | null>(null)
    const [q, setQ] = useState('')

    const users = useUserStore((s) => s.users)
    const setFollowUserId = useUserStore((s) => s.setFollowUserId)
    const followUserId = useUserStore((s) => s.followUserId)
    const setIsFollowing = useUserStore((s) => s.setIsFollowing)
    const isFollowing = useUserStore((s) => s.isFollowing)

    const results = q ? users.filter(u => u.name.toLowerCase().includes(q.toLowerCase()) || u.id.includes(q)) : []

    return (
        <div className="sidebar">
            <div style={{ marginBottom: 8}}>
                <input
                    placeholder="Search by ID or Name"
                    value={q}
                    onChange={(e) => {
                        if (popupRef.current) {
                            popupRef.current.remove()
                            popupRef.current = null
                        }
                        if (e.target.value === '') {
                            setFollowUserId(null)
                        }
                        else {
                            setFollowUserId(null)
                        }
                        setQ(e.target.value)
                    }}
                />
            </div>
            <div style={{ maxHeight: 300, overflow: 'auto' }}>
                {results.length > 0 && (
                    <p style={{ margin: '8px 0', textAlign: 'center', fontWeight: 500 }}>Click User To Follow</p>
                )}
                {results.map((u) => (
                    <div
                        key={u.id}
                        style={{
                            backgroundColor: 'rgba(75, 86, 109, 0.7)',
                            borderRadius: 8,
                            display: 'flex',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            gap: 8,
                            padding: '4px 8px',
                            marginTop: 8,
                            marginBottom: 8,
                        }}
                        onClick={() => {
                                setFollowUserId(u.id)
                                setIsFollowing(true)
                            }
                        }
                    >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <p style={{ margin: 0 }}>{u.name}</p>
                            <small style={{ color: '#888' }}>({u.id})</small>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {isFollowing && followUserId === u.id && <small style={{ backgroundColor: '#10b981', padding: '2px 4px', borderRadius: '4px' }}>Following</small>}
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ margin: '8px 0' }}>
                <strong>Total users:</strong> {users.length}
            </div>
        </div>
    )
}