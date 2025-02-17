const mongoose = require('mongoose');

// Esquema para las categorías principales
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true }, // Nombre genérico de la categoría (e.g., "Salud y Bienestar")
    description: { 
        type: {
            fantasy: { type: String }, // Descripción para fantasía
            sciFi: { type: String },   // Descripción para ciencia ficción
            mythology: { type: String } // Descripción para mitología
        },
        required: true
    },
    genderSpecificDescriptions: { 
        type: {
            male: { 
                fantasy: { type: String },
                sciFi: { type: String },
                mythology: { type: String }
            },
            female: { 
                fantasy: { type: String },
                sciFi: { type: String },
                mythology: { type: String }
            }
        },
        required: true
    },
    createdAt: { type: Date, default: Date.now } // Fecha de creación
});

// Crear el modelo
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;