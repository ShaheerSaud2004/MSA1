import { put } from "@vercel/blob";

// Vercel API endpoint for tracking clicks on different sections
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { section, event, album, timestamp, userAgent } = req.body;

    // Validate required fields
    if (!section) {
      return res.status(400).json({ error: 'Section is required' });
    }

    // Create click data
    const clickData = {
      id: Date.now().toString(),
      section: section, // e.g., 'gallery', 'featured-events', 'admin'
      event: event || null, // e.g., 'hope-drive', 'career-prep'
      album: album || null, // e.g., 'brothers', 'sisters'
      timestamp: timestamp || new Date().toISOString(),
      userAgent: userAgent || 'unknown',
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown'
    };

    // Save to Vercel Blob storage
    const filename = `analytics/clicks/${clickData.id}.json`;
    const dataString = JSON.stringify(clickData, null, 2);
    
    const { url } = await put(filename, dataString, { 
      access: 'public',
      contentType: 'application/json'
    });

    console.log('Click tracked:', clickData);
    console.log('Saved to blob storage:', url);

    res.status(200).json({
      success: true,
      message: 'Click tracked successfully',
      data: clickData,
      blobUrl: url
    });

  } catch (error) {
    console.error('Click tracking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
