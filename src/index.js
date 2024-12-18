
// const authRoute = require('./backend/routes/authRoute.js');
// const stripeRoute = require('./backend/routes/stripeRoute.js');
// const stripeWebhookRoute = require('./backend/routes/stripeWebhookRoute.js');
// const openAIPromptRoute = require('./backend/routes/OpenAIPromptRoute.js');

// //define the routes
// app.use('/call', authRoute)
// app.use('/call', stripeRoute)
// app.use('/call', stripeWebhookRoute)
// app.use('/call', openAIPromptRoute)


//import libraries
import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import { connectDB } from './backend/lib/db.js';

// import routes
import userRoute from './backend/routes/UserRoute.js'
import threadRoute from './backend/routes/threadRoute.js';
import messageRoute from './backend/routes/messageRoute.js';

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

app.use(async (req, res, next) => {
  //check for db connection already exist
  await connectDB();
  next();
});

// Routes defines
app.use('/', userRoute)
app.use('/', threadRoute)
app.use('/', messageRoute)


// Export for Lambda
export const handler = serverless(app);