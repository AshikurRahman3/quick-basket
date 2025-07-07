const express = require('express');
const { defaultHomePage, defaultShopDetailsPage, defaultShopReviewsPage } = require('../controllers/default.controller');
const router = express.Router();


router.get('/', defaultHomePage);


router.post('/shop_details', defaultShopDetailsPage)
router.get('/shop/reviews', defaultShopReviewsPage)

module.exports = router;