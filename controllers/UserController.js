const { firestoreDb } = require('../config/db');
const bcrypt = require('bcrypt');
const validator = require('validator');

// Crear un usuario en Firestore
exports.createUser = async (req, res) => {
    try {
        const { heroName, email, genre, password } = req.body;

        // Validar el correo electrónico
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'El correo electrónico no es válido' });
        }

        // Verificar si el heroName o el correo ya existen
        const heroNameSnapshot = await firestoreDb.collection('users')
            .where('heroName', '==', heroName)
            .get();

        const emailSnapshot = await firestoreDb.collection('users')
            .where('email', '==', email)
            .get();

        if (!heroNameSnapshot.empty) {
            return res.status(400).json({ error: 'El nombre del héroe ya está en uso' });
        }

        if (!emailSnapshot.empty) {
            return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
        }

        // Cifrar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            heroName,
            email,
            genre,
            password: hashedPassword, // Guardar la contraseña cifrada
            level: 1,
            experience: 0,
            skills: [],
            createdAt: new Date()
        };

        const userRef = await firestoreDb.collection('users').add(newUser);
        res.status(201).json({ message: 'Usuario creado', id: userRef.id });
    } catch (error) {
        console.error('Error detallado:', error); 
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
};

// Login de usuario
exports.loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // Validar campos vacíos
        if (!identifier || !password) {
            return res.status(400).json({ error: 'Por favor, completa todos los campos.' });
        }

        let user = null;

        // Consulta 1: Buscar por heroName
        const heroNameSnapshot = await firestoreDb.collection('users')
            .where('heroName', '==', identifier)
            .get();

        if (!heroNameSnapshot.empty) {
            heroNameSnapshot.forEach(doc => {
                user = { id: doc.id, ...doc.data() };
            });
        }

        // Si no se encontró un usuario por heroName, buscar por email
        if (!user) {
            const emailSnapshot = await firestoreDb.collection('users')
                .where('email', '==', identifier)
                .get();

            if (!emailSnapshot.empty) {
                emailSnapshot.forEach(doc => {
                    user = { id: doc.id, ...doc.data() };
                });
            }
        }

        // Si no se encuentra ningún usuario, devolver un error
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado. Verifica tu nombre de héroe o correo electrónico.' });
        }

        // Comparar la contraseña cifrada
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta. Por favor, inténtalo de nuevo.' });
        }

        // Si todo es correcto, devolver los datos del usuario
        res.json({ message: 'Inicio de sesión exitoso', user });
    } catch (error) {
        console.error('Error detallado:', error);
        res.status(500).json({ error: 'Error al iniciar sesión. Por favor, intenta más tarde.' });
    }
};
// Obtener todos los usuarios de Firestore
exports.getUsers = async (req, res) => {
    try {
        const snapshot = await firestoreDb.collection('users').get();
        const users = [];
        snapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};