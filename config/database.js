const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// connecting to mongodb using mongoose
const connect_database = async () => {  // use fucntion as 'async'
    try {
        const mongoURI = process.env.MONGO_URI;
        await mongoose.connect(mongoURI);  // using 'await' to wait if needed
        console.log('database connected');

    } catch (error) {
        console.log('database not connected');
        console.log(error.message);
        process.exit(1);
    }
};


module.exports = { connect_database };