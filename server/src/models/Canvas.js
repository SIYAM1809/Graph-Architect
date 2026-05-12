const mongoose = require('mongoose');

const canvasSchema = new mongoose.Schema({
  canvasId: {
    type: String,
    required: true,
    unique: true,
  },
  revision: {
    type: Number,
    default: 0,
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
