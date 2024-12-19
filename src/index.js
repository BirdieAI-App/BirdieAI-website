
// const authRoute = require('./backend/routes/authRoute.js');
// const stripeWebhookRoute = require('./backend/routes/stripeWebhookRoute.js');
// const openAIPromptRoute = require('./backend/routes/OpenAIPromptRoute.js');

// //define the routes
// app.use('/call', authRoute)
// app.use('/call', stripeWebhookRoute)
// app.use('/call', openAIPromptRoute)


//import libraries
import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import mongoose from 'mongoose';

// import routes
import userRoute from './backend/routes/UserRoute.js'
import threadRoute from './backend/routes/threadRoute.js';
import messageRoute from './backend/routes/messageRoute.js';
import stripeRoute from './backend/routes/stripeRoute.js';
import stripeWebhookRoute from './backend/routes/stripeWebhookRoute.js';

const app = express();

// Body parsing
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

// CORS middleware
const corsOptions = {
	origin: "*", // Ensure this environment variable is set
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-XSRF-TOKEN', 'Accept', 'Origin'],
	credentials: true,
	optionsSuccessStatus: 200 // Some legacy browsers choke on a 204 status
};
app.use(cors(corsOptions));

try {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect( process.env.MONGODB_URI);
    console.log('Database connected successfully');
  }
} catch (error) {
  console.error('Database connection failed', error);
}

// Routes defines
app.use('/', userRoute)
app.use('/', threadRoute)
app.use('/', messageRoute)
app.use('/', stripeRoute)
app.use('/', stripeWebhookRoute)

// Export for Lambda
export const handler = serverless(app);
