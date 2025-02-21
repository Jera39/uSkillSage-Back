const { firestoreDb } = require("../config/db");

/**
 * Método genérico para gestionar categorías.
 * @param {string} action - Acción a realizar ('C': Crear, 'U': Actualizar, 'D': Desactivar, 'G': Obtener)
 * @param {string} id - ID de la categoría (requerido para 'U' y 'D')
 * @param {object} categoryData - Datos de la categoría (requerido para 'C' y 'U')
 */
exports.manageCategories = async (req, res) => {
    try {
        const { action } = req.query; // Acción a realizar ('C', 'U', 'D', 'G')
        const { id } = req.params; // ID de la categoría (necesario para 'U' y 'D')
        const categoryData = req.body; // Datos de la categoría (necesarios para 'C' y 'U')

        switch (action.toUpperCase()) {
            case "C": // Crear una categoría
                // Validar que se proporcionen todos los campos obligatorios
                if (
                    !categoryData.genreId ||
                    !categoryData.category ||
                    !categoryData.subcategory ||
                    !categoryData.missionTemplates
                ) {
                    return res
                        .status(400)
                        .json({ error: "Todos los campos son obligatorios." });
                }

                // Verificar si el género existe
                const genreDoc = await firestoreDb.collection("genres").doc(categoryData.genreId).get();
                if (!genreDoc.exists) {
                    return res.status(400).json({ error: "El género especificado no existe." });
                }

                // Verificar si la categoría ya existe
                const categorySnapshot = await firestoreDb
                    .collection("categories")
                    .where("genreId", "==", categoryData.genreId)
                    .where("category", "==", categoryData.category)
                    .where("subcategory", "==", categoryData.subcategory)
                    .get();

                if (!categorySnapshot.empty) {
                    return res.status(400).json({ error: "La categoría ya existe." });
                }

                // Crear la nueva categoría
                const newCategory = {
                    genreId: categoryData.genreId,
                    category: categoryData.category,
                    subcategory: categoryData.subcategory,
                    missionTemplates: categoryData.missionTemplates,
                    isActive: true, // Por defecto, la categoría está activa
                    createdAt: new Date(),
                };

                const categoryRef = await firestoreDb.collection("categories").add(newCategory);
                return res
                    .status(201)
                    .json({
                        message: "Categoría creada exitosamente.",
                        id: categoryRef.id,
                    });

            case "U": // Actualizar una categoría
                if (!id) {
                    return res
                        .status(400)
                        .json({
                            error: "El ID de la categoría es obligatorio para actualizar.",
                        });
                }

                const categoryToUpdate = await firestoreDb.collection("categories").doc(id).get();
                if (!categoryToUpdate.exists) {
                    return res.status(404).json({ error: "Categoría no encontrada." });
                }

                // Construir el objeto de actualización
                const updatedData = {};
                if (categoryData.genreId) {
                    // Verificar si el género existe
                    const genreDoc = await firestoreDb.collection("genres").doc(categoryData.genreId).get();
                    if (!genreDoc.exists) {
                        return res.status(400).json({ error: "El género especificado no existe." });
                    }
                    updatedData.genreId = categoryData.genreId;
                }
                if (categoryData.category) updatedData.category = categoryData.category;
                if (categoryData.subcategory) updatedData.subcategory = categoryData.subcategory;
                if (categoryData.missionTemplates) updatedData.missionTemplates = categoryData.missionTemplates;

                await firestoreDb.collection("categories").doc(id).update(updatedData);
                return res.json({ message: "Categoría actualizada exitosamente." });

            case "D": // Desactivar una categoría
                if (!id) {
                    return res
                        .status(400)
                        .json({
                            error: "El ID de la categoría es obligatorio para desactivar.",
                        });
                }

                const categoryToDeactivate = await firestoreDb.collection("categories").doc(id).get();
                if (!categoryToDeactivate.exists) {
                    return res.status(404).json({ error: "Categoría no encontrada." });
                }

                // Desactivar la categoría (lógica de eliminación)
                await firestoreDb.collection("categories").doc(id).update({ isActive: false });
                return res.json({ message: "Categoría desactivada exitosamente." });

            case "G": // Obtener todas las categorías
                const snapshot = await firestoreDb
                    .collection("categories")
                    .where("isActive", "==", true) // Filtrar categorías activas
                    .get();

                const categories = [];
                snapshot.forEach((doc) => {
                    categories.push({ id: doc.id, ...doc.data() });
                });

                return res.json(categories);

            default:
                return res
                    .status(400)
                    .json({ error: 'Acción no válida. Usa "C", "U", "D" o "G".' });
        }
    } catch (error) {
        console.error("Error al gestionar la categoría:", error);
        return res.status(500).json({ error: "Error al gestionar la categoría." });
    }
};

/**
 * Obtener todos los géneros disponibles para ser usados al crear/editar categorías.
 */
exports.getGenresForCategories = async (req, res) => {
    try {
        const snapshot = await firestoreDb.collection("genres").where("isActive", "==", true).get();
        const genres = [];
        snapshot.forEach(doc => {
            genres.push({ id: doc.id, ...doc.data() });
        });
        return res.json(genres);
    } catch (error) {
        console.error("Error al obtener los géneros:", error);
        return res.status(500).json({ error: "Error al obtener los géneros." });
    }
};