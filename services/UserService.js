const calculateUserLevel = (experience) => {
    // Lógica para calcular el nivel basado en la experiencia
    return Math.floor(experience / 100) + 1;
};

module.exports = { calculateUserLevel };