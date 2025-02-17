const Mission = require('../models/MissionModel');
const UserCategory = require('../models/UserCategoryModel');

// 1. Crear una nueva misión
exports.createMission = async (req, res) => {
    try {
        const { subcategoryId, title, description, genderSpecificDescriptions, reward } = req.body;

        // Validar que se proporcionen todos los campos necesarios
        if (!subcategoryId || !title || !description || !genderSpecificDescriptions || !reward) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const newMission = new Mission({
            subcategoryId,
            title,
            description,
            genderSpecificDescriptions,
            reward,
            createdAt: new Date()
        });

        await newMission.save();
        res.status(201).json({ message: 'Misión creada', mission: newMission });
    } catch (error) {
        console.error('Error al crear la misión:', error);
        res.status(500).json({ error: 'Error al crear la misión' });
    }
};

// 2. Asignar misiones a un usuario según sus subcategorías
exports.assignMissionsToUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Obtener las subcategorías del usuario
        const userCategories = await UserCategory.find({ userId }).populate('subcategoryIds');

        if (!userCategories || userCategories.length === 0) {
            return res.status(404).json({ error: 'El usuario no tiene subcategorías asignadas' });
        }

        // Seleccionar una misión aleatoria para cada subcategoría
        const missions = [];
        for (const category of userCategories) {
            for (const subcategory of category.subcategoryIds) {
                const randomMission = await Mission.findOne({ subcategoryId: subcategory._id }).lean();
                if (randomMission) {
                    missions.push(randomMission);
                }
            }
        }

        res.json({ message: 'Misiones asignadas', missions });
    } catch (error) {
        console.error('Error al asignar misiones al usuario:', error);
        res.status(500).json({ error: 'Error al asignar misiones al usuario' });
    }
};

// 3. Marcar una misión como completada
exports.completeMission = async (req, res) => {
    try {
        const { missionId, userId } = req.body;

        // Validar que se proporcionen todos los campos necesarios
        if (!missionId || !userId) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Marcar la misión como completada
        const mission = await Mission.findById(missionId);
        if (!mission) {
            return res.status(404).json({ error: 'Misión no encontrada' });
        }

        mission.completed = true;
        mission.completedAt = new Date();
        await mission.save();

        res.json({ message: 'Misión completada', mission });
    } catch (error) {
        console.error('Error al completar la misión:', error);
        res.status(500).json({ error: 'Error al completar la misión' });
    }
};