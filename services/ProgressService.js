const calculateGlobalProgress = (user) => {
    const totalMissions = user.missions.length;
    const completedMissions = user.missions.filter(mission => mission.completed).length;
    return (completedMissions / totalMissions) * 100;
};

module.exports = { calculateGlobalProgress };