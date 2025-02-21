const mongoose = require('mongoose');

// Esquema para las imágenes de los personajes
const characterImageSchema = new mongoose.Schema({
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
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    }, // Género del personaje (masculino/femenino)
    level: {
        type: Number,
        required: true
    }, // Nivel del personaje (1, 2, 3, etc.)
    image: {
        type: String,
        required: true
    }, // URL o ruta de la imagen del personaje
    description: {
        type: String
    }, // Descripción opcional de la imagen
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
const CharacterImage = mongoose.model('CharacterImage', characterImageSchema);

module.exports = CharacterImage;