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

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, './.env') });

// Access environment variables
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI;

//making connection to MongoDB
mongoose.connect(mongoURI)
	.then(() => {console.log('MongoDB connected');}
  	).catch(err => {
  	console.error(err.message);
  	process.exit(1);
});

console.log("testtt")

	//setup to recieve body 
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(bodyParser.json())
	// app.use(cookieParser())
	app.use(cors())
	//define the routes
	app.use('/.api', userRoute)
	app.use('/.api',authRoute)


export default app;
