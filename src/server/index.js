import express from 'express';
import cors from 'cors';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for your Vue frontend
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-url.com' 
    : 'http://localhost:5173', // Default Vite dev server port
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());

// Debug route to check if server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', env: process.env.NODE_ENV });
});

// Debug route to check environment variables
app.get('/api/env', (req, res) => {
  res.json({ 
    hasApiKey: !!process.env.TBA_API_KEY,
    keyFirstChars: process.env.TBA_API_KEY ? process.env.TBA_API_KEY.substring(0, 4) + '...' : 'not set'
  });
});

// Sample endpoint to fetch data from external API
app.get('/api/teams', async (req, res) => {
  console.log('GET /api/teams called');
  try {
    const apiKey = process.env.TBA_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key is not set' });
    }
    
    const headers = {
      'X-TBA-Auth-Key': apiKey
    };
    
    console.log('Fetching teams from TBA API...');
    const response = await fetch('https://www.thebluealliance.com/api/v3/event/2025orwil/teams/simple', { headers });
    
    if (!response.ok) {
      throw new Error(`TBA API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Retrieved ${data.length} teams from API`);
    
    res.json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch data' });
  }
});

// New endpoint to fetch matches data from external API
app.get('/api/matches', async (req, res) => {
  console.log('GET /api/matches called');
  try {
    const apiKey = process.env.TBA_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key is not set' });
    }
    
    const headers = {
      'X-TBA-Auth-Key': apiKey
    };
    
    console.log('Fetching matches from TBA API...');
    const response = await fetch('https://www.thebluealliance.com/api/v3/event/2025ontor/matches/simple', { headers });
    
    if (!response.ok) {
      throw new Error(`TBA API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Retrieved ${data.length} matches from API`);
    
    res.json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch data' });
  }
});

// Serve the Vue app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../../dist')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Key present: ${!!process.env.TBA_API_KEY}`);
});