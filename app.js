const express = require('express');
const session = require('express-session');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public')); 
// Add the following line to serve images from the "uploads/shopPhotos" directory
app.use('/uploads/shopPhotos', express.static('uploads/shopPhotos'));

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use(session({
    secret: '123456',
    resave: false,
    saveUninitialized: false
}));

const defaultRouter = require('./routes/default.route');
const shopRouter = require('./routes/shop.route')
const customerRouter = require('./routes/customer.route');
const bankRouter = require('./routes/bank.route')


const { connect_database } = require('./config/database');
const { insertDefaultCategories } = require('./controllers/insert-default-categories');


app.use(defaultRouter);
app.use('/api/shop',shopRouter);
app.use('/customer',customerRouter);
app.use('/api/bank',bankRouter);

// connect_database();

(async () => {
    const dbConnection = await connect_database();
    await insertDefaultCategories();
})();

app.use((err,req,res,next)=>{

    res.send('something  broke : ' + err.message);
    
});

    app.use((req,res,next)=>{

        res.send('invalid url');
        
    });
module.exports = app;