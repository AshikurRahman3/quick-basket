const express = require('express');
const { bankPaymentPage, bankRegisterPage, bankRegister, bankLoginPage, bankLogin, bankHomePage, bankPayment } = require('../controllers/bank.controller');

const router = express.Router();


router.post('/payment',bankPaymentPage)
router.post('/confirm_payment',bankPayment)

router.get('/register',bankRegisterPage)
router.post('/register',bankRegister)

router.get('/login',bankLoginPage)
router.post('/login',bankLogin)


router.get('/home',bankHomePage)

 module.exports = router;