import { list } from "@vercel/blob";

// Check authentication status
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
    const { token, userId } = req.body;

    if (!token || !userId) {
      return res.status(401).json({ 
        success: false,
        authenticated: false,
        error: 'Token and user ID required' 
      });
    }

    // Find user
    const { blobs } = await list({
      prefix: `users/${userId}`,
    });

    if (blobs.length === 0) {
      return res.status(401).json({ 
        success: false,
        authenticated: false,
        error: 'User not found' 
      });
    }

    // Get user data
    const response = await fetch(blobs[0].url);
    const userData = await response.json();
    const { password: _, ...userWithoutPassword } = userData;

    res.status(200).json({
      success: true,
      authenticated: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ 
      success: false,
      authenticated: false,
      error: 'Internal server error' 
    });
  }
}

