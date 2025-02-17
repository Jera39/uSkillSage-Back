require('dotenv').config();
const nodemailer = require('nodemailer');
// const credentials = require('../.env')

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


// Función para enviar un correo electrónico
const sendEmail = async (to, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent // Usar HTML en lugar de texto plano
        };

        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado a ${to}: ${subject}`);
    } catch (error) {
        console.log('Correo:', process.env.EMAIL_USER);
        console.log('Contraseña:', process.env.EMAIL_PASS);
        console.error('Error al enviar el correo:', error);
        throw new Error('No se pudo enviar el correo', 'Correo:', process.env.EMAIL_USER, 'Contraseña:', process.env.EMAIL_PASS);

    }
};
module.exports = { sendEmail };