const express = require('express');
const router = express.Router();
const {
    unlockAchievement,
    getUserAchievements
} = require('../controllers/AchievementController');

// 1. Desbloquear un logro
router.post('/achievements/unlock', unlockAchievement);

// 2. Obtener los logros de un usuario
router.get('/achievements/:userId', getUserAchievements);

module.exports = router;