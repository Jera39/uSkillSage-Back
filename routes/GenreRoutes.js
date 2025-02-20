const express = require('express');
const router = express.Router();
const { manageGenres } = require('../controllers/GenreController');

// Ruta genérica para gestionar géneros narrativos
router.route('/genres')
    .post((req, res) => manageGenres(req, res)) // Crear un género (action=C)
    .get((req, res) => manageGenres(req, res)); // Obtener todos los géneros (action=G)

// Ruta genérica para gestionar un género específico por ID
router.route('/genres/:id')
    .put((req, res) => manageGenres(req, res)) // Actualizar un género (action=U)
    .delete((req, res) => manageGenres(req, res)); // Desactivar un género (action=D)

router.get('/testgenres', (req, res) => {
    res.json({ message: 'Esta es una ruta de prueba.' });
});

module.exports = router;