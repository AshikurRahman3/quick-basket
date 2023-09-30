const shopModel = require('../models/shop.model');
const catagoryModel = require('../models/catagory.model')
const productModel = require('../models/product.model')



exports.defaultHomePage = async(req,res)=>{
    try {
        

    const shops = await shopModel.find();

    res.render('default.home.ejs',{shops : shops});
    } catch (error) {
        res.send({message: error.message});
    }
 };

 exports.defaultShopDetailsPage = async(req,res)=>{
    try {
        const shopId = req.body.default_shopId;
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
  
      res.render('default.shop_details.ejs', { shop: shop, catagories: catagories, products: products });
    } catch (error) {
        res.send({message: error.message});
    }
 };