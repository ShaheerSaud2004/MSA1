import { list } from "@vercel/blob";

// Get list of all users (for messaging, directory, etc.)
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
    const { search, excludeUserId } = req.query;

    // List all users
    const { blobs } = await list({ prefix: 'users/' });

    // Fetch each user
    const users = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const response = await fetch(blob.url);
          const userData = await response.json();
          
          // Remove password from response
          const { password: _, ...userWithoutPassword } = userData;
          
          return userWithoutPassword;
        } catch (error) {
          console.error('Error fetching user:', error);
          return null;
        }
      })
    );

    // Filter out null values
    let validUsers = users.filter(user => user !== null);

    // Exclude current user if specified
    if (excludeUserId) {
      validUsers = validUsers.filter(user => user.id !== excludeUserId);
    }

    // Search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      validUsers = validUsers.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.major?.toLowerCase().includes(searchLower)
      );
    }

    // Sort alphabetically
    validUsers.sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`;
      const nameB = `${b.firstName} ${b.lastName}`;
      return nameA.localeCompare(nameB);
    });

    res.status(200).json({
      success: true,
      count: validUsers.length,
      users: validUsers
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch users',
      message: error.message 
    });
  }
}

