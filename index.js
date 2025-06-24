const app = require('./app');
const dotenv = require('dotenv');


// Load environment variables from .env file
dotenv.config();
const port = process.env.PORT || 4000;


app.listen(port, () => {
    console.log('server running at http://localhost:' + port);
});