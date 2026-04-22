const mongoose = require('mongoose');

const canvasSchema = new mongoose.Schema({
  canvasId: {
    type: String,
    required: true,
    unique: true,
  },
  nodes: {
    type: Array,
    default: [],
  },
  edges: {
    type: Array,
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model('Canvas', canvasSchema);
