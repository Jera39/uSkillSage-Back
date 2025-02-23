const express = require('express');
const router = express.Router();
const { manageCategories } = require('../controllers/CategoryController'); // Solo necesitamos manageCategories

// Ruta genérica para gestionar categorías
router.route('/categories')
    .post((req, res) => manageCategories(req, res)) // Crear una categoría (action=C)
    .get((req, res) => manageCategories(req, res)); // Obtener todas las categorías (action=G)

// Ruta genérica para gestionar una categoría específica por ID
router.route('/categories/:id')
    .put((req, res) => manageCategories(req, res)) // Actualizar una categoría (action=U)
    .delete((req, res) => manageCategories(req, res)); // Desactivar una categoría (action=D)

// Ruta de prueba
router.get('/testcategories', (req, res) => {
    res.json({ message: 'Esta es una ruta de prueba para categorías.' });
});

module.exports = router;