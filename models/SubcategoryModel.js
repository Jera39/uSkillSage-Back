const mongoose = require('mongoose');

// Esquema para las subcategorías
const subcategorySchema = new mongoose.Schema({
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Referencia a la categoría principal
    name: { type: String, required: true }, // Nombre genérico de la subcategoría (e.g., "Ejercicio Físico")
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
const Subcategory = mongoose.model('Subcategory', subcategorySchema);

module.exports = Subcategory;