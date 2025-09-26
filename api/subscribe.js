import { put } from "@vercel/blob";

// Vercel API endpoint for saving notification subscriptions
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
    const { email, phone, timestamp, id } = req.body;

    // Validate input
    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone number is required' });
    }

    // Email validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Phone validation
    if (phone && !/^[\d\s\-\+\(\)]{10,15}$/.test(phone.replace(/\D/g, ''))) {
      return res.status(400).json({ error: 'Invalid phone format' });
    }

    // Create subscription data
    const subscriptionData = {
      id: id || Date.now().toString(),
      email: email || null,
      phone: phone || null,
      timestamp: timestamp || new Date().toISOString(),
      source: 'website_notification_modal'
    };

    // Save to Vercel Blob storage
    const filename = `subscriptions/${subscriptionData.id}.json`;
    const dataString = JSON.stringify(subscriptionData, null, 2);
    
    const { url } = await put(filename, dataString, { 
      access: 'public',
      contentType: 'application/json'
    });

    console.log('Subscription saved to blob storage:', url);
    console.log('Subscription data:', subscriptionData);

    // Send confirmation email using EmailJS (you'll need to set up the service)
    if (email) {
      // This would integrate with your EmailJS setup
      console.log('Would send confirmation email to:', email);
    }

    // Send confirmation SMS using Twilio (you'll need to set up the service)
    if (phone) {
      // This would integrate with your Twilio setup
      console.log('Would send confirmation SMS to:', phone);
    }

    res.status(200).json({
      success: true,
      message: 'Successfully subscribed to notifications!',
      data: subscriptionData,
      blobUrl: url
    });

  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
