const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
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
  shop_type: {
    type: String,
    required: true,
    enum: ['Grocery', 'Fish', 'Meat', 'Vegetable', 'Fruit'],
  },
  bankAccountNumber: {
    type: Number,
    required: true,
  },
  shop_image: {
    type: String, // Assuming you store the image path or URL
    required: true,
  },
  rating: {
    type: Number,
    default: 0.0, // Default rating is 0
  },
  ratingTotalValue: {
    type: Number,
    default: 0, // Default rating is 0
  },
  orders: {
    type: Number,
    default: 0, // Default number of orders is 0
  },
  ratedOrders: {
    type: Number,
    default: 0, // Default number of orders is 0
  },
  offer: {
    type: Number,
    default: 0, // Default number of orders is 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const shopModel = mongoose.model('shops', shopSchema);

module.exports = shopModel;
