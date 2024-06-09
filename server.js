require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// Access environment variables
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

//making connection to MongoDB
mongoose.connect(mongoURI)
	.then(() => {console.log('MongoDB connected');}
  	).catch(err => {
  	console.error(err.message);
  	process.exit(1);
});


app
	//setup to recieve body 
	.use(bodyParser.urlencoded({ extended: true }))
	.use(bodyParser.json())
	.use(cors())
	//define the routes
	.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
