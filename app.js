const express = require('express');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Konfigurasi Firebase
const serviceAccount = {
    "type": "service_account",
    "project_id": "juraganbotku",
    "private_key_id": "867530153b9d72b384374e4e477169fc92dfe5fd",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC3DZHbwJTUHDwY\nB9zV2Bod/CQgS4Gv3dj4eckwVG/fqTfXHYRGOX/hkoryijJtJ67ZBcf3UopMRg1W\nkEpzkLTDmOrNW+wjt6Y3b1DhEemVlZaT+d5bKxCM4noVinBlMUAgQ0oNmjPN6WWk\nvQIsVBj/pjfZJXbdCKA3scwaS2pyr4KHeyReTM99F71EINVws+d0WwuiCask6pcu\nLgsTvj9kcm3KWXHsiXc7VQTj8+VgS+HXZ53ROX84lO5ghoI2OlGMkTL946vHp+KH\n+hbiie+xadH40VLW+bpuGXdr75xaaYjCU8bpX02vElnl/FJ3g2LEM2MmGrYWdBr9\nro+UxAQrAgMBAAECggEAA4Co99F5h416wOL1oMnfxg8bCdsoAht2mVqLNPeIpHjy\nbpVMAKP9BG3vZrCqQlhuCg0IRH051DfK7YsZQZjVPKDibUeC/zP2ZD0nCQd0tr4E\nAZTYYloymN+EgoEBoY4NshBXjGcU8q2ymjJbpkl9qPafPvJukdAmcKpgQ2iKAuO8\nhCUjbiVwYBzOEpXYW9/BBlrPcmIZdHPz5qb5TBBp4pdV2Z4pCFmWLkEPeltGTEjN\ntYRxs8h2INx5Dx32B6GEfU/RN9v5oiefao+E9prkfA11IBk+72dGMLtS5SM3zS9t\nQ+hEAUbicILWXNOKJDKEIHZ8OlFklDU3oM8TjBIGUQKBgQDtBgitYLbKyEVFlzRG\nAnWW2CCoqGLvspFOp/p8eHm1yn9/Ijii4VExGQy+RJ4P7DbQegvEa4dbK91NDYUv\nem+mLiVc0pd5B8UadLLCBA79DKdXhwOK06rD4Ckeik4TGtAXwLvrQfqgoTRdLzD7\nYF0ou6L9jscWk1nX4TCBoy4PrwKBgQDFtV70EwxRJhY01v69oAg8lOmVxKpwnb+x\nVQcQO2C4WZkEgpAj3V1SAcYVvwdOzn+iPkwVxz6conAx8Z+BxUZblRHnYix0dVHs\nyMc5fO10sj7Eb6/DzCVmbPddR0Xi/Z0GK1W7fflaS0I/vind4YdVmPmYdr2YpxLy\nQ4t0mXtWRQKBgBECUNcYTKXKr2XqDt9DR+r2QYm447ityM2rMkeCYcGQ8YtPCl9t\n6eSrFoYE6I7d9aUKTRPgX4tEX5Iq+TbKA38aaqX5mtMdoqBeZYGUxvqT0OJwFun8\nfJGn4WuGo0mtr+c0dofQaUrjpp1VSJ+Rb73/kRe/CjxtgJIEX/W9nw2TAoGAX8N6\nOr7/OE86cl2xBih91NpMSj74T5QZRcvpn/Mi5ih/9a9IIhcXHKG/UMk2wPVE3VFP\niTz5FuWXcpmWqUTkz3dlNK5Y2g/5nrehyDa6zcuIm519hVlcxEADkSr0rv4pENPs\nsuRR42qQrE9v+AlFhDCUtUTOkSJcCvysj83H8AECgYEApIxh5icJk/EdXRvhiusX\ncfp3C2McxyIDJTR9LcvWa2Hn8DLBi4npZqdonEa4wV/5GDOdDiRKgB7fjRKmabB/\ncgf8UppyPj+JmRPbhyMeBy/QvYeHBtg2Fha9S6iivdPHK2VoY4O2TbERBqECH5is\n7k8Kb+ooDkZTTSRsBfDqRxU=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-4rlxs@juraganbotku.iam.gserviceaccount.com",
    "client_id": "111210613585849262711",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4rlxs%40juraganbotku.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
};

// Inisialisasi Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://juraganbotku-default-rtdb.firebaseio.com"
});

const database = admin.database();

// Endpoint untuk memeriksa status server
app.get('/', (req, res) => {
    res.status(200).send('API is running! 🚀');
});

// Endpoint untuk mengambil data pengguna berdasarkan userId
app.get('//:userId', async (req, res) => {
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
