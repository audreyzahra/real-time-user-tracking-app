'use client'
import { useState, useEffect } from 'react'
import { useUserStore } from '@/store/useUserStore'

export default function Sidebar() {
    const users = useUserStore((s) => s.users)
    const setFollowUserId = useUserStore((s) => s.setFollowUserId)
    const [searchTerm, setSearchTerm] = useState('')
    const [q, setQ] = useState('')

    useEffect(() => {
    const t = setTimeout(() => setQ(searchTerm), 200) // delay 200ms
    return () => clearTimeout(t)
    }, [searchTerm])

    const results = q ? users.filter(u => u.name.toLowerCase().includes(q.toLowerCase()) || u.id.includes(q)) : []

    return (
        <div className="sidebar">
            <div style={{ marginBottom: 8 }}>
                <input
                    placeholder="Search by ID or Name"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
            </div>
            <div style={{ maxHeight: 300, overflow: 'auto' }}>
                {results.length > 0 && (
                    <p style={{ margin: '8px 0', fontWeight: 500 }}>Click User To Follow</p>
                )}
                {results.map((u) => (
                    <div
                        key={u.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            padding: '4px 0',
                            gap: 8,
                        }}
                        onClick={() => setFollowUserId(u.id)}
                    >
                        <p style={{ margin: 0 }}>{u.name}</p>
                        <small style={{ color: '#888' }}>({u.id})</small>
                    </div>
                ))}
            </div>
            <div style={{ margin: '8px 0' }}>
                <strong>Total users:</strong> {users.length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <button onClick={() => setFollowUserId(null)}>Unfollow</button>
            </div>
        </div>
    )
}