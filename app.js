const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/UserRoutes');
const categoryRoutes = require('./routes/CategoryRoutes');
const missionRoutes = require('./routes/MissionRoutes');
const skillTreeRoutes = require('./routes/SkillTreeRoutes');
const achievementRoutes = require('./routes/AchievementRoutes');
require('dotenv').config();

const app = express();
const port = 3000;
// const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
app.use('/api', userRoutes);
app.use('/api', categoryRoutes); // Rutas para categorías
app.use('/api', missionRoutes); // Rutas para misiones
app.use('/api', skillTreeRoutes); // Rutas para el mapa de habilidades
app.use('/api', achievementRoutes); // Rutas para logros

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