const mongoose = require('mongoose');

// Define Product Schema
const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      Default: false,
    },
    price: {
      type: Number,
      required: true,
    },
    product_image: {
      type: String, // Assuming you store the image path or URL
      required: true,
    },
    description: String,
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'catagories',
      required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      // If you want to reference a "Shop" collection, you can specify it here
      ref: 'shops',
    },
    discount: {
      type: Number,
      required: true,
    },
    discount_type: {
      type: String,
      enum: ['amount', 'percentage'],
      required: true,
    },
    createdOn: {
      type: Date,
      default: Date.now,
    },
  });

  const productModel = mongoose.model('products', productSchema);

module.exports = productModel;