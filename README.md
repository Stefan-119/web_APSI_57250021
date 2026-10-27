# FanEDU — Ensiklopedia APSI

Platform ensiklopedia kurasi akademik materi **Analisis dan Perancangan Sistem Informasi (APSI)** — Institut Bisnis dan Informatika Kwik Kian Gie (IBIKKG). Memadukan pencarian terstruktur, repositori terverifikasi, studio diagram UML interaktif, dan pembaca ensiklopedis standar OMG & IEEE.

---

## 🚀 Panduan Menjalankan Project di Localhost

Ikuti langkah-langkah berikut untuk meng-clone dan menjalankan aplikasi di komputer lokal Anda:

### 1. Prasyarat Sistem
Pastikan Anda sudah menginstal:
* **Node.js** (versi 18, 20, atau 22 LTS disarankan) — Cek dengan `node -v`
* **npm** (biasanya otomatis terinstal bersama Node.js) — Cek dengan `npm -v`
* **Git** — Cek dengan `git -v`

---

### 2. Clone Repository ke Komputer Lokal

Buka terminal atau command prompt (CMD / PowerShell / Git Bash), lalu jalankan:

```bash
# Clone repository dari GitHub
git clone https://github.com/Stefan-119/web_APSI_57250021.git

# Masuk ke direktori folder project
cd web_APSI_57250021
```

---

### 3. Install Dependencies

Jalankan perintah berikut untuk mengunduh semua library yang diperlukan:

```bash
npm install --legacy-peer-deps
```

> **Catatan:** Flag `--legacy-peer-deps` dianjurkan untuk memastikan kecocokan versi paket Tailwind CSS v4 dan React 19.

---

### 4. Konfigurasi Environment & Firebase

1. Pastikan file `firebase-applet-config.json` sudah ada di root direktori dengan konfigurasi Firebase project Anda (`web-apsi-57250021`).
2. (Opsional) Salin file contoh environment jika ingin mengaktifkan integrasi AI:
   ```bash
   cp .env.example .env
   ```

---

### 5. Jalankan Development Server (Localhost)

Untuk menjalankan server pengembangan:

```bash
npm run dev
```

Terminal akan menampilkan pesan:
```text
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://0.0.0.0:3000/
```

Buka peramban (Chrome, Edge, Firefox, dsb.) dan akses:
👉 **`http://localhost:3000`**

---

### 6. Script Lainnya yang Tersedia

* **Build untuk Production**:
  ```bash
  npm run build
  ```
  Menghasilkan folder `dist/` yang siap dideploy ke GitHub Pages, Vercel, Firebase Hosting, atau server web lainnya.

* **Preview Hasil Build**:
  ```bash
  npm run preview
  ```

* **Type Check (Linter)**:
  ```bash
  npm run lint
  ```

---

## 🛠️ Tech Stack

* **Frontend Framework**: React 19 + TypeScript
* **Styling**: Tailwind CSS v4
* **Build Tool**: Vite 8
* **Database & Auth**: Google Firebase (Cloud Firestore & Firebase Authentication)
* **Icons**: Google Material Symbols & Lucide Icons
