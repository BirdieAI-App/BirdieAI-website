import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

// Initialize Express
const app = express();

// CORS configuration - include Vercel deployment URL for preview/production
const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
const allowedOrigins = [
	process.env.FRONTEND_URL,
	process.env.FRONTEND_URL_WWW,
	process.env.FRONTEND_URL_ALT,
	vercelUrl
].filter(Boolean);

const isAllowedOrigin = (origin) => {
	try {
		if (!origin) return true; // Allow SSR/same-origin
		return allowedOrigins.includes(origin);
	} catch {
		return false;
	}
};

const corsOptions = {
	origin: (origin, callback) => {
		if (isAllowedOrigin(origin)) {
			// Return the origin string directly so CORS middleware can reflect it properly
			// When origin is undefined (same-origin), return true; otherwise return the origin string
			callback(null, origin !== undefined ? origin : true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-XSRF-TOKEN', 'Accept', 'Origin'],
	credentials: true,
	optionsSuccessStatus: 200
};

app.options('*', (req, res) => {
	console.log('in OPTIONS request for ALL routes')
	const origin = req.headers.origin;
	if (isAllowedOrigin(origin)) {
		res.header('Access-Control-Allow-Origin', origin);
		res.header('Vary', 'Origin');
	}
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	res.header('Access-Control-Allow-Credentials', 'true');
	return res.sendStatus(200); // This ensures no further processing of the OPTIONS request
});

app.use(cors(corsOptions));

// Additional middleware to ensure CORS headers are set on all responses
app.use((req, res, next) => {
	const origin = req.headers.origin;
	if (origin && isAllowedOrigin(origin)) {
		res.header('Access-Control-Allow-Origin', origin);
		res.header('Vary', 'Origin');
	}
	res.header('Access-Control-Allow-Credentials', 'true');
	next();
});

// Middleware for body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())

app.use((req, res, next) => {
	console.log(`Request URL: ${req.url}`);
	console.log(`Request Method: ${req.method}`);

	if (!req.headers.authorization) {
		const cookies = req.cookies;
		let token = null;
		if (!cookies) {
			console.log("NO COOKIES FOUND")
		} else {
			token = cookies.BirdieJWT;
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
		// const secretsManager = new AWS.SecretsManager({ region: 'us-east-2' });
		// const response = await secretsManager.getSecretValue({
		// 	SecretId: `${process.env.STAGE}/birdieAI/backend`,
		// }).promise();

		// const secrets = JSON.parse(response.SecretString);

		// // Merge secrets into process.env
		// process.env = {
		// 	...process.env,
		// 	STRIPE_SECRET_KEY: secrets.STRIPE_SECRET_KEY,
		// 	GOOGLE_ID: secrets.GOOGLE_ID,
		// 	GOOGLE_SECRET: secrets.GOOGLE_SECRET,
		// 	CALLBACK_URL: process.env.CALLBACK_URL || secrets.CALLBACK_URL,
		// 	MONGODB_URI: secrets.MONGODB_URI,
		// 	FRONTEND_URL: secrets.FRONTEND_URL,
		// 	JWT_SIGNING_SECRET: secrets.JWT_SIGNING_SECRET,
		// 	OPENAI_KEY: secrets.OPENAI_KEY
		// };
		// console.log('AWS Secrets loaded successfully');

		// Connect to MongoDB
		if (mongoose.connection.readyState !== 1) {
			await mongoose.connect(process.env.MONGODB_URI);
			console.log('Database connected successfully');
		}

		// Dynamically import passportConfig and routes after secrets are loaded
		const passportConfig = (await import('./backend/passport/config.js')).default;
		const userRoute = (await import('./backend/routes/UserRoute.js')).default;
		const threadRoute = (await import('./backend/routes/threadRoute.js')).default;
		const messageRoute = (await import('./backend/routes/messageRoute.js')).default;
		// const stripeRoute = (await import('./backend/routes/stripeRoute.js')).default;
		// const stripeWebhookRoute = (await import('./backend/routes/stripeWebhookRoute.js')).default;
		const authRoute = (await import('./backend/routes/authRoute.js')).default;
		const openAIPromptRoute = (await import('./backend/routes/OpenAIPromptRoute.js')).default;
		const discoverQuestionRoute = (await import('./backend/routes/discoverQuestionRoute.js')).default;
		const authenticateJWT = (await import('./backend/passport/authenticateJWT.js')).default;

		// Initialize Passport
		passportConfig(app);

		// Define routes
		app.use('/call/auth', authRoute);
		app.use('/call/discover', discoverQuestionRoute);
		// app.use('/call/stripe', stripeRoute);
		// app.use('/call/stripe', stripeWebhookRoute);
		app.use('/call/users', userRoute);
		app.use('/call/openai', authenticateJWT, openAIPromptRoute);
		app.use('/call/threads', authenticateJWT, threadRoute);
		app.use('/call/messages', authenticateJWT, messageRoute);

		app.all('*', (req, res, next) => {// route for catching all the requests that is not specified above
			// return res.status(404).json({message: `Cannot find ${req.originalUrl} route with ${req.method} method on server`});
			const err = new Error(`Cannot find ${req.originalUrl} route with ${req.method} method on server`);
			err.statusCode = 404;
			next(err);
		})

		app.use((error, req, res, next) => {
			error.statusCode = error.statusCode || 500;
			console.log(error.message)
			return res.status(error.statusCode).json({
				message: `Unexpected Error occured with message: ${error.message}`
			})
		})

		console.log('App initialized successfully');
	} catch (error) {
		console.error('Error during initialization:', error.message);
		process.exit(1); // Exit process if initialization fails
	}
}



// Call the initialization function and export the handler
await appInitiallization();


export default app;
