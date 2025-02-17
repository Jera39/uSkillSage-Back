const { firestoreDb } = require('../config/db');
const bcrypt = require('bcrypt');
const validator = require('validator');

const { sendEmail } = require('../services/NotificationService');

// Función para generar mensajes de bienvenida personalizados
const getWelcomeMessage = (heroName, genre, gender) => {
    const greetings = {
        Masculino: {
            Fantasía: `¡Bienvenido, valiente ${heroName}!`,
            'Ciencia Ficción': `¡Saludos, explorador ${heroName}!`,
            Mitología: `¡Bienvenido, héroe legendario ${heroName}!`
        },
        Femenino: {
            Fantasía: `¡Bienvenida, valiente ${heroName}!`,
            'Ciencia Ficción': `¡Saludos, exploradora ${heroName}!`,
            Mitología: `¡Bienvenida, heroína legendaria ${heroName}!`
        }
    };
    return greetings[gender][genre];
};

// Función para obtener la imagen de fondo según el género narrativo
const getBackgroundImage = (genre) => {
    switch (genre) {
        case 'Fantasía':
            return 'https://i.postimg.cc/NfNjH6Jh/fantasy-6835790.jpg';
        case 'Ciencia Ficción':
            return 'https://i.postimg.cc/90CQGJH2/ai-generated-8548276.jpg';
        case 'Mitología':
            return 'https://i.postimg.cc/8km51QLz/dragon-9017341-1920.png';
        default:
            return 'https://i.postimg.cc/NfNjH6Jh/fantasy-6835790.jpg'; // Imagen predeterminada
    }
};


// Crear un usuario en Firestore
exports.createUser = async (req, res) => {
    try {
        const { heroName, email, genre, gender, password } = req.body;
        const normalizedEmail = email.trim().toLowerCase();

        // Validar que se proporcione el género sexual
        if (!gender || !['Masculino', 'Femenino'].includes(gender)) {
            return res.status(400).json({ error: 'El género es obligatorio y debe ser "Masculino" o "Femenino"' });
        }

        // Validar el nombre del héroe
        if (!heroName || heroName.length < 3) {
            return res.status(400).json({ error: 'El nombre del héroe es obligatorio y debe tener al menos 3 caracteres' });
        }

        // Validar el género narrativo
        if (!['Fantasía', 'Ciencia Ficción', 'Mitología'].includes(genre)) {
            return res.status(400).json({ error: 'El género narrativo es obligatorio y debe ser "Fantasía", "Ciencia Ficción" o "Mitología"' });
        }

        // Validar la contraseña
        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'La contraseña es obligatoria y debe tener al menos 6 caracteres' });
        }


        // Validar el correo electrónico
        if (!validator.isEmail(normalizedEmail)) {
            return res.status(400).json({ error: 'El correo electrónico no es válido' });
        }

        // Verificar si el heroName o el correo ya existen
        const heroNameSnapshot = await firestoreDb.collection('users')
            .where('heroName', '==', heroName)
            .get();

        const emailSnapshot = await firestoreDb.collection('users')
            .where('email', '==', normalizedEmail)
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
            email: normalizedEmail,
            genre,
            gender,
            password: hashedPassword, // Guardar la contraseña cifrada
            level: 1,
            experience: 0,
            skills: [],
            createdAt: new Date()
        };

        const userRef = await firestoreDb.collection('users').add(newUser);

        // Generar mensaje de bienvenida personalizado
        const welcomeMessage = getWelcomeMessage(heroName, genre, gender);
        const backgroundImage = getBackgroundImage(genre);

        // Construir el contenido HTML dinámico
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bienvenido a uSkilSage</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: Arial, sans-serif;
                        background-color: #000;
                        color: #fff;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-image: url('${backgroundImage}');
                        background-size: cover;
                        background-position: center;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
                    }
                    .card {
                        background-color: rgba(0, 0, 0, 0.7);
                        padding: 20px;
                        border-radius: 8px;
                        color: #fff;
                    }
                    h1 {
                        font-size: 24px;
                        margin-bottom: 10px;
                    }
                    p {
                        font-size: 16px;
                        line-height: 1.5;
                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 14px;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="card">
                        <h1>¡Hola, ${heroName}!</h1>
                        <p>${welcomeMessage}</p>
                        <p>Felicidades por crear tu cuenta en uSkilSage. Tu aventura comienza ahora.</p>
                        <p class="footer">Atentamente,<br>El equipo de uSkilSage</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Enviar correo de bienvenida
        try {
            const subject = '¡Bienvenido a uSkilSage!';
            await sendEmail(email, subject, htmlContent);
            console.log(`Correo enviado a ${email}: ${subject}`);
        } catch (emailError) {
            console.error('Error al enviar el correo de bienvenida:', emailError);
            return res.status(500).json({ error: 'Error al enviar el correo de bienvenida' });
        }


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

        // Normalizar el identificador
        const normalizedIdentifier = identifier.includes('@')
            ? identifier.trim().toLowerCase()
            : identifier;

        // Buscar usuario por heroName o email
        const findUserByField = async (field, value) => {
            const snapshot = await firestoreDb.collection('users')
                .where(field, '==', value)
                .get();
            if (!snapshot.empty) {
                return snapshot.docs[0].data();
            }
            return null;
        };

        let user = await findUserByField('heroName', identifier);
        if (!user) {
            user = await findUserByField('email', normalizedIdentifier);
        }

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado. Verifica tu nombre de héroe o correo electrónico.' });
        }

        // Comparar la contraseña cifrada
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta. Por favor, inténtalo de nuevo.' });
        }

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

// Función para probar el envío de correos
exports.testEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'El correo electrónico es obligatorio' });
        }

        const subject = 'Prueba de Correo';
        const htmlContent = `
        <h1>¡Hola!</h1>
        <p>Este es un mensaje de prueba enviado desde uSkilSage.</p>`;

        await sendEmail(email, subject, htmlContent);
        res.json({ message: 'Correo de prueba enviado correctamente' });
    } catch (error) {
        console.error('Error al enviar el correo de prueba:', error);
        res.status(500).json({ error: 'Error al enviar el correo de prueba' });
    }
};