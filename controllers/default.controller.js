const shopModel = require('../models/shop.model');
const catagoryModel = require('../models/catagory.model')
const productModel = require('../models/product.model')
const orderModel = require('../models/order.model')



exports.defaultHomePage = async (req, res) => {
  try {


    const shops = await shopModel.find().sort({ orders: -1 });


    res.render('default.home.ejs', { shops: shops, customerName: false });
  } catch (error) {
    res.send({ message: error.message });
  }
};

exports.defaultShopDetailsPage = async (req, res) => {
  try {
    const shopId = req.body.default_shopId;
    const shop = await shopModel.findOne({ _id: shopId });
    req.session.defaultShopId = shopId;

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

    res.render('default.shop_details.ejs', { shop: shop, catagories: catagories, products: products });
  } catch (error) {
    res.send({ message: error.message });
  }
};



exports.defaultShopReviewsPage = async (req, res) => {


  // const customerId = req.session.customerId;
  // const customer = await customerModel.findOne({ _id: customerId });
  // const customerName = customer.name;
  // const customerShopId = req.session.customerShopId;
  const shopId = req.session.defaultShopId;
  const shop = await shopModel.findOne({ _id: shopId });

  // const orders = await orderModel.find({shopId: customerShopId});

  // Fetch orders for the specific customer, populating the related shop
  const orders = await orderModel
    .find({ shopId: shopId })
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

        if (productInfo) {
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


  res.render('default.shop.reviews.ejs', { shop: shop, orders: orders });
};