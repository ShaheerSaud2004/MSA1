import { list } from "@vercel/blob";

// Login API endpoint
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST for login
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed',
      allowedMethods: ['POST', 'OPTIONS'],
      receivedMethod: req.method
    });
  }

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email and password are required' 
      });
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email format' 
      });
    }

    // Get all users from blob storage
    const { blobs } = await list({
      prefix: 'users/',
    });

    // Find user by email
    let user = null;
    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url);
        const userData = await response.json();
        
        if (userData.email === email) {
          user = userData;
          break;
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        continue;
      }
    }

    // Check if user exists
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }

    // Simple password check (in production, use bcrypt or similar)
    // For demo: compare plain text (NOT SECURE - upgrade to hashed passwords)
    if (user.password !== password) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Create session token (simple demo - use JWT in production)
    const sessionToken = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token: sessionToken,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    });
  }
}

