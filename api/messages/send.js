import { put, list } from "@vercel/blob";

// Send a message
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
    const { fromUserId, toUserId, content } = req.body;

    if (!fromUserId || !toUserId || !content) {
      return res.status(400).json({ 
        success: false,
        error: 'From user ID, To user ID, and content are required' 
      });
    }

    // Create conversation ID (sorted to ensure same ID for both users)
    const conversationId = [fromUserId, toUserId].sort().join('_');

    // Get or create conversation
    const filename = `messages/${conversationId}.json`;
    let conversation = { 
      id: conversationId,
      participants: [fromUserId, toUserId],
      messages: []
    };

    try {
      const { blobs } = await list({ prefix: filename });
      if (blobs.length > 0) {
        const response = await fetch(blobs[0].url);
        conversation = await response.json();
      }
    } catch (error) {
      // Conversation doesn't exist yet
    }

    // Add new message
    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromUserId,
      toUserId,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };

    conversation.messages.push(message);
    conversation.updatedAt = new Date().toISOString();
    
    // Save to Vercel Blob storage
    const dataString = JSON.stringify(conversation, null, 2);
    const { url } = await put(filename, dataString, { 
      access: 'public',
      contentType: 'application/json'
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      messageData: message,
      conversation,
      blobUrl: url
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    });
  }
}

