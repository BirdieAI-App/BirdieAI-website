const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
// const cookieParser = require('cookie-parser');
const userRoute = require('./backend/routes/UserRoute.js');
const authRoute = require('./backend/routes/authRoute.js');
const threadRoute = require('./backend/routes/threadRoute.js');
const messageRoute = require('./backend/routes/messageRoute.js')

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, './.env') });

// Access environment variables
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI;


// Body parsing middleware
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
// app.use(express.json()); // Parse JSON bodies


app.use((req, res, next) => {
	console.log(`Received ${req.method} request for ${req.url}`);
	console.log('Request body:', req.body);
	next();
  });


// CORS middleware
app.use(cors());


//making connection to MongoDB
mongoose.connect(mongoURI)
	.then(() => {console.log('MongoDB connected');}
  	).catch(err => {
  	console.error(err.message);
  	process.exit(1);
});


//define the routes
app.use('/call', userRoute)
app.use('/call', authRoute)
app.use('/call', threadRoute)
app.use('/call', messageRoute)


export default app;
