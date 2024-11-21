const express = require('express');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Konfigurasi Firebase menggunakan variabel lingkungan
const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
};

// Inisialisasi Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});

const database = admin.database();

// Endpoint untuk memeriksa status server
app.get('/', (req, res) => {
    res.status(200).send('API is running! 🚀');
});

// Endpoint untuk mengambil data pengguna berdasarkan userId
app.get('/api/users/:userId', async (req, res) => {
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
