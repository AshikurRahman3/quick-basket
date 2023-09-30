const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
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
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
    enum: ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Comilla', 'Rangpur', 'Barishal', 'Narayanganj', 'Gazipur'],
  },
  
  bankAccountNumber: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const customerModel = mongoose.model('customers', customerSchema);

module.exports = customerModel;
