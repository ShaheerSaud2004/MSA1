import { list } from "@vercel/blob";

// Get RSVPs for an event
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
    const { eventId } = req.query;

    if (!eventId) {
      return res.status(400).json({ 
        success: false,
        error: 'Event ID is required' 
      });
    }

    // Get RSVP data for event
    const filename = `events/${eventId}/rsvps.json`;
    let rsvpData = { eventId, rsvps: [], cancellations: [] };

    try {
      const { blobs } = await list({ prefix: filename });
      if (blobs.length > 0) {
        const response = await fetch(blobs[0].url);
        rsvpData = await response.json();
      }
    } catch (error) {
      // No RSVPs yet
    }

    res.status(200).json({
      success: true,
      eventId,
      rsvpCount: rsvpData.rsvps.length,
      rsvps: rsvpData.rsvps,
      cancellations: rsvpData.cancellations
    });

  } catch (error) {
    console.error('Get event RSVPs error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch event RSVPs',
      message: error.message 
    });
  }
}

