const mongoose = require('mongoose');

// Definir el esquema para la tabla de usuarios
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Nombre de usuario único
    password: { type: String, required: true }, // Contraseña (debería estar cifrada)
    heroName: { type: String, default: 'Aventurero' }, // Nombre del héroe personalizable
    genre: { type: String, enum: ['Fantasía', 'Ciencia Ficción', 'Mitología'], default: 'Fantasía' }, // Género narrativo
    gender: { 
        type: String, 
        enum: ['Masculino', 'Femenino'], 
        required: true 
    }, // Género sexual del usuario
    level: { type: Number, default: 1 }, // Nivel del héroe
    experience: { type: Number, default: 0 }, // Puntos de experiencia
    skills: { type: [String], default: [] }, // Habilidades desbloqueadas
    achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }], // Logros desbloqueados
    isAdmin: { type: Boolean, default: false }, // Campo para identificar administradores
    createdAt: { type: Date, default: Date.now } // Fecha de creación
});

// Crear el modelo (tabla)
const User = mongoose.model('User', userSchema);

module.exports = User;