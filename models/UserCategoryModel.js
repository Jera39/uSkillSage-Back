const mongoose = require('mongoose');

// Esquema para la relación entre usuarios y categorías
const userCategorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al usuario
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Categoría principal seleccionada
    subcategoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' }], // Subcategorías seleccionadas
    unlockedAtLevel: { type: Number, default: 1 }, // Nivel en el que se desbloqueó esta categoría
    createdAt: { type: Date, default: Date.now } // Fecha de creación
});

// Crear el modelo
const UserCategory = mongoose.model('UserCategory', userCategorySchema);

module.exports = UserCategory;