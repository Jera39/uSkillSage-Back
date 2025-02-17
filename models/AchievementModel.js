const mongoose = require('mongoose');

// Esquema para los logros
const achievementSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Nombre genérico del logro (e.g., "Primera Misión Completada")
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
    reward: { type: String, default: 'Medalla de Bronce' }, // Recompensa asociada al logro
    createdAt: { type: Date, default: Date.now } // Fecha de creación
});

// Crear el modelo
const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;