import { put, list } from "@vercel/blob";

// Create a new post
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, content, tags } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ 
        success: false,
        error: 'User ID and content are required' 
      });
    }

    // Get user to verify they exist
    const { blobs } = await list({ prefix: `users/${userId}` });
    if (blobs.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    const postData = {
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      content,
      tags: tags || [],
      likes: [],
      comments: [],
      shares: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to Vercel Blob storage
    const filename = `posts/${postData.id}.json`;
    const dataString = JSON.stringify(postData, null, 2);
    
    const { url } = await put(filename, dataString, { 
      access: 'public',
      contentType: 'application/json'
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: postData,
      blobUrl: url
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    });
  }
}

