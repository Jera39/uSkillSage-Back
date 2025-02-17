const express = require('express');
const router = express.Router();
const {
    unlockSkillNode,
    getUserSkillTree
} = require('../controllers/SkillTreeController');

// 1. Desbloquear un nodo en el árbol de habilidades
router.post('/skills/unlock', unlockSkillNode);

// 2. Obtener el progreso del árbol de habilidades de un usuario
router.get('/skills/:userId', getUserSkillTree);

module.exports = router;