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
                // Validar que se proporcionen los campos obligatorios
                if (!categoryData.name || !categoryData.description) {
                    return res
                        .status(400)
                        .json({ error: "El nombre y la descripción son campos obligatorios." });
                }

                // Verificar si la categoría ya existe
                const categorySnapshot = await firestoreDb
                    .collection("categories")
                    .where("name", "==", categoryData.name)
                    .get();

                if (!categorySnapshot.empty) {
                    return res.status(400).json({ error: "La categoría ya existe." });
                }

                // Crear la nueva categoría
                const newCategory = {
                    name: categoryData.name,
                    description: categoryData.description,
                    subcategories: categoryData.subcategories || [], // Subcategorías opcionales
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

                    case "U": // Editar una categoría
                    if (!id) {
                      return res.status(400).json({ error: "El ID de la categoría es obligatorio para editar." });
                    }
                  
                    const categoryToUpdate = await firestoreDb.collection("categories").doc(id).get();
                    if (!categoryToUpdate.exists) {
                      return res.status(404).json({ error: "Categoría no encontrada." });
                    }
                  
                    // Obtener las subcategorías actuales
                    let subcategories = categoryToUpdate.data().subcategories || [];
                  
                    // Caso 1: Agregar una nueva subcategoría
                    if (categoryData.subcategory) {
                      const newSubcategory = {
                        id: Date.now().toString(), // Generar un ID único para la subcategoría
                        name: categoryData.subcategory.name,
                        description: categoryData.subcategory.description,
                        isActive: true,
                        createdAt: new Date(),
                      };
                  
                      subcategories.push(newSubcategory);
                    }
                  
                    // Caso 2: Actualizar la lista completa de subcategorías
                    if (categoryData.subcategories && Array.isArray(categoryData.subcategories)) {
                      subcategories = categoryData.subcategories;
                    }
                  
                    // Verificar que subcategories sea un array válido
                    if (!Array.isArray(subcategories)) {
                      return res.status(400).json({ error: "Las subcategorías deben ser un array." });
                    }
                  
                    // Actualizar la categoría con la nueva lista de subcategorías
                    await firestoreDb.collection("categories").doc(id).update({
                      subcategories: subcategories,
                    });
                  
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