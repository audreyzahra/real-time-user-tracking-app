import { useEffect, useRef } from 'react'
import { generateUsers, randomWalk, type User } from '@/utils/simulateUsers'

type FakeSocket = {
    onmessage: ((ev: { data: string }) => void) | null
    close: () => void
}

export function useFakeSocket(onMessage: (data: any) => void) {
    const socketRef = useRef<FakeSocket | null>(null)

    useEffect(() => {
        const users = generateUsers(100)
        let running = true
        socketRef.current = {
            onmessage: null,
            close() { running = false }
        }

        setTimeout(() => onMessage({ type: 'snapshot', users }), 100)

        const t = setInterval(() => {
            if (!running) return
            const updated = users.map(randomWalk)
            for (let i = 0; i < users.length; i++) {
                users[i] = updated[i]
            }
            onMessage({ type: 'update', users: updated })
        }, 1000)

        return () => {
            running = false
            clearInterval(t)
        }
    }, [onMessage])
}