# 📧 MSA Email Templates Guide

## Overview
This guide explains how to use the professional email templates created for the Rutgers MSA notification system with EmailJS.

## Templates Created

### 1. 🎉 Welcome/Confirmation Template (`msa-welcome-template.html`)
**Purpose**: Sent immediately when users sign up for notifications
**Use Case**: Welcome new subscribers and confirm their subscription

**Variables to replace in EmailJS**:
- `{{user_name}}` - Name of the person (or "Friend" if no name)

### 2. 📅 Event Notification Template (`msa-event-template.html`)
**Purpose**: Announce new events to subscribers
**Use Case**: Send when promoting upcoming events

**Variables to replace in EmailJS**:
- `{{event_name}}` - Name of the event
- `{{event_date}}` - Short date format (e.g., "Dec 15, 2024")
- `{{event_subtitle}}` - Brief description
- `{{event_image_url}}` - URL to event poster/image
- `{{event_datetime}}` - Full date and time details
- `{{event_location}}` - Where the event is happening
- `{{event_type}}` - Type of event (Social, Educational, etc.)
- `{{target_audience}}` - Who can attend (All students, Brothers only, etc.)
- `{{event_description}}` - Detailed description
- `{{highlight_1}}` to `{{highlight_4}}` - Key event highlights
- `{{rsvp_link}}` - Link to RSVP form
- `{{more_info_link}}` - Link for more information

### 3. 📸 Photo Update Template (`msa-photos-template.html`)
**Purpose**: Notify when event photos are posted
**Use Case**: Send after events when photo galleries are ready

**Variables to replace in EmailJS**:
- `{{event_name}}` - Name of the event
- `{{photo_count}}` - Number of photos
- `{{attendee_count}}` - Number of people who attended
- `{{event_duration}}` - Duration in hours
- `{{featured_photo_1}}` to `{{featured_photo_5}}` - URLs to preview photos
- `{{remaining_photos}}` - Number of additional photos
- `{{gallery_link}}` - Link to full photo gallery

## How to Set Up Templates in EmailJS

### Step 1: Copy Template HTML
1. Open one of the template files (e.g., `msa-welcome-template.html`)
2. Copy the entire HTML content
3. Go to your EmailJS dashboard
4. Navigate to Email Templates
5. Click "Create New Template"

### Step 2: Configure Template
1. **Template Name**: Give it a descriptive name (e.g., "MSA Welcome Email")
2. **Subject**: Create a subject line with variables if needed
   - Welcome: `Welcome to Rutgers MSA, {{user_name}}! 🎉`
   - Event: `{{event_name}} - Don't Miss Out! 📅`
   - Photos: `{{event_name}} Photos Are Here! 📸`
3. **Content**: Paste the HTML template
4. **From Name**: "Rutgers MSA"
5. **From Email**: Your MSA email address

### Step 3: Update JavaScript Code
Update your `js/script.js` file to use the correct template IDs:

```javascript
// In PhotoNotification class
sendConfirmationEmail(email) {
    const templateParams = {
        user_name: 'Friend', // You can enhance this to get actual names
        user_email: email,
        // Add any other variables your template needs
    };

    emailjs.send(
        'YOUR_SERVICE_ID',
        'msa_welcome_template', // Your EmailJS template ID
        templateParams
    ).then(function(response) {
        console.log('Welcome email sent successfully:', response);
    }).catch(function(error) {
        console.error('Failed to send welcome email:', error);
    });
}

// Example for event notifications
sendEventNotification(eventData) {
    const templateParams = {
        event_name: eventData.name,
        event_date: eventData.date,
        event_subtitle: eventData.subtitle,
        event_image_url: eventData.imageUrl,
        event_datetime: eventData.fullDateTime,
        event_location: eventData.location,
        event_type: eventData.type,
        target_audience: eventData.audience,
        event_description: eventData.description,
        highlight_1: eventData.highlights[0],
        highlight_2: eventData.highlights[1],
        highlight_3: eventData.highlights[2],
        highlight_4: eventData.highlights[3],
        rsvp_link: eventData.rsvpLink,
        more_info_link: eventData.infoLink,
        // Add recipient email
        user_email: email
    };

    emailjs.send(
        'YOUR_SERVICE_ID',
        'msa_event_template', // Your EmailJS template ID
        templateParams
    );
}

// Example for photo notifications
sendPhotoNotification(photoData) {
    const templateParams = {
        event_name: photoData.eventName,
        photo_count: photoData.totalPhotos,
        attendee_count: photoData.attendees,
        event_duration: photoData.duration,
        featured_photo_1: photoData.featuredPhotos[0],
        featured_photo_2: photoData.featuredPhotos[1],
        featured_photo_3: photoData.featuredPhotos[2],
        featured_photo_4: photoData.featuredPhotos[3],
        featured_photo_5: photoData.featuredPhotos[4],
        remaining_photos: photoData.totalPhotos - 5,
        gallery_link: photoData.galleryUrl,
        user_email: email
    };

    emailjs.send(
        'YOUR_SERVICE_ID',
        'msa_photos_template', // Your EmailJS template ID
        templateParams
    );
}
```

## Customization Tips

### 1. 🎨 Branding
- Replace the mosque emoji (🕌) with your actual MSA logo
- Update colors in the CSS to match your exact brand colors
- Replace Instagram/LinkTree URLs with your actual social media links

### 2. 📱 Mobile Optimization
- All templates are responsive and mobile-friendly
- Test on different email clients (Gmail, Outlook, Apple Mail)

### 3. 🔧 Variables
- You can add more variables as needed
- Always provide fallback values for optional variables
- Test templates with sample data before going live

### 4. 📊 Analytics
- Consider adding UTM parameters to links for tracking
- Use EmailJS analytics to monitor open rates and clicks

## Testing Your Templates

### 1. Send Test Emails
```javascript
// Test function you can run in browser console
function testWelcomeEmail() {
    const testParams = {
        user_name: 'Test User',
        user_email: 'your-test-email@gmail.com'
    };
    
    emailjs.send('YOUR_SERVICE_ID', 'msa_welcome_template', testParams)
        .then(() => console.log('Test email sent!'))
        .catch(err => console.error('Test failed:', err));
}
```

### 2. Email Client Testing
- Test in Gmail, Outlook, Apple Mail
- Check both desktop and mobile versions
- Ensure images load properly
- Verify all links work correctly

## Best Practices

### 1. 📧 Email Deliverability
- Keep subject lines under 50 characters
- Avoid spam trigger words
- Include unsubscribe links
- Use a consistent from address

### 2. 🎯 Content
- Keep messages concise but engaging
- Use clear call-to-action buttons
- Include relevant event details
- Personalize when possible

### 3. ⏰ Timing
- Send welcome emails immediately
- Send event notifications 1-2 weeks before events
- Send photo notifications within 24-48 hours after events

### 4. 📈 Performance
- Monitor open rates and click-through rates
- A/B test different subject lines
- Track which events get the most engagement
- Regularly clean your email list

## Troubleshooting

### Common Issues:
1. **Images not loading**: Ensure image URLs are public and accessible
2. **Template variables not replacing**: Check template ID and variable names
3. **Emails going to spam**: Review content and sender reputation
4. **Mobile formatting issues**: Test on actual mobile devices

### Support:
- EmailJS Documentation: https://www.emailjs.com/docs/
- Test emails thoroughly before sending to your full list
- Keep backups of working template configurations

---

**Created by**: Shaheer Saud at [Cipher Consulting](https://cipherconsulting.net)
**Last Updated**: December 2024
