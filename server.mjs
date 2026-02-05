import express from 'express';
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
		if (!origin) return true; // Allow same-origin (no Origin header)
		if (allowedOrigins.includes(origin)) return true;
		let hostname;
		try {
			hostname = new URL(origin).hostname;
		} catch {
			return false;
		}
		// Vercel deployments: *.vercel.app only (not vercel.app.evil.com)
		if (hostname === 'vercel.app' || hostname.endsWith('.vercel.app')) return true;
		// Localhost
		if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.localhost')) return true;
		// Production: birdieapp.co and all subdomains (www, app, etc.)
		if (hostname === 'birdieapp.co' || hostname.endsWith('.birdieapp.co')) return true;
		// Allow if origin hostname matches any configured FRONTEND_URL
		for (const url of allowedOrigins) {
			try {
				if (new URL(url).hostname === hostname) return true;
			} catch { /* skip */ }
		}
		return false;
	} catch {
		return false;
	}
};

const corsOptions = {
	origin: (origin, callback) => {
		if (isAllowedOrigin(origin)) {
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

// CORS debug - must run BEFORE cors middleware; open in new tab or fetch from console
app.all('/call/cors-check', (req, res) => {
	res.set('Access-Control-Allow-Origin', '*');
	res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
	if (req.method === 'OPTIONS') return res.sendStatus(200);
	const origin = req.headers.origin;
	const allowed = isAllowedOrigin(origin);
	return res.status(200).json({
		origin: origin || '(none - same-origin request)',
		allowed,
		allowedOrigins,
	});
});

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
	if (!req.headers.authorization) {
		const token = req.cookies?.BirdieJWT;
		if (token) req.headers.authorization = token;
	}
	next();
});

// Health check - match multiple possible paths (Vercel may pass path differently)
app.get('/call/health', (req, res) => res.status(200).json({ ok: true }));
app.get('/health', (req, res) => res.status(200).json({ ok: true }));
// Debug route - diagnose path/routing on Vercel
app.get('/call/debug', (req, res) => res.status(200).json({
	ok: true,
	path: req.path,
	url: req.url,
	originalUrl: req.originalUrl,
	baseUrl: req.baseUrl,
}));
app.get('/debug', (req, res) => res.status(200).json({
	ok: true,
	path: req.path,
	url: req.url,
	originalUrl: req.originalUrl,
}));
// Debug: match any path for health to diagnose routing
app.get('*', (req, res, next) => {
	if (req.path === '/health' || req.path.endsWith('/health')) {
		return res.status(200).json({ ok: true, path: req.path, url: req.url });
	}
	next();
});

// Track init state - backend must respond immediately, init runs in background
let initialized = false;
let initError = null;
app.use((req, res, next) => {
	const p = req.path || req.url || '';
	const isHealth = p === '/call/health' || p === '/health' || p.endsWith('/health');
	const isDebug = p === '/call/debug' || p === '/debug' || p.endsWith('/debug');
	if (isHealth || isDebug) return next();
	if (p.startsWith('/call') && !initialized) {
		return res.status(503).json({
			message: initError ? 'Backend misconfigured' : 'Backend initializing',
			retry: !initError,
			...(process.env.NODE_ENV === 'development' && initError && { error: initError })
		});
	}
	next();
});

// Async initialization - add DB-dependent routes
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
		const mongoUri = process.env.MONGODB_URI;
		if (!mongoUri || typeof mongoUri !== 'string') {
			throw new Error('MONGODB_URI is not set. Add it in Vercel Project Settings → Environment Variables.');
		}
		if (mongoose.connection.readyState !== 1) {
			await mongoose.connect(mongoUri);
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

		// Catch-all 404 - must be registered AFTER routes (Express matches in registration order)
		app.all('*', (req, res, next) => {
			const err = new Error(`Not found: ${req.method} ${req.url}`);
			err.statusCode = 404;
			next(err);
		});

		console.log('App initialized successfully');
		initialized = true;
	} catch (error) {
		console.error('Error during initialization:', error.message);
		initError = error.message;
		// Keep initialized=false so middleware returns 503 for /call/* requests
	}
}

app.use((error, req, res, next) => {
	const statusCode = error.statusCode || (error.message?.includes('CORS') ? 403 : 500);
	console.error('Server error:', error.message);
	res.status(statusCode).json({
		message: error.message || 'Unexpected error occurred'
	});
});



// Run init in background - do NOT await (avoids Vercel cold-start timeout / 505)
appInitiallization().catch((err) => {
	console.error('Unhandled init error:', err.message);
	initError = err.message;
});

export default app;
