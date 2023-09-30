// shop.controller.js
const shopModel = require('../models/shop.model');
const catagoryModel = require('../models/catagory.model')
const productModel = require('../models/product.model')
const orderModel = require('../models/order.model')
const bankModel = require('../models/bank.model')
const multer = require('multer');
const path = require('path');
const customerModel = require('../models/customer.model');

let errorMessage = '';

exports.shopLoginPage = (req, res) => {
  res.render('shop.login.ejs', { errorMessage: errorMessage });
};

exports.shopRegisterPage = (req, res) => {
  res.render('shop.register.ejs', { errorMessage: errorMessage });
};

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine the destination folder based on the fieldname
    // let destinationFolder = 'uploads/default/';

    // if (file.fieldname === 'shop_image') {
    //   destinationFolder = 'uploads/shopPhotos/';
    // } else if (file.fieldname === 'other_image') {
    //   destinationFolder = 'uploads/otherPhotos/';
    // }

    let destinationFolder = 'uploads/shopPhotos/';

    cb(null, destinationFolder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

exports.upload = multer({ storage: storage });

// Define a function for shop registration
exports.shopRegister = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      contactNo,
      address,
      city,
      shop_type,
      bankAccountNumber,
      rating,
      orders,
    } = req.body;

    // Check if a shop with the same email already exists
    const existingShop = await shopModel.findOne({ email });

    if (existingShop) {
      errorMessage = 'Shop with this email already exists';
      res.redirect('/api/shop/register');
      return;
    }

    const shop = new shopModel({
      name,
      email,
      password,
      contactNo,
      address,
      city,
      shop_type,
      bankAccountNumber,
      shop_image: path.join('uploads/shopPhotos/', req.file.filename), // Save the image path
      rating,
      orders,
    });

    await shop.save();
    errorMessage = '.';

    req.session.shopId = shop._id;
    console.log('logged in shopId: '+ req.session.shopId);
    res.redirect('/api/shop/home');


  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




