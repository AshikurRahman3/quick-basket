const mongoose = require('mongoose');

// Define the schema for the products within the order
const productSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'products' }, // Assuming you have a 'Product' model
    quantity: { type: Number, required: true },
    productTotalPrice: { type: Number, required: true },
    name: String,
    price: Number,
    product_image: String,
    description: String,
});

// Define the main order schema
const orderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'customers' }, // Assuming you have a 'Customer' model
    shopId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'shops' }, // Assuming you have a 'Shop' model
    totalAmount: { type: Number, required: true },
    status: { type: String, required: true },
    products: [productSchema], // An array of product objects
    rating: {
        type: Number,
        default: 0, // Default number of orders is 0
      },
      review: String,
    createdAt: {
        type: Date,
        default: Date.now,
      },
}, );

// Create the Order model
const orderModel = mongoose.model('orders', orderSchema);

module.exports = orderModel;
