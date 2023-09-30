// const { Category } = require('./models'); // Assuming your models are in a separate file
const catagoryModel = require('../models/catagory.model');

// Define the default categories
const defaultCategories = [
    { name: 'Fresh Water Fish', shop_type: 'Fish' },
    { name: 'Sea Fish', shop_type: 'Fish' },
    { name: 'Chicken', shop_type: 'Meat' },
    { name: 'Beef', shop_type: 'Meat' },
    { name: 'Mutton', shop_type: 'Meat' },
    { name: 'Duck', shop_type: 'Meat' },
    { name: 'Other Birds', shop_type: 'Meat' },
    { name: 'Local Fruits', shop_type: 'Fruit' },
    { name: 'Imported Fruits', shop_type: 'Fruit' },
    { name: 'Leafy Vegetables', shop_type: 'Vegetable' },
    { name: 'Fresh Vegetables', shop_type: 'Vegetable' },
    { name: 'Eggs', shop_type: 'Grocery' },
    { name: 'Dairy', shop_type: 'Grocery' },
    { name: 'Atta-Maida', shop_type: 'Grocery' },
    { name: 'Rice', shop_type: 'Grocery' },
    { name: 'Dal', shop_type: 'Grocery' },
    { name: 'Sugar', shop_type: 'Grocery' },
    { name: 'Salt', shop_type: 'Grocery' },
    { name: 'Spices', shop_type: 'Grocery' },
    { name: 'Biscuits', shop_type: 'Grocery' },
    { name: 'Tea', shop_type: 'Grocery' },
    { name: 'Coffee', shop_type: 'Grocery' },
    { name: 'Beverages', shop_type: 'Grocery' },
    { name: 'Frozen Snacks', shop_type: 'Grocery' },
    { name: 'Edible Oil', shop_type: 'Grocery' },
    { name: 'Ice Cream', shop_type: 'Grocery' },
    { name: 'Noodles', shop_type: 'Grocery' },
    { name: 'Soap', shop_type: 'Grocery' },
    { name: 'Detergent', shop_type: 'Grocery' },
    { name: 'Dishwasher', shop_type: 'Grocery' },
    { name: 'Handwash', shop_type: 'Grocery' },
    { name: 'Shampoo', shop_type: 'Grocery' },
    { name: 'Toothpaste', shop_type: 'Grocery' },
    { name: 'Face Wash', shop_type: 'Grocery' },
    { name: 'Cakes', shop_type: 'Grocery' },
    { name: 'Breads-Buns', shop_type: 'Grocery' },
    { name: 'Chocolates', shop_type: 'Grocery' },
    { name: 'Batteries', shop_type: 'Grocery' },
    { name: 'Other Snacks', shop_type: 'Grocery' },
    { name: 'Chips', shop_type: 'Grocery' },
  ];

const insertDefaultCategories = async () => {
  try {
    // Check if there are any categories already in the database
    const existingCategories = await catagoryModel.find();

    if (existingCategories.length === 0) {
      // If no categories found, insert default categories
      await catagoryModel.insertMany(defaultCategories);
      console.log('Default categories inserted successfully.');
    } else {
      console.log('Categories already exist, skipping insertion.');
    }
  } catch (error) {
    console.error('Error inserting default categories:', error.message);
  }
};

module.exports = { insertDefaultCategories };
