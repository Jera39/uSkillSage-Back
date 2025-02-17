const express = require('express');
const router = express.Router();
const {
    createMission,
    assignMissionsToUser,
    completeMission
} = require('../controllers/MissionController');

// 1. Crear una nueva misión
router.post('/missions', createMission);

// 2. Asignar misiones a un usuario según sus subcategorías
router.get('/missions/assign/:userId', assignMissionsToUser);

// 3. Marcar una misión como completada
router.put('/missions/complete', completeMission);

module.exports = router;