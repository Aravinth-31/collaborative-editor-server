const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  content: String,
  title: String,
  createdAt: String,
  updatedAt: String
});

module.exports = mongoose.model('Documents', DocumentSchema);
