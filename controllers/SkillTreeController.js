const User = require('../models/User');

// 1. Desbloquear un nodo en el árbol de habilidades
exports.unlockSkillNode = async (req, res) => {
    try {
        const { userId, skillNodeId } = req.body;

        // Validar que se proporcionen todos los campos necesarios
        if (!userId || !skillNodeId) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Buscar al usuario
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar si el nodo ya está desbloqueado
        if (user.skills.includes(skillNodeId)) {
            return res.status(400).json({ error: 'El nodo de habilidad ya está desbloqueado' });
        }

        // Desbloquear el nodo
        user.skills.push(skillNodeId);
        await user.save();

        res.json({ message: 'Nodo de habilidad desbloqueado', skills: user.skills });
    } catch (error) {
        console.error('Error al desbloquear el nodo de habilidad:', error);
        res.status(500).json({ error: 'Error al desbloquear el nodo de habilidad' });
    }
};

// 2. Obtener el progreso del árbol de habilidades de un usuario
exports.getUserSkillTree = async (req, res) => {
    try {
        const { userId } = req.params;

        // Buscar al usuario
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Árbol de habilidades del usuario', skills: user.skills });
    } catch (error) {
        console.error('Error al obtener el árbol de habilidades:', error);
        res.status(500).json({ error: 'Error al obtener el árbol de habilidades' });
    }
};