const mongoose = require('mongoose');

// Esquema para las categorías principales
const categorySchema = new mongoose.Schema({
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: true
    }, // Referencia al género narrativo
    category: {
        type: String,
        required: true
    }, // Categoría principal (Salud y Bienestar, Conocimiento, etc.)
    subcategory: {
        type: String,
        required: true
    }, // Subcategoría específica
    missionTemplates: [{
        gender: {
            type: String,
            enum: ['male', 'female'],
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }], // Plantillas de misiones por género
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Crear el modelo
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;