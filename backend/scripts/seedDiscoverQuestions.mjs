import { createReadStream } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Load env from Vercel: run "npm run env:pull" to sync from Vercel project
dotenv.config({ path: join(__dirname, '../../.env') });
dotenv.config({ path: join(__dirname, '../../.env.local') });

if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI is not set. Run "npm run env:pull" to load env from Vercel, or add MONGODB_URI to .env.local');
  process.exit(1);
}

// Define schema inline to avoid importing ESM model from CJS context
const discoverQuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  keywords: { type: [String], default: [] },
}, { timestamps: true });
const DiscoverQuestion = mongoose.model('DiscoverQuestion', discoverQuestionSchema);

const CSV_PATH = join(__dirname, '../data/discover-questions.csv');

function parseKeywords(keyWords, keyword) {
  if (keyWords && keyWords.trim()) {
    return keyWords.split(',').map(k => k.trim()).filter(Boolean);
  }
  if (keyword && keyword.trim()) {
    return [keyword.trim()];
  }
  return [];
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await DiscoverQuestion.deleteMany({});
    console.log('Cleared DiscoverQuestion collection');

    const records = [];
    const parser = createReadStream(CSV_PATH).pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,
      })
    );

    for await (const row of parser) {
      const content = (row['Question '] || row['Question'] || row.Question || '').trim();
      const title = (row['Question Title'] || row.title || '').trim();
      const category = (row['Stage/Category'] || row.category || '').trim();
      const keyword = (row['Keyword'] || row.keyword || '').trim();
      const keyWords = (row['Key words'] || row.keywords || '').trim();

      if (!content) continue;

      records.push({
        title: title || content.substring(0, 50),
        content,
        category: category || 'General',
        keywords: parseKeywords(keyWords, keyword),
      });
    }

    await DiscoverQuestion.insertMany(records);
    console.log(`Seeded ${records.length} questions`);

    await mongoose.disconnect();
    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