exports.shopLogin = async (req, res) => {
   
    try {
        const { email, password } = req.body;
        const shop = await shopModel.findOne({ email : email});
    
        if (!shop) {
          errorMessage = 'shop not found';
          res.redirect('/api/shop/login');
        }
    
       else if (shop.password !== password) {
          
        errorMessage = 'incorrect password';
        res.redirect('/api/shop/login');
    
        
      }
      else
      {
        errorMessage = 'login success';
        req.session.shopId = shop._id;
        console.log('logged in shopId: '+ req.session.shopId);
        errorMessage = '.';
          res.redirect('/api/shop/home');
      }
     } catch (error) {
        res.status(500).json(error.message);
      }
  };


  exports.shopHomepage = async (req, res) => {
    try {
      const shopId = req.session.shopId;
      const shop = await shopModel.findOne({ _id: shopId });
  
      // Check if shop is found before accessing its properties
      if (!shop) {
        return res.status(404).send({ message: 'Shop not found' });
      }
  
      const shopType = shop.shop_type;
  
      // Query categories where shop_type matches the shop's shop_type or is equal to shopId
      const catagories = await catagoryModel.find({
        $or: [
          { shop_type: shopType },
          { shop_type: shopId }, // shop_type can be an ObjectId of the shop
        ],
      });
  
      // Query products where shopId matches the shop's _id
      const products = await productModel.find({ shopId: shop._id, deleted: false });
  
      res.render('shop.home.ejs', { shop: shop, catagories: catagories, products: products });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };


  exports.shopAddProductPage = async (req, res) => {


    const shopId = req.session.shopId;
      const shop = await shopModel.findOne({ _id: shopId });
  
      // Check if shop is found before accessing its properties
      if (!shop) {
        return res.status(404).send({ message: 'Shop not found' });
      }
  
      const shopType = shop.shop_type;
  
      // Query categories where shop_type matches the shop's shop_type or is equal to shopId
      const catagories = await catagoryModel.find({
        $or: [
          { shop_type: shopType },
          { shop_type: shopId }, // shop_type can be an ObjectId of the shop
        ],
      });


    res.render('shop.add-product.ejs', { errorMessage: errorMessage,catagories: catagories,shop:shop });
  };





  // Handle the POST request to add a product
exports.shopAddProduct = async (req, res) => {
    try {
      // Retrieve form data from request body
      const { name, price, description, stock, category, discount, discount_type } = req.body;
  
      // Construct the product object
      const product = new productModel({
        name,
        price,
        description,
        stock,
        category,
        shopId: req.session.shopId, // Get shopId from session
        discount,
        deleted: false,
        discount_type,
        product_image: path.join('uploads/shopPhotos/', req.file.filename), // Save the image path
        // product_image: req.file.filename, // Save the uploaded file name
      });




      
  
      // Save the product to the database
      await product.save();
  
      // Redirect to a success page or return a JSON response
    //   res.status(201).json({ message: 'Product added successfully' });
    res.redirect('/api/shop/home');
    } catch (error) {
      console.error('Error adding product:', error.message);
      res.status(500).json({ message: error.message });
    }
  };


  exports.shopOrdersPage = async (req, res) => {

    try {
      // Get the customerId from the session (assuming it's stored in req.session.customerId)
     const shopId = req.session.shopId;
    if(shopId){
      const shop = await shopModel.findOne({ _id: shopId });

      // Fetch orders for the specific customer, populating the related shop
      const orders = await orderModel
          .find({ shopId })
          .populate({
              path: 'customerId',
              model: 'customers', // Replace with the actual name of your Shop model
              select: 'name contactNo address city', // Select only the 'shopName' field
          })
          .sort({ createdAt: -1 }); // Sort by createdAt field in descending order
 
      // Fetch product details for each product in the orders
      for (const order of orders) {
          const productDetails = await Promise.all(
              order.products.map(async (product) => {
                  const productInfo = await productModel.findById(product.productId);
                  
                  return {
                      name: productInfo.name,
                      price: productInfo.price,
                      product_image: productInfo.product_image,
                      description: productInfo.description,
                      quantity: product.quantity,
                      productTotalPrice: product.productTotalPrice,
                  };
              })
          );
         
          order.products = productDetails;
          
      }
      
 
 
     res.render('shop.orders.ejs',{errorMessage: errorMessage,orders: orders,shop: shop});
    }
  else{
    res.redirect('/api/shop/login');
  }
    } catch (error) {
      res.send({message: error.message})
    }
    
  };
  



  exports.shopOrderAccept = async (req,res)=>{
    const orderId = req.body.orderId;
    const order = await orderModel.findOne({_id: orderId});
    const customerId = order.customerId;
    const shopId = order.shopId;


    const customer = await customerModel.findOne({_id : customerId});
    const shop = await shopModel.findOne({_id : shopId});

    const customerBankAccountNumber = customer.bankAccountNumber;
    const shopBankAccountNumber = shop.bankAccountNumber;

    const ecommerceBankAccount = await bankModel.findOne({bankAccountNumber : 111111});
   
    const customerBankAccount = await bankModel.findOne({bankAccountNumber : customerBankAccountNumber});
    const shopBankAccount = await bankModel.findOne({bankAccountNumber : shopBankAccountNumber});
    

    order.status = 'accepted';
    await order.save();


    let ecommerceBalance = Number(ecommerceBankAccount.bankAccountBalance);
      let customerBalance = Number(customerBankAccount.bankAccountBalance);
      let shopBalance = Number(shopBankAccount.bankAccountBalance);

      let paymentValue = Number(order.totalAmount);

      ecommerceBalance -= Number(paymentValue);
      shopBalance += Number(paymentValue);
   
    shopBankAccount.bankAccountBalance = shopBalance;
    ecommerceBankAccount.bankAccountBalance = ecommerceBalance;
    

    await shopBankAccount.save();
    await ecommerceBankAccount.save();


    res.redirect('/api/shop/orders');

  };


  exports.shopOrderReject = async (req,res)=>{
    const orderId = req.body.orderId;
    const order = await orderModel.findOne({_id: orderId});


    const customerId = order.customerId;
    const shopId = order.shopId;


    const customer = await customerModel.findOne({_id : customerId});
    const shop = await shopModel.findOne({_id : shopId});

    const customerBankAccountNumber = customer.bankAccountNumber;

    const ecommerceBankAccount = await bankModel.findOne({bankAccountNumber : 111111});
   
    const customerBankAccount = await bankModel.findOne({bankAccountNumber : customerBankAccountNumber});
    
    

  

    order.status = 'rejected';
    await order.save();

    let ecommerceBalance = Number(ecommerceBankAccount.bankAccountBalance);
      let customerBalance = Number(customerBankAccount.bankAccountBalance);
      

      let paymentValue = Number(order.totalAmount);

      ecommerceBalance -= Number(paymentValue);
      customerBalance += Number(paymentValue);
   
    customerBankAccount.bankAccountBalance = customerBalance;
    ecommerceBankAccount.bankAccountBalance = ecommerceBalance;
    

    await customerBankAccount.save();
    await ecommerceBankAccount.save();

    res.redirect('/api/shop/orders');
  };


  exports.shopOrderSupplied = async (req,res)=>{
    const orderId = req.body.orderId;
    const order = await orderModel.findOne({_id: orderId});
    const shopId = order.shopId;
    const shop = await shopModel.findOne({_id: shopId});
    let shopOrders = Number(shop.orders);
    shopOrders += 1;
    shop.orders = shopOrders;

    

    order.status = 'supplied';
    await order.save();

    await shop.save();
    

    res.redirect('/api/shop/orders');
  };




  exports.shopAddCategoryPage = async (req, res) => {


    const shopId = req.session.shopId;
      const shop = await shopModel.findOne({ _id: shopId });
  
      // Check if shop is found before accessing its properties
      if (!shop) {
        return res.status(404).send({ message: 'Shop not found' });
      }
  
      const shopType = shop.shop_type;
  
      // Query categories where shop_type matches the shop's shop_type or is equal to shopId
      const catagories = await catagoryModel.find({
        $or: [
          { shop_type: shopType },
          { shop_type: shopId }, // shop_type can be an ObjectId of the shop
        ],
      });


    res.render('shop.add.category.ejs', { errorMessage: errorMessage,catagories: catagories,shop:shop });
  };





  exports.shopAddCategory = async (req, res) => {
    try {
      // Retrieve form data from request body
      const  name  = req.body.name;
      
  
      // Construct the product object
      const category = new catagoryModel({
        name: name,
        shop_type: req.session.shopId, // Get shopId from session
      });

      // Save the category to the database
      await category.save();

    res.redirect('/api/shop/home');
    } catch (error) {
      console.error('Error adding product:', error.message);
      res.status(500).json({ message: error.message });
    }
  };


  exports.shopDeleteProduct = async (req, res) => {
    const productId = req.params.productId;

    try {
      // Find and delete the product by ID, actually setting as deleted, not actual delete for avoiding error
      
      const updatedProduct = await productModel.findByIdAndUpdate(productId, { deleted: true });

      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.redirect('/api/shop/home');
    } catch (error) {
      console.error('Error deleting product:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };


  exports.shopEditProductPage = async (req, res) => {
    

    try {
      const productId = req.body.productId;
      req.session.editProductId = productId;
      // Find and delete the product by ID, actually setting as deleted, not actual delete for avoiding error
      
      const product = await productModel.findOne({_id: productId});

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      const shopId = req.session.shopId;
      const shop = await shopModel.findOne({ _id: shopId });
  
      // Check if shop is found before accessing its properties
      if (!shop) {
        return res.status(404).send({ message: 'Shop not found' });
      }
  
      const shopType = shop.shop_type;
  
      // Query categories where shop_type matches the shop's shop_type or is equal to shopId
      const catagories = await catagoryModel.find({
        $or: [
          { shop_type: shopType },
          { shop_type: shopId }, // shop_type can be an ObjectId of the shop
        ],
      });




    res.render('shop.edit.product.ejs', { errorMessage: errorMessage,catagories: catagories,shop:shop,product: product });
    } catch (error) {
      console.error('Error updating product:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };





  exports.shopEditProduct = async (req, res) => {
    try {
      // Retrieve form data from request body
      
  
     
      const { name, price, description, stock, category, discount, discount_type } = req.body;
const editProductId = req.session.editProductId; // Get the product ID to edit from the session

// Create an object with the updated product data
// Create an object with the updated product data
const product = {
  name,
  price,
  description,
  stock,
  category,
  discount,
  discount_type,
  product_image: path.join('uploads/shopPhotos/', req.file.filename), // Save the image path
};

// Find and update the product by ID using async/await
const updatedProduct = await productModel.findByIdAndUpdate(editProductId, product, { new: true });

if (!updatedProduct) {
  return res.status(404).json({ message: 'Product not found' });
}
    res.redirect('/api/shop/home');
    } catch (error) {
      console.error('Error updating product:', error.message);
      res.status(500).json({ message: error.message });
    }
  };



  exports.shopChangeOfferPage = async (req, res) => {
    try {
      const shopId = req.session.shopId;
    const shop = await shopModel.findOne({_id: shopId});
    const offer = Number(shop.offer);
    res.render('shop.change.offer.ejs', { errorMessage: errorMessage,shop: shop });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.shopChangeOffer = async (req, res) => {
    try {
      const shopId = req.session.shopId;
    const shop = await shopModel.findOne({_id: shopId});
    const offer = Number(req.body.offer);
    shop.offer = offer;
    await shop.save();
    res.redirect('/api/shop/home');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  exports.shopEditProfilePage = async (req, res) => {
    try {
      const shopId = req.session.shopId;
      if(shopId)
      {
        const shop = await shopModel.findOne({_id: shopId});
        res.render('shop.edit.profile.ejs',{shop: shop});


      } else {
        res.redirect('/api/shop/login');
      }
    } catch (error) {
      res.send({message: error.message});
    }
   
  };





  // Define a function for shop registration
exports.shopEditProfile = async (req, res) => {
  try {
    const shopId = req.session.shopId;

    if(shopId){
      const {
        name,
        email,
        password,
        contactNo,
        address,
        city,
        shop_type,
        bankAccountNumber,
        rating,
        orders,
      } = req.body;
  
      
  
      const shop = {
        name,
        email,
        password,
        contactNo,
        address,
        city,
        shop_type,
        bankAccountNumber,
        shop_image: path.join('uploads/shopPhotos/', req.file.filename), // Save the image path
        rating,
        orders,
      };
  
      const updatedProfile = await shopModel.findByIdAndUpdate(shopId, shop, { new: true });
      if (!updatedProfile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.redirect('/api/shop/home');
    } else {
      res.redirect('/api/shop/home');
    }


  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};