import { list } from "@vercel/blob";

// Vercel API endpoint to retrieve click analytics
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
    // List all click tracking files
    const { blobs } = await list({
      prefix: 'analytics/clicks/',
    });

    // Fetch each click file
    const clicks = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const response = await fetch(blob.url);
          const data = await response.json();
          return data;
        } catch (error) {
          console.error('Error fetching click data:', error);
          return null;
        }
      })
    );

    // Filter out any null values and sort by timestamp (newest first)
    const validClicks = clicks
      .filter(click => click !== null)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Calculate analytics
    const analytics = {
      totalClicks: validClicks.length,
      sectionStats: {},
      eventStats: {},
      albumStats: {},
      recentClicks: validClicks.slice(0, 50) // Last 50 clicks
    };

    // Count clicks by section
    validClicks.forEach(click => {
      analytics.sectionStats[click.section] = (analytics.sectionStats[click.section] || 0) + 1;
      
      if (click.event) {
        analytics.eventStats[click.event] = (analytics.eventStats[click.event] || 0) + 1;
      }
      
      if (click.album) {
        analytics.albumStats[click.album] = (analytics.albumStats[click.album] || 0) + 1;
      }
    });

    res.status(200).json({
      success: true,
      analytics: analytics,
      clicks: validClicks
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch analytics',
      message: error.message 
    });
  }
}
