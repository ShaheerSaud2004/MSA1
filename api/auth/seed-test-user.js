import { put } from "@vercel/blob";

// Seed a test user for development
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow in development (you can add more security checks)
  try {
    const testUserData = {
      id: 'test_user_12345',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@rutgers.edu',
      password: 'test1234', // In production, this would be hashed
      year: 'sophomore',
      major: 'Computer Science',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profilePicture: null,
      bio: 'This is a test account for development',
      interests: ['Technology', 'Community Service'],
      friends: [],
      eventsAttended: [],
      isVerified: false
    };

    // Save to Vercel Blob storage
    const filename = `users/${testUserData.id}.json`;
    const dataString = JSON.stringify(testUserData, null, 2);
    
    const { url } = await put(filename, dataString, { 
      access: 'public',
      contentType: 'application/json'
    });

    console.log('Test user created:', url);

    res.status(200).json({
      success: true,
      message: 'Test user created successfully',
      credentials: {
        email: 'test@rutgers.edu',
        password: 'test1234'
      },
      userUrl: url
    });

  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create test user',
      message: error.message 
    });
  }
}

