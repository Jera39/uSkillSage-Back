const Subcategory = require('../models/SubcategoryModel');

// Crear una subcategoría
exports.createSubcategory = async (req, res) => {
    try {
        const { categoryId, name, description } = req.body;
        const newSubcategory = new Subcategory({ categoryId, name, description });
        await newSubcategory.save();
        res.status(201).json({ message: 'Subcategoría creada', subcategory: newSubcategory });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la subcategoría' });
    }
};