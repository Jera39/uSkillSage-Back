const mongoose = require('mongoose');

// Esquema para las misiones
const missionSchema = new mongoose.Schema({
    subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true }, // Referencia a la subcategoría
    title: { type: String, required: true }, // Título de la misión
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
    reward: { type: String, default: 'Experiencia +50' }, // Recompensa por completar la misión
    createdAt: { type: Date, default: Date.now } // Fecha de creación
});

// Crear el modelo
const Mission = mongoose.model('Mission', missionSchema);

module.exports = Mission;