const mongoose = require('mongoose');

// connecting to mongodb using mongoose
const connect_database = async () =>{  // use fucntion as 'async'
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/quickBasketDB");  // using 'await' to wait if needed
        console.log('database connected');

    } catch (error){
            console.log('database not connected');
            console.log(error.message);
            process.exit(1);
    }
};


module.exports = {connect_database};