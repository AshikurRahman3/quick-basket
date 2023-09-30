const shopModel = require('../models/shop.model');
const catagoryModel = require('../models/catagory.model')
const productModel = require('../models/product.model')
const bankModel = require('../models/bank.model')
const orderModel = require('../models/order.model')

let errorMessage = '';

// exports.bankPayementPage = (req, res) => {
//     res.render('bank.payment.ejs', { errorMessage: errorMessage });
//   };


exports.bankRegisterPage = (req,res)=>{
    res.render('bank.register.ejs',{errorMessage: errorMessage});
 };

 exports.bankLoginPage = (req,res)=>{
    res.render('bank.login.ejs',{errorMessage: errorMessage});
 };


 exports.bankHomePage = async(req,res)=>{

    const bankAccountNumber = req.session.bankAccountNumber;
  
    const account = await bankModel.findOne({ bankAccountNumber : bankAccountNumber});
    res.render('bank.home.ejs',{bankAccount: account});
  };


exports.bankPaymentPage = (req, res) => {
    // Retrieve the cart item data from the form
    const cartItemData = req.body.cartItem;

    


    try {
        // Parse each JSON string in the array and convert it to an object
        // const cartItems = cartItemData.map(itemString => JSON.parse(itemString));
        const cartItems = Array.isArray(cartItemData) ? cartItemData.map(itemString => JSON.parse(itemString)) : [JSON.parse(cartItemData)];


        // Initialize an array to store product objects
        const productObjects = [];

        // Calculate the total price and create product objects
        let totalCartPrice = 0;
        let shopId =null;

        cartItems.forEach(item => {
            const productId = item.product._id;
            const quantity = item.quantity;
            const price = item.product.price;
            const itemTotal = price * quantity;
            shopId = item.product.shopId;

            // Add the product object to the array
            productObjects.push({
                productId: productId,
                quantity: quantity,
                productTotalPrice: itemTotal,
            });

            // Update the total cart price
            totalCartPrice += itemTotal;
        });

        // Create the cart object to save in the session
        const cartData = {
            total: totalCartPrice,
            shopId: shopId,
            products: productObjects,
        };

        // Save cart data in the session
        req.session.cart = cartData;

        // Log the cart data for verification
        
        res.render('bank.payment.ejs', { errorMessage: errorMessage,total: totalCartPrice });
    } catch (err) {
        // Handle any parsing errors
        console.error('Error parsing cart item data:', err.message);
    }

    // Render the bank payment page with any necessary data
    
};



exports.bankRegister = async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        contactNo,
        bankAccountNumber,
        bankAccountBalance,
      } = req.body;
  
      // Check if a shop with the same email already exists
      const existingAccountEmail = await bankModel.findOne({ email });
      const existingAccountNumber = await bankModel.findOne({ bankAccountNumber });
      if (existingAccountEmail) {
        errorMessage = 'Bank Account with this email already exists';
        res.redirect('/api/bank/register');
        return;
      }

      if (existingAccountNumber) {
        errorMessage = 'Bank Account with this Account Number already exists';
        res.redirect('/api/bank/register');
        return;
      }
  
      const account = new bankModel({
        name,
        email,
        password,
        contactNo,
        bankAccountNumber,
        bankAccountBalance,
      });
  
      await account.save();

      req.session.bankAccountNumber = account.bankAccountNumber;
        console.log('logged in bankAccountNumber: '+ req.session.bankAccountNumber);
        errorMessage = ' ';
        res.redirect('/api/bank/home');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };




  exports.bankLogin = async (req, res) => {
   
    try {
        const { bankAccountNumber, password } = req.body;
        const account = await bankModel.findOne({ bankAccountNumber : bankAccountNumber});
    
        if (!account) {
          errorMessage = 'Bank Account Number not found';
          res.redirect('/api/bank/login');
        }
    
       else if (account.password !== password) {
          
        errorMessage = 'incorrect password';
        res.redirect('/api/bank/login');
    
        
      }
      else
      {
        errorMessage = 'login success';
        req.session.bankAccountNumber = account.bankAccountNumber;
        console.log('logged in bankAccountNumber: '+ req.session.bankAccountNumber);
        errorMessage = ' ';
          res.redirect('/api/bank/home');
      }
     } catch (error) {
        res.status(500).json(error.message);
      }
  };





  exports.bankPayment = async (req, res) => {

    
    try {

        const bankAccountNumber = req.body.accountNumber;
    const bankAccountPassword = req.body.password;
  
    cart = req.session.cart

    // const cartData = {
    //     total: totalCartPrice,
    //     shopId: shopId,
    //     products: productObjects,
    // };

    const paymentAmount = cart.total;
    const shopId = cart.shopId;
    const products = cart.products;

    
    
  
     // Check if the bank account exists and the password matches
      const customerBankAccount = await bankModel.findOne({ bankAccountNumber : bankAccountNumber});
      const ecommerceBankAccount = await bankModel.findOne({bankAccountNumber : 111111});
      
  
      if (!customerBankAccount) {
       
        const script = `
      <script>
        alert('Invalid bank account number');
        history.back();
      </script>
    `;
    
    res.send(script);
        }
    
       else if (customerBankAccount.password !== bankAccountPassword) {
          
        const script = `
      <script>
        alert('Incorrect password');
        history.back();
      </script>
    `;
    
    res.send(script);
    
        
      }
      else if(customerBankAccount.bankAccountBalance < paymentAmount)
      {
      
        const script = `
      <script>
        alert('Insufficient balance');
        history.back();
      </script>
    `;
    
    res.send(script);
      }
      
  
      else
      {
    //       // Update the bank account balance
  
        let ecommerceBalance = Number(ecommerceBankAccount.bankAccountBalance);
        let customerBalance = Number(customerBankAccount.bankAccountBalance);
  
        ecommerceBalance += Number(paymentAmount);
        customerBalance -= Number(paymentAmount);
     
      customerBankAccount.bankAccountBalance = customerBalance;
      ecommerceBankAccount.bankAccountBalance = ecommerceBalance;
      
  
      await customerBankAccount.save();
      await ecommerceBankAccount.save();
  
  
    const newOrder = new orderModel({
        customerId : req.session.customerId,
        shopId : shopId,
        totalAmount: paymentAmount,
        status : 'pending',
        products: products
    });
  
    const insertedOrder = await newOrder.save();
  
    
  
      // Redirect to the purchase history page or send a success response
      const script = `
      <script>
        alert('Payment Successful');
        window.location.href = '/customer/orders';
      </script>
    `;
    
    res.send(script);
      }
  
    } catch (error) {
      console.error(error);
      res.send({message: error.message});
    }
  
  };





