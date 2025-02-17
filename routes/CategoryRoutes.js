const express = require('express');
const router = express.Router();
const {
    createCategory,
    createSubcategory,
    assignCategoriesToUser,
    getUserCategories,
    updateUserCategories
} = require('../controllers/CategoryController');

// 1. Crear una categoría principal
router.post('/categories', createCategory);

// 2. Crear una subcategoría asociada a una categoría principal
router.post('/categories/:categoryId/subcategories', createSubcategory);

// 3. Asignar categorías y subcategorías a un usuario
router.post('/user-categories', assignCategoriesToUser);

// 4. Obtener las categorías y subcategorías asignadas a un usuario
router.get('/user-categories/:userId', getUserCategories);

// 5. Actualizar las categorías y subcategorías de un usuario según su nivel
router.put('/user-categories/:userId', updateUserCategories);

module.exports = router;