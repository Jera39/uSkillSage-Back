const { firestoreDb } = require('../config/db');

/**
 * Método genérico para gestionar géneros narrativos.
 * @param {string} action - Acción a realizar ('C': Crear, 'U': Actualizar, 'D': Desactivar, 'G': Obtener)
 * @param {string} id - ID del género (requerido para 'U' y 'D')
 * @param {object} genreData - Datos del género (requerido para 'C' y 'U')
 */
exports.manageGenres = async (req, res) => {
    try {
        const { action } = req.query; // Acción a realizar ('C', 'U', 'D', 'G')
        const { id } = req.params; // ID del género (necesario para 'U' y 'D')
        const genreData = req.body; // Datos del género (necesarios para 'C' y 'U')

        switch (action.toUpperCase()) {
            case 'C': // Crear un género
                // Validar que se proporcionen todos los campos obligatorios
                if (!genreData.name || !genreData.image || !genreData.welcomeMessageMale || !genreData.welcomeMessageFemale) {
                    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
                }

                // Verificar si el género narrativo ya existe
                const genreSnapshot = await firestoreDb.collection('genres')
                    .where('name', '==', genreData.name)
                    .get();

                if (!genreSnapshot.empty) {
                    return res.status(400).json({ error: 'El género narrativo ya existe.' });
                }

                // Crear el nuevo género narrativo
                const newGenre = {
                    name: genreData.name,
                    image: genreData.image,
                    welcomeMessageMale: genreData.welcomeMessageMale,
                    welcomeMessageFemale: genreData.welcomeMessageFemale,
                    isActive: true, // Por defecto, el género está activo
                    createdAt: new Date(),
                };

                const genreRef = await firestoreDb.collection('genres').add(newGenre);
                return res.status(201).json({ message: 'Género narrativo creado exitosamente.', id: genreRef.id });

            case 'U': // Actualizar un género
                if (!id) {
                    return res.status(400).json({ error: 'El ID del género es obligatorio para actualizar.' });
                }

                const genreDoc = await firestoreDb.collection('genres').doc(id).get();
                if (!genreDoc.exists) {
                    return res.status(404).json({ error: 'Género narrativo no encontrado.' });
                }

                // Construir el objeto de actualización
                const updatedData = {};
                if (genreData.name) updatedData.name = genreData.name;
                if (genreData.image) updatedData.image = genreData.image;
                if (genreData.welcomeMessageMale) updatedData.welcomeMessageMale = genreData.welcomeMessageMale;
                if (genreData.welcomeMessageFemale) updatedData.welcomeMessageFemale = genreData.welcomeMessageFemale;

                await firestoreDb.collection('genres').doc(id).update(updatedData);
                return res.json({ message: 'Género narrativo actualizado exitosamente.' });

            case 'D': // Desactivar un género
                if (!id) {
                    return res.status(400).json({ error: 'El ID del género es obligatorio para desactivar.' });
                }

                const genreToDelete = await firestoreDb.collection('genres').doc(id).get();
                if (!genreToDelete.exists) {
                    return res.status(404).json({ error: 'Género narrativo no encontrado.' });
                }

                // Desactivar el género (lógica de eliminación)
                await firestoreDb.collection('genres').doc(id).update({ isActive: false });
                return res.json({ message: 'Género narrativo desactivado exitosamente.' });

            case 'G': // Obtener todos los géneros
                const snapshot = await firestoreDb.collection('genres')
                    .where('isActive', '==', true) // Filtrar géneros activos
                    .get();

                const genres = [];
                snapshot.forEach(doc => {
                    genres.push({ id: doc.id, ...doc.data() });
                });

                return res.json(genres);

            default:
                return res.status(400).json({ error: 'Acción no válida. Usa "C", "U", "D" o "G".' });
        }
    } catch (error) {
        console.error('Error al gestionar el género narrativo:', error);
        return res.status(500).json({ error: 'Error al gestionar el género narrativo.' });
    }
};