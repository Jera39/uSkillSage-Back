const express = require('express');
const router = express.Router();
const { createUser, getUsers, loginUser, testEmail } = require('../controllers/UserController');

// Ruta para crear un usuario
router.post('/users', createUser);

// Ruta para obtener todos los usuarios
router.get('/users', getUsers);

router.post('/login', loginUser);

// Nueva ruta para probar el envío de correos
router.post('/test-email', testEmail);

module.exports = router;