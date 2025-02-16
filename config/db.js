const admin = require('firebase-admin');
const serviceAccount = require('../uskillsage-firebase-adminsdk-fbsvc-9d24ce3b65.json');

// Inicialización de Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const firestoreDb = admin.firestore(); // Conexión a Firestore

module.exports = { firestoreDb };