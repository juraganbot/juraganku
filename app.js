const express = require('express');
const admin = require('firebase-admin');
require('dotenv').config(); // Untuk membaca variabel lingkungan dari .env (opsional, jika digunakan)

const app = express();
const PORT = process.env.PORT || 3000;

// Inisialisasi Firebase Admin SDK
let serviceAccount;

// Cek apakah konfigurasi Firebase diambil dari variabel lingkungan
if (process.env.FIREBASE_CONFIG) {
    serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
} else {
    // Jika tidak, gunakan file lokal (pastikan hanya digunakan untuk testing lokal)
    serviceAccount = require('./serviceAccountKey.json'); // Ubah sesuai dengan nama file Anda
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://juraganbotku-default-rtdb.firebaseio.com' // Ganti dengan databaseURL proyek Firebase Anda
});

const database = admin.database();

// Endpoint untuk memeriksa status server
app.get('/', (req, res) => {
    res.status(200).send('API is running! 🚀');
});

// Endpoint untuk mengambil data pengguna berdasarkan userId
app.get('/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const userRef = database.ref(`users/${userId}`);
        const snapshot = await userRef.once('value');

        if (snapshot.exists()) {
            res.status(200).json({
                success: true,
                data: snapshot.val(),
            });
        } else {
            res.status(404).json({
                success: false,
                message: `User dengan ID '${userId}' tidak ditemukan.`,
            });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data.',
            error: error.message,
        });
    }
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
