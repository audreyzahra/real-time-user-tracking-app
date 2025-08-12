# Realtime Map Tracking

Aplikasi peta realtime menggunakan [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) dan **Next.js 14** dengan simulasi pergerakan pengguna (random walk).

## Fitur
- Menampilkan banyak user di peta.
- Popup detail user.
- Mode **Follow User** (kamera mengikuti pergerakan user).
- Sidebar untuk pencarian user.
- Simulasi pergerakan dengan kecepatan realistis.

---

## Prasyarat

Pastikan sudah terinstall:
- [Node.js](https://nodejs.org/) (disarankan versi 18+)
- [npm](https://www.npmjs.com/)

Buat akun di [Mapbox](https://www.mapbox.com/) dan dapatkan **Access Token**.

---

## Instalasi

Clone repository:

```bash
git clone https://github.com/audreyzahra/real-time-user-tracking-simulation-app.git
cd real-time-user-tracking-simulation-app
```

Instalasi npm :
```bash
npm install
```

**Buatlah File .env.local**
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here

## Jalankan Aplikasi
```bash
npm run dev
```
