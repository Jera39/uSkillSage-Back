const express = require('express');
const router = express.Router();
const { createUser, getUsers, loginUser, testEmail, createAdmin } = require('../controllers/UserController');
const isAdmin = require('../middlewares/isAdmin'); // Middleware para verificar si es administrador

// Ruta para crear un usuario
router.post('/users', createUser);

// Ruta para obtener todos los usuarios
router.get('/users', getUsers);

router.post('/login', loginUser);

// Nueva ruta para probar el envío de correos
router.post('/test-email', testEmail);

// Ruta para crear un administrador
router.post('/admin/create', createAdmin);

module.exports = router;