import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import mongoose from 'mongoose';
import AWS from 'aws-sdk';
import cookieParser from 'cookie-parser';

// Initialize Express
const app = express();

// Middleware for body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())

app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  console.log(`Request Method: ${req.method}`);
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL); // Your frontend domain
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-XSRF-TOKEN, Accept, Origin');

  if(!req.headers.authorization){
    const cookies = req.cookies;
    let token = null;
    if(!cookies){
      console.log("NO COOKIES FOUND")
    }else{
      token = cookies.jwt;
      console.log("FOUND COOKIES:", token)
    }
    if (token) {
      req.headers.authorization = token;
    }
  }
  next(); // Pass control to the next middleware or route handler
});

// Function to load secrets and initialize the app
async function appInitiallization() {
  try {
    // Load secrets from AWS Secrets Manager
    const secretsManager = new AWS.SecretsManager({ region: 'us-east-2' });
    const response = await secretsManager.getSecretValue({
      SecretId: `${process.env.STAGE}/birdieAI/backend`,
    }).promise();

    const secrets = JSON.parse(response.SecretString);

    // Merge secrets into process.env
    process.env = {
      ...process.env,
      STRIPE_SECRET_KEY: secrets.STRIPE_SECRET_KEY,
      GOOGLE_ID: secrets.GOOGLE_ID,
      GOOGLE_SECRET: secrets.GOOGLE_SECRET,
      CALLBACK_URL: process.env.CALLBACK_URL || secrets.CALLBACK_URL,
      MONGODB_URI: secrets.MONGODB_URI,
      FRONTEND_URL: secrets.FRONTEND_URL,
      JWT_SIGNING_SECRET: secrets.JWT_SIGNING_SECRET
    };
    console.log('AWS Secrets loaded successfully');

    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Database connected successfully');
    }

    // CORS configuration
    const allowedOrigins = [
        `${process.env.FRONTEND_URL}`
    ];
    const corsOptions = {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-XSRF-TOKEN', 'Accept', 'Origin'],
      credentials: true,
      optionsSuccessStatus: 200,
    };
    app.use(cors(corsOptions));

    // Dynamically import passportConfig and routes after secrets are loaded
    const passportConfig = (await import('./backend/passport/config.js')).default;
    const userRoute = (await import('./backend/routes/UserRoute.js')).default;
    const threadRoute = (await import('./backend/routes/threadRoute.js')).default;
    const messageRoute = (await import('./backend/routes/messageRoute.js')).default;
    const stripeRoute = (await import('./backend/routes/stripeRoute.js')).default;
    const stripeWebhookRoute = (await import('./backend/routes/stripeWebhookRoute.js')).default;
    const authRoute = (await import('./backend/routes/authRoute.js')).default;
    const openAIPromptRoute = (await import('./backend/routes/OpenAIPromptRoute.js')).default;
    const authenticateJWT = (await import('./backend/passport/authenticateJWT.js')).default;

    // Initialize Passport
    passportConfig(app);

    // Define routes
    app.use('/', authRoute);
    app.use('/', stripeRoute);
    app.use('/', stripeWebhookRoute);
    app.use('/', userRoute);
    app.use('/', authenticateJWT, openAIPromptRoute);
    app.use('/', authenticateJWT, threadRoute);
    app.use('/', authenticateJWT, messageRoute);

    console.log('App initialized successfully');
  } catch (error) {
    console.error('Error during initialization:', error.message);
    process.exit(1); // Exit process if initialization fails
  }
}

// Call the initialization function and export the handler
await appInitiallization();

export const handler = serverless(app);
