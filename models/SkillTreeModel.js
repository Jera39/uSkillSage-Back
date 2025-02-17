const mongoose = require('mongoose');

const skillTreeNodeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nodeId: { type: String, required: true }, // ID del nodo en el árbol
    unlockedAt: { type: Date, default: Date.now }
});

const SkillTreeNode = mongoose.model('SkillTreeNode', skillTreeNodeSchema);
module.exports = SkillTreeNode;