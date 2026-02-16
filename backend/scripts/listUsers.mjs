/**
 * List users in the DB (email only, no passwords). Use for finding a valid user to test login.
 *
 * MONGODB_URI can come from environment variables (e.g. Vercel preview/production) or .env.local.
 * Run: node backend/scripts/listUsers.mjs
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });
dotenv.config({ path: join(__dirname, '../../.env.local') });

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set. Set it in your environment (e.g. Vercel env vars or .env.local).');
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  accountData: { email: String, password: String },
  profileData: { firstName: String, lastName: String, subscriptionTier: String },
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = await User.find({}, 'accountData.email createdAt').lean().sort({ createdAt: -1 }).limit(20);
  await mongoose.disconnect();
  if (users.length === 0) {
    console.log('No users in DB. Create one via /signup on the app.');
    return;
  }
  console.log('Users in DB (use one of these emails with the password you set):');
  users.forEach((u, i) => console.log(`  ${i + 1}. ${u.accountData?.email || '(no email)'}`));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
