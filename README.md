# Realtime Map Tracking

Aplikasi ini adalah Real-time User Location Tracking berbasis Next.js + Mapbox GL dengan integrasi WebSocket (disimulasikan menggunakan useFakeSocket).
Tujuannya adalah untuk menampilkan lokasi setidaknya 100 user secara real-time, dengan fitur follow mode untuk memusatkan peta pada satu user yang sedang diikuti.

## Fitur
- Menampilkan banyak user di peta.
- Popup detail user.
- Mode **Follow User** (kamera mengikuti pergerakan user).
- Sidebar untuk pencarian user.
- Simulasi pergerakan dengan kecepatan realistis.

---

## Arsitektur Aplikasi
Komponen Utama
A. MapContainer
1. Menginisialisasi instance Mapbox GL Map.
2. Menangani pembuatan dan update marker untuk setiap user.
3. Menampilkan popup saat marker diklik atau saat follow mode aktif.
4. Menangani follow mode yaitu jika followUserId terisi, peta akan otomatis center pada user tersebut dan popup akan mengikuti pergerakannya.
5. Memanfaatkan useRef untuk:
  - mapRef → menyimpan instance map.
  - markersRef → menyimpan daftar marker user.
  - popupRef → menyimpan instance popup aktif.
  - activePopupUserId → melacak popup user yang sedang terbuka.
  - isFollowingRef → melacak apakah sedang dalam mode mengikuti user.
B. Sidebar
1. Menampilkan daftar user dan pencarian berdasarkan nama atau ID.
2. Memungkinkan user dipilih dari sidebar untuk masuk ke follow mode.
3. Tidak lagi memiliki tombol follow di sidebar, karena follow dilakukan melalui popup di peta.
C. Store (Zustand)
1. State management menggunakan Zustand:
- users → daftar semua user beserta posisi terbarunya.
- followUserId → ID user yang sedang diikuti.
- setUsers → memperbarui daftar user.
- setFollowUserId → mengganti user yang sedang diikuti.
D. Simulasi WebSocket
1. Menggunakan useFakeSocket untuk mengirim data snapshot (awal) dan update (tiap detik).
2. Data pergerakan user disimulasikan menggunakan random walk dengan sedikit variasi pada latitude dan longitude untuk membuat pergerakan terlihat realistis.

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

## File .env.local
```bash
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
```

## Jalankan Aplikasi
```bash
npm run dev
```

## Aplikasi akan berjalan di
http://localhost:3000
---
