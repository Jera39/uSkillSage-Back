const generateMissionDescription = (mission, genre, gender) => {
    const { fantasy, sciFi, mythology } = mission.description;
    const genderSpecificDescriptions = mission.genderSpecificDescriptions[gender.toLowerCase()];

    switch (genre) {
        case 'Fantasía':
            return genderSpecificDescriptions.fantasy || fantasy;
        case 'Ciencia Ficción':
            return genderSpecificDescriptions.sciFi || sciFi;
        case 'Mitología':
            return genderSpecificDescriptions.mythology || mythology;
        default:
            return fantasy; // Valor predeterminado
    }
};

module.exports = { generateMissionDescription };