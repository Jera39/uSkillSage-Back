const express = require('express');
const router = express.Router();
const { createUser, getUsers, loginUser } = require('../controllers/UserController');

// Ruta para crear un usuario
router.post('/users', createUser);

// Ruta para obtener todos los usuarios
router.get('/users', getUsers);

router.post('/login', loginUser);

module.exports = router;