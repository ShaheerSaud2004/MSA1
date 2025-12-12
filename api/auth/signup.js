import { put, list } from "@vercel/blob";

// Signup API endpoint
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
    const { firstName, lastName, email, password, year, major } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password || !year || !major) {
      return res.status(400).json({ 
        success: false,
        error: 'All fields are required' 
      });
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email format' 
      });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({ 
        success: false,
        error: 'Password must be at least 8 characters' 
      });
    }

    // Check if user already exists
    const { blobs } = await list({
      prefix: 'users/',
    });

    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url);
        const existingUser = await response.json();
        
        if (existingUser.email && existingUser.email.toLowerCase() === email.toLowerCase()) {
          return res.status(409).json({ 
            success: false,
            error: 'An account with this email already exists' 
          });
        }
      } catch (error) {
        console.error('Error checking existing user:', error);
        continue;
      }
    }

    // Create user data
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userData = {
      id: userId,
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: password, // In production, hash this with bcrypt
      year,
      major,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profilePicture: null,
      bio: null,
      interests: [],
      friends: [],
      eventsAttended: [],
      isVerified: false
    };

    // Save to Vercel Blob storage
    const filename = `users/${userId}.json`;
    const dataString = JSON.stringify(userData, null, 2);
    
    const { url } = await put(filename, dataString, { 
      access: 'public',
      contentType: 'application/json'
    });

    console.log('User created:', url);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = userData;

    // Create session token
    const sessionToken = Buffer.from(`${userId}:${Date.now()}`).toString('base64');

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: userWithoutPassword,
      token: sessionToken,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    });
  }
}

