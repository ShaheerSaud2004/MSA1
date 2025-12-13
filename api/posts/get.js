import { list } from "@vercel/blob";

// Get all posts
export default async function handler(req, res) {
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
    // List all posts
    const { blobs } = await list({ prefix: 'posts/' });

    // Fetch each post
    const posts = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const response = await fetch(blob.url);
          const data = await response.json();
          
          // Get user info
          const userBlobs = await list({ prefix: `users/${data.userId}` });
          if (userBlobs.length > 0) {
            const userResponse = await fetch(userBlobs[0].url);
            const userData = await userResponse.json();
            data.author = {
              firstName: userData.firstName,
              lastName: userData.lastName,
              year: userData.year,
              major: userData.major
            };
          }
          
          return data;
        } catch (error) {
          console.error('Error fetching post:', error);
          return null;
        }
      })
    );

    // Filter out null values and sort by date (newest first)
    const validPosts = posts
      .filter(post => post !== null)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      count: validPosts.length,
      posts: validPosts
    });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch posts',
      message: error.message 
    });
  }
}

