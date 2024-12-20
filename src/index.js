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
import authRoute from './backend/routes/authRoute.js';
import openAIPromptRoute from './backend/routes/OpenAIPromptRoute.js';

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
app.use('/', authRoute);
app.use('/', openAIPromptRoute);

// Export for Lambda
export const handler = serverless(app);
