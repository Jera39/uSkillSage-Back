const { firestoreDb } = require('../config/db');
const Category = require('../models/CategoryModel');
const Subcategory = require('../models/SubcategoryModel');
const UserCategory = require('../models/UserCategoryModel');

// 1. Crear una categoría principal
exports.createCategory = async (req, res) => {
    try {
        const { name, description, genderSpecificDescriptions } = req.body;

        // Validar que se proporcionen todos los campos necesarios
        if (!name || !description || !genderSpecificDescriptions) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const newCategory = new Category({
            name,
            description,
            genderSpecificDescriptions,
            createdAt: new Date()
        });

        await newCategory.save();
        res.status(201).json({ message: 'Categoría creada', category: newCategory });
    } catch (error) {
        console.error('Error al crear la categoría:', error);
        res.status(500).json({ error: 'Error al crear la categoría' });
    }
};

// 2. Crear una subcategoría asociada a una categoría principal
exports.createSubcategory = async (req, res) => {
    try {
        const { categoryId, name, description, genderSpecificDescriptions } = req.body;

        // Validar que se proporcionen todos los campos necesarios
        if (!categoryId || !name || !description || !genderSpecificDescriptions) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const newSubcategory = new Subcategory({
            categoryId,
            name,
            description,
            genderSpecificDescriptions,
            createdAt: new Date()
        });

        await newSubcategory.save();
        res.status(201).json({ message: 'Subcategoría creada', subcategory: newSubcategory });
    } catch (error) {
        console.error('Error al crear la subcategoría:', error);
        res.status(500).json({ error: 'Error al crear la subcategoría' });
    }
};

// 3. Asignar categorías y subcategorías a un usuario
exports.assignCategoriesToUser = async (req, res) => {
    try {
        const { userId, categoryId, subcategoryIds } = req.body;

        // Validar que se proporcionen todos los campos necesarios
        if (!userId || !categoryId || !subcategoryIds || subcategoryIds.length > 3) {
            return res.status(400).json({ error: 'Datos inválidos o demasiadas subcategorías seleccionadas' });
        }

        // Verificar si el usuario ya tiene asignada una categoría principal
        const existingUserCategory = await UserCategory.findOne({ userId });
        if (existingUserCategory) {
            return res.status(400).json({ error: 'El usuario ya tiene una categoría principal asignada' });
        }

        const newUserCategory = new UserCategory({
            userId,
            categoryId,
            subcategoryIds,
            unlockedAtLevel: 1,
            createdAt: new Date()
        });

        await newUserCategory.save();
        res.status(201).json({ message: 'Categorías asignadas al usuario', userCategory: newUserCategory });
    } catch (error) {
        console.error('Error al asignar categorías al usuario:', error);
        res.status(500).json({ error: 'Error al asignar categorías al usuario' });
    }
};

// 4. Obtener las categorías y subcategorías asignadas a un usuario
exports.getUserCategories = async (req, res) => {
    try {
        const { userId } = req.params;

        // Buscar las categorías y subcategorías asignadas al usuario
        const userCategories = await UserCategory.find({ userId })
            .populate('categoryId') // Cargar detalles de la categoría principal
            .populate('subcategoryIds'); // Cargar detalles de las subcategorías

        res.json(userCategories);
    } catch (error) {
        console.error('Error al obtener las categorías del usuario:', error);
        res.status(500).json({ error: 'Error al obtener las categorías del usuario' });
    }
};

// 5. Actualizar las categorías y subcategorías de un usuario según su nivel
exports.updateUserCategories = async (req, res) => {
    try {
        const { userId, categoryId, subcategoryIds } = req.body;

        // Validar que se proporcionen todos los campos necesarios
        if (!userId || !categoryId || !subcategoryIds) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Actualizar la categoría y subcategorías del usuario
        const updatedUserCategory = await UserCategory.findOneAndUpdate(
            { userId },
            { categoryId, subcategoryIds, unlockedAtLevel: Date.now() },
            { new: true }
        );

        if (!updatedUserCategory) {
            return res.status(404).json({ error: 'No se encontraron categorías para este usuario' });
        }

        res.json({ message: 'Categorías actualizadas', userCategory: updatedUserCategory });
    } catch (error) {
        console.error('Error al actualizar las categorías del usuario:', error);
        res.status(500).json({ error: 'Error al actualizar las categorías del usuario' });
    }
};