export type User = {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    speed?: number;
}

export function generateUsers(count = 100, center = { lat: -6.2, lng: 106.8 }): User[] {
    const users: User[] = []
    for (let i = 0; i < count; i++) {
        const lat = center.lat + (Math.random() - 0.5) * 0.2
        const lng = center.lng + (Math.random() - 0.5) * 0.2
        users.push({ id: `u-${i+1}`, name: `User ${i+1}`, latitude: lat, longitude: lng })
    }
    return users
}

export function randomWalk(user: User) {
    const lat = user.latitude + (Math.random() - 0.5) * 0.0015
    const lng = user.longitude + (Math.random() - 0.5) * 0.0015
    return { ...user, latitude: lat, longitude: lng }
}