import { list } from "@vercel/blob";

// Vercel API endpoint to retrieve all subscriptions
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // List all files in the subscriptions folder
    const { blobs } = await list({
      prefix: 'subscriptions/',
    });

    // Fetch each subscription file
    const subscriptions = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const response = await fetch(blob.url);
          const data = await response.json();
          return data;
        } catch (error) {
          console.error('Error fetching blob:', error);
          return null;
        }
      })
    );

    // Filter out any null values and sort by timestamp (newest first)
    const validSubscriptions = subscriptions
      .filter(sub => sub !== null)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.status(200).json({
      success: true,
      count: validSubscriptions.length,
      subscriptions: validSubscriptions
    });

  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch subscriptions',
      message: error.message 
    });
  }
}

