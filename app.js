// const mongoose = require('mongoose');
// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// const cors = require('cors');
// // const cookieParser = require('cookie-parser');
// const userRoute = require('./backend/routes/UserRoute.js');
// const authRoute = require('./backend/routes/authRoute.js');
// const threadRoute = require('./backend/routes/threadRoute.js');
// const messageRoute = require('./backend/routes/messageRoute.js');
// const stripeRoute = require('./backend/routes/stripeRoute.js');
// const stripeWebhookRoute = require('./backend/routes/stripeWebhookRoute.js');
// const openAIPromptRoute = require('./backend/routes/OpenAIPromptRoute.js');

// const corsOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN : "*";

// // Load environment variables from .env file
// dotenv.config({ path: path.resolve(__dirname, './.env') });

// // Access environment variables
// const port = process.env.PORT || 3000;
// const mongoURI = process.env.MONGODB_URI;


// // CORS middleware
// const corsOptions = {
// 	origin: corsOrigin, // Ensure this environment variable is set
// 	methods: ['GET', 'POST', 'PUT', 'DELETE'],
// 	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-XSRF-TOKEN', 'Accept', 'Origin'],
// 	credentials: true,
// 	optionsSuccessStatus: 200 // Some legacy browsers choke on a 204 status
// };

// app.use(cors(corsOptions));

// // Body parsing middleware
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
// app.use(express.json()); // Parse JSON bodies

// //making connection to MongoDB
// mongoose.connect(mongoURI)
// 	.then(() => { console.log('MongoDB connected'); }
// 	).catch(err => {
// 		console.error(err.message);
// 		process.exit(1);
// 	});


// //define the routes
// app.use('/call', userRoute)
// app.use('/call', authRoute)
// app.use('/call', threadRoute)
// app.use('/call', messageRoute)
// app.use('/call', stripeRoute)
// app.use('/call', stripeWebhookRoute)
// app.use('/call', openAIPromptRoute)

// export default app;

import express from 'express';
import serverless from 'serverless-http';

const app = express();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello from AWS Lambda!',
    timestamp: new Date().toISOString()
  });
});

app.get('/users', (req, res) => {
  res.json({ 
    users: [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' }
    ]
  });
});

// Export for Lambda
export const handler = serverless(app);