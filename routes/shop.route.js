const express = require('express');
const { shopLoginPage, shopRegisterPage, shopRegister, shopLogin, shopHomepage, shopAddProductPage, shopAddProduct, shopOrdersPage, shopOrderAccept, shopOrderReject, shopOrderSupplied, shopAddCategoryPage, shopAddCategory, shopDeleteProduct, shopEditProductPage, shopEditProduct, shopChangeOfferPage, shopChangeOffer, shopEditProfilePage, shopEditProfile } = require('../controllers/shop.controller');
const upload = require('../controllers/shop.controller').upload;

const router = express.Router();



router.get('/login',shopLoginPage);
router.post('/login',shopLogin);

router.get('/register',shopRegisterPage);
// Define the route for shop registration
router.post('/register',upload.single('shop_image'), shopRegister );

router.get('/home',shopHomepage);

router.get('/add-product',shopAddProductPage);
router.post('/add-product',upload.single('product_image'),shopAddProduct);

router.get('/add-category',shopAddCategoryPage);
router.post('/add-category',shopAddCategory);

router.delete('/delete-product/:productId',shopDeleteProduct);

router.post('/edit-product',shopEditProductPage);
router.post('/edit-product-submit',upload.single('product_image'),shopEditProduct);

router.get('/change-offer',shopChangeOfferPage);
router.post('/change-offer',shopChangeOffer);


router.get('/orders',shopOrdersPage);


router.post('/orders/accept',shopOrderAccept);
router.post('/orders/reject',shopOrderReject);
router.post('/orders/supplied',shopOrderSupplied);


router.get('/edit-profile',shopEditProfilePage);
router.post('/edit-profile',upload.single('shop_image'), shopEditProfile );

module.exports = router;