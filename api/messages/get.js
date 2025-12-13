import { list } from "@vercel/blob";

// Get messages for a user
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ 
        success: false,
        error: 'User ID is required' 
      });
    }

    // List all conversations
    const { blobs } = await list({ prefix: 'messages/' });

    // Filter conversations where user is a participant
    const userConversations = [];
    
    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url);
        const conversation = await response.json();
        
        if (conversation.participants.includes(userId)) {
          // Get other participant's info
          const otherUserId = conversation.participants.find(id => id !== userId);
          const userBlobs = await list({ prefix: `users/${otherUserId}` });
          if (userBlobs.length > 0) {
            const userResponse = await fetch(userBlobs[0].url);
            const userData = await userResponse.json();
            conversation.otherUser = {
              id: otherUserId,
              firstName: userData.firstName,
              lastName: userData.lastName
            };
          }
          
          userConversations.push(conversation);
        }
      } catch (error) {
        console.error('Error fetching conversation:', error);
        continue;
      }
    }

    // Sort by most recent message
    userConversations.sort((a, b) => {
      const aLastMsg = a.messages[a.messages.length - 1];
      const bLastMsg = b.messages[b.messages.length - 1];
      return new Date(bLastMsg?.timestamp || 0) - new Date(aLastMsg?.timestamp || 0);
    });

    res.status(200).json({
      success: true,
      count: userConversations.length,
      conversations: userConversations
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch messages',
      message: error.message 
    });
  }
}

