const express = require('express');
const { defaultHomePage, defaultShopDetailsPage } = require('../controllers/default.controller');
const router = express.Router();


router.get('/',defaultHomePage);


router.post('/shop_details',defaultShopDetailsPage)

 module.exports = router;