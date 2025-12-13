import { put, list } from "@vercel/blob";

// RSVP to an event
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
    const { userId, eventId, action } = req.body; // action: 'rsvp' or 'cancel'

    if (!userId || !eventId || !action) {
      return res.status(400).json({ 
        success: false,
        error: 'User ID, Event ID, and action are required' 
      });
    }

    // Get or create event RSVP data
    const filename = `events/${eventId}/rsvps.json`;
    let rsvpData = { eventId, rsvps: [], cancellations: [] };

    try {
      const { blobs } = await list({ prefix: filename });
      if (blobs.length > 0) {
        const response = await fetch(blobs[0].url);
        rsvpData = await response.json();
      }
    } catch (error) {
      // File doesn't exist yet, create new one
    }

    if (action === 'rsvp') {
      // Add to RSVPs if not already there
      if (!rsvpData.rsvps.includes(userId)) {
        rsvpData.rsvps.push(userId);
      }
      // Remove from cancellations if there
      rsvpData.cancellations = rsvpData.cancellations.filter(id => id !== userId);
    } else if (action === 'cancel') {
      // Remove from RSVPs
      rsvpData.rsvps = rsvpData.rsvps.filter(id => id !== userId);
      // Add to cancellations
      if (!rsvpData.cancellations.includes(userId)) {
        rsvpData.cancellations.push(userId);
      }
    }

    rsvpData.updatedAt = new Date().toISOString();
    
    // Save to Vercel Blob storage
    const dataString = JSON.stringify(rsvpData, null, 2);
    const { url } = await put(filename, dataString, { 
      access: 'public',
      contentType: 'application/json'
    });

    res.status(200).json({
      success: true,
      message: `RSVP ${action === 'rsvp' ? 'confirmed' : 'cancelled'}`,
      rsvpCount: rsvpData.rsvps.length,
      data: rsvpData,
      blobUrl: url
    });

  } catch (error) {
    console.error('RSVP error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    });
  }
}

