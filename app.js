const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/UserRoutes');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
app.use('/api', userRoutes);

// Ruta de prueba
app.get('/api/data', (req, res) => {
    res.json({ message: '¡Hola desde el backend!' });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port} :3`);
});