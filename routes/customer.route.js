const express = require('express');
const { customerLoginPage, customerRegisterPage, customerRegister, customerHomePage, customerLogin, customerShopDetailsPage, customerCartPage, customerOrdersPage, customerOrderRatingPage, customerOrderRatingSubmit, customerShopReviewsPage, customerEditProfilePage, customerEditProfile } = require('../controllers/customer.controller');

const router = express.Router();


router.get('/login',customerLoginPage)
router.post('/login',customerLogin)
router.get('/register',customerRegisterPage)
router.post('/register',customerRegister)

router.get('/home',customerHomePage)

router.post('/shop_details',customerShopDetailsPage)

router.post('/cart',customerCartPage)

router.get('/orders',customerOrdersPage)

router.post('/order/rating',customerOrderRatingPage)
router.post('/order/submit-rating',customerOrderRatingSubmit)

router.get('/shop/reviews',customerShopReviewsPage)

router.get('/edit-profile',customerEditProfilePage);
router.post('/edit-profile',customerEditProfile);

module.exports = router;