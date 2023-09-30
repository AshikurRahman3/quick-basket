const mongoose = require('mongoose');

// Define Category Schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  shop_type: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

const catagoryModel = mongoose.model('catagories', categorySchema);

module.exports = catagoryModel;