const mongoose = require('mongoose');

const bankSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      contactNo: {
        type: String,
        required: true,
      },

      bankAccountNumber: {
        type: Number,
        required: true,
        unique: true,
      },
      
      bankAccountBalance: {
        type: Number,
        required: true,
      },
  
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

const bankAccountModel = mongoose.model('bank_accounts',bankSchema); 

module.exports = bankAccountModel;