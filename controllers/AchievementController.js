const User = require('../models/User');

// 1. Desbloquear un logro
exports.unlockAchievement = async (req, res) => {
    try {
        const { userId, achievementName } = req.body;

        // Validar que se proporcionen todos los campos necesarios
        if (!userId || !achievementName) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Buscar al usuario
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar si el logro ya está desbloqueado
        if (user.achievements.includes(achievementName)) {
            return res.status(400).json({ error: 'El logro ya está desbloqueado' });
        }

        // Desbloquear el logro
        user.achievements.push(achievementName);
        await user.save();

        res.json({ message: 'Logro desbloqueado', achievements: user.achievements });
    } catch (error) {
        console.error('Error al desbloquear el logro:', error);
        res.status(500).json({ error: 'Error al desbloquear el logro' });
    }
};

// 2. Obtener los logros de un usuario
exports.getUserAchievements = async (req, res) => {
    try {
        const { userId } = req.params;

        // Buscar al usuario
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Logros del usuario', achievements: user.achievements });
    } catch (error) {
        console.error('Error al obtener los logros:', error);
        res.status(500).json({ error: 'Error al obtener los logros' });
    }
};