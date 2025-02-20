const mongoose = require('mongoose');

// Definir el esquema para la tabla de géneros narrativos
const genreSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    }, // Nombre del género narrativo (único y obligatorio)
    image: { 
        type: String, 
        required: true 
    }, // URL o ruta de la imagen representativa del género
    welcomeMessageMale: { 
        type: String, 
        required: true 
    }, // Mensaje de bienvenida para hombres
    welcomeMessageFemale: { 
        type: String, 
        required: true 
    }, // Mensaje de bienvenida para mujeres
    isActive: { 
        type: Boolean, 
        default: true 
    }, // Indica si el género está activo (true) o desactivado (false)
    createdAt: { 
        type: Date, 
        default: Date.now 
    } // Fecha de creación
});

// Crear el modelo (tabla)
const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;