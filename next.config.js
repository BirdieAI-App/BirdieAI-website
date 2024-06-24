const { parsed: localEnv } = require('dotenv').config({
  path: './.env',
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      // Next.js <Image> component needs to whitelist domains for src={}
      "lh3.googleusercontent.com",
      "pbs.twimg.com",
      "images.unsplash.com",
      "logos-world.net",
    ],
  },
  // Load environment variables from .env file
  env: {
    ...localEnv,
  },
};

module.exports = nextConfig;
