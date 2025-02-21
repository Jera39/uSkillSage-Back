const express = require('express');
const router = express.Router();
const { manageCategories, getGenresForCategories } = require('../controllers/CategoryController');

// Ruta genérica para gestionar categorías
router.route('/categories')
    .post((req, res) => manageCategories(req, res)) // Crear una categoría (action=C)
    .get((req, res) => manageCategories(req, res)); // Obtener todas las categorías (action=G)

// Ruta genérica para gestionar una categoría específica por ID
router.route('/categories/:id')
    .put((req, res) => manageCategories(req, res)) // Actualizar una categoría (action=U)
    .delete((req, res) => manageCategories(req, res)); // Desactivar una categoría (action=D)

// Ruta para obtener todos los géneros disponibles para ser usados al crear/editar categorías
router.get('/genres-for-categories', (req, res) => getGenresForCategories(req, res));

// Ruta de prueba
router.get('/testcategories', (req, res) => {
    res.json({ message: 'Esta es una ruta de prueba para categorías.' });
});

module.exports = router;