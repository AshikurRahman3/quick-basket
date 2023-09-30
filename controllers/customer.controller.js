const shopModel = require('../models/shop.model');
const catagoryModel = require('../models/catagory.model')
const productModel = require('../models/product.model');
const customerModel = require('../models/customer.model');
const orderModel = require('../models/order.model')

let errorMessage = '';
exports.customerLoginPage = (req,res)=>{
    res.render('customer.login.ejs',{errorMessage: errorMessage});
 };


exports.customerRegisterPage = (req,res)=>{
    res.render('customer.register.ejs',{errorMessage: errorMessage});
 };


 exports.customerRegister = async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        contactNo,
        address,
        city,
        bankAccountNumber,
      } = req.body;
  
      // Check if a shop with the same email already exists
      const existingCustomer = await customerModel.findOne({ email });
  
      if (existingCustomer) {
        errorMessage = 'Customer with this email already exists';
        res.redirect('/customer/register');
        return;
      }
  
      const customer = new customerModel({
        name,
        email,
        password,
        contactNo,
        address,
        city,
        bankAccountNumber,
      });
  
      await customer.save();
     
        req.session.customerId = customer._id;
        console.log('logged in customerId: '+ req.session.customerId);
        errorMessage = '.';
        res.redirect('/customer/home');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };



  exports.customerLogin = async (req, res) => {
   
    try {
        const { email, password } = req.body;
        const customer = await customerModel.findOne({ email : email});
    
        if (!customer) {
          errorMessage = 'customer not found';
          res.redirect('/customer/login');
        }
    
       else if (customer.password !== password) {
          
        errorMessage = 'incorrect password';
        res.redirect('/customer/login');
    
        
      }
      else
      {
        errorMessage = 'login success';
        req.session.customerId = customer._id;
        console.log('logged in customerId: '+ req.session.customerId);
        errorMessage = '.';
          res.redirect('/customer/home');
      }
     } catch (error) {
        res.status(500).json(error.message);
      }
  };


  exports.customerHomePage = async (req,res)=>{
    const shops = await shopModel.find();

    const customerId = req.session.customerId;
    const customer = await customerModel.findOne({ _id: customerId });
    const customerName = customer.name;
    res.render('customer.home.ejs',{shops : shops,customerName: customerName});
 };



 exports.customerShopDetailsPage = async(req,res)=>{
    try {
        const shopId = req.body.customer_shopId;
        const customerId = req.session.customerId;
      const shop = await shopModel.findOne({ _id: shopId });
      const customer = await customerModel.findOne({ _id: customerId });

      req.session.customerShopId = shopId;

      const customerName = customer.name;
  
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
      const products = await productModel.find({ shopId: shop._id,deleted: false });
  
      res.render('customer.shop_details.ejs', { shop: shop, catagories: catagories, products: products,customerName: customerName });
    } catch (error) {
        res.send({message: error.message});
    }
 };


 exports.customerCartPage = async (req,res)=>{
    const cartData = req.body.cart;

    // Ensure that cartData is an array (you may need to parse JSON data if it's a string)
    let cartItems = [];

    const customerId = req.session.customerId;
    const customer = await customerModel.findOne({ _id: customerId });
    const customerName = customer.name;

    try {
        cartItems = JSON.parse(cartData); // Parse the JSON data if it's a string
       
        
       
   
    } catch (err) {
        console.error('Error parsing cart data:', err.message);
    }

    // Create an array to store cart items with populated product details
    const populatedCart = [];

    // Populate product details for each item in the cart
    for (const item of cartItems) {
        try {
            const product = await productModel.findById(item.productId);

            if (product) {
                populatedCart.push({
                    product: product,
                    quantity: item.quantity
                });
            }
        } catch (err) {
            console.error('Error fetching product:', err.message);
        }
    }

    // Render the cart page with the populated cart data
    res.render('customer.cart.ejs', { cartData: populatedCart,customerName: customerName });
 };


 exports.customerOrdersPage = async (req,res)=>{

     try {
        // Get the customerId from the session (assuming it's stored in req.session.customerId)
     const customerId = req.session.customerId;

    const customer = await customerModel.findOne({ _id: customerId });
    const customerName = customer.name;

     // Fetch orders for the specific customer, populating the related shop
     const orders = await orderModel
     .find({ customerId })
     .populate({
       path: 'shopId',
       model: 'shops', // Replace with the actual name of your Shop model
       select: 'name city', // Select only the 'shopName' field
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
     


    res.render('customer.orders.ejs',{errorMessage: errorMessage,orders: orders,customerName: customerName});
     } catch (error) {
        res.send({message: error.message});
     }
 };


 exports.customerOrderRatingPage = async (req,res)=>{
  const orderId = req.body.orderId;
  const order = await orderModel.findOne({ _id: orderId });
  const shopId = order.shopId;
  req.session.shopId = shopId;
  req.session.orderId = orderId;
  
  res.render('customer.order.rating.ejs',{errorMessage: errorMessage});
};

exports.customerOrderRatingSubmit = async (req,res)=>{
  const rating = req.body.rating;
  const review = req.body.review;

  const shopId = req.session.shopId;
  const shop = await shopModel.findOne({_id: shopId});

  const orderId = req.session.orderId;
  const order = await orderModel.findOne({_id: orderId});

  let ratingTotalValue = Number(shop.ratingTotalValue);
  let ratedOrders = Number(shop.ratedOrders);
  let orders = Number(shop.orders);
  let shopRating = Number(shop.rating);

  ratingTotalValue += Number(rating);
  ratedOrders += 1;
  orders += 1;
  shopRating = ratingTotalValue / ratedOrders;
  const formattedShopRating = shopRating.toFixed(1);

  

  order.review = review;
  order.rating = Number(rating);
  await order.save();

  shop.ratedOrders = ratedOrders;
  shop.ratingTotalValue = ratingTotalValue;
  shop.rating = formattedShopRating;
  await shop.save();
  
  res.redirect('/customer/orders');
};


exports.customerShopReviewsPage = async (req,res)=>{
  

  const customerId = req.session.customerId;
  const customer = await customerModel.findOne({ _id: customerId });
    const customerName = customer.name;
  const customerShopId = req.session.customerShopId;
  const shop = await shopModel.findOne({ _id: customerShopId });

  // const orders = await orderModel.find({shopId: customerShopId});

   // Fetch orders for the specific customer, populating the related shop
   const orders = await orderModel
   .find({ shopId: customerShopId })
   .populate({
     path: 'customerId',
     model: 'customers', // Replace with the actual name of your Shop model
     select: 'name', // Select only the 'shopName' field
   })
   .sort({ createdAt: -1 }); // Sort by createdAt field in descending order

   // Fetch product details for each product in the orders
   for (const order of orders) {
       const productDetails = await Promise.all(
           order.products.map(async (product) => {
               const productInfo = await productModel.findById(product.productId);
               
               if(productInfo)
               {
                return {
                  name: productInfo.name,
                  price: productInfo.price,
                  product_image: productInfo.product_image,
                  description: productInfo.description,
                  quantity: product.quantity,
                  productTotalPrice: product.productTotalPrice,
              };
               }
           })
       );
       
       order.products = productDetails;
       
   }
   
  
  res.render('customer.shop.reviews.ejs',{shop : shop,customerId: customerId,orders: orders,customerName: customerName});
};



exports.customerEditProfilePage = async (req,res)=>{
  try {
    const customerId = req.session.customerId;
  if(customerId){
    const customer = await customerModel.findOne({ _id: customerId });
  const customerName = customer.name;
  res.render('customer.edit.profile.ejs',{customerName: customerName,customer: customer});
  }
  else{
    res.redirect('/customer/login');
  }
  } catch (error) {
    res.send({message: error.message});
  }
};

exports.customerEditProfile = async (req,res)=>{
  try {
    const customerId = req.session.customerId;
    if(customerId)
    {
      const {
        name,
        email,
        password,
        contactNo,
        address,
        city,
        bankAccountNumber,
      } = req.body;
  
      
  
      const customer = {
        name,
        email,
        password,
        contactNo,
        address,
        city,
        bankAccountNumber,
      };
      const updatedProfile = await customerModel.findByIdAndUpdate(customerId, customer, { new: true });
  
      if (!updatedProfile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
    res.redirect('/customer/home');
    } else{
      res.redirect('/customer/login');
    }
  } catch (error) {
    res.send({message: error.message});
  }
};


