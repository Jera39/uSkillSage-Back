const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/UserRoutes');
const missionRoutes = require('./routes/MissionRoutes');
const skillTreeRoutes = require('./routes/SkillTreeRoutes');
const achievementRoutes = require('./routes/AchievementRoutes');
const genreRoutes = require('./routes/GenreRoutes');
const categoryRoutes = require('./routes/CategoryRoutes');

require('dotenv').config();

const app = express();
const port = 3000;
// const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['https://u-skill-sage.vercel.app', 'http://localhost:4200'], // Permite estas URLs
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
}));

// Rutas
app.use('/api', userRoutes);
app.use('/api', categoryRoutes); // Rutas para categorías
app.use('/api', missionRoutes); // Rutas para misiones
app.use('/api', skillTreeRoutes); // Rutas para el mapa de habilidades
app.use('/api', achievementRoutes); // Rutas para logros
app.use('/api', genreRoutes); // Rutas para géneros narrativos

// Ruta de prueba
app.get('/api/data', (req, res) => {
    res.json({ message: '¡Hola desde el backend!' });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});

console.log('Correo:', process.env.EMAIL_USER);
console.log('Contraseña:', process.env.EMAIL_PASS);