# 📧📱 Email & SMS Notification Setup Guide

## 🚀 Quick Setup for Rutgers MSA Notifications

### 📧 EmailJS Setup (FREE - 200 emails/month)

1. **Create EmailJS Account**
   - Go to [emailjs.com](https://www.emailjs.com/)
   - Sign up with your Gmail/Outlook account

2. **Create Email Service**
   - Connect your Gmail or Outlook account
   - Get your `SERVICE_ID`

3. **Create Email Templates**
   
   **Template 1: Confirmation Email**
   - Template ID: `confirmation_template`
   - Subject: `Welcome to Rutgers MSA Notifications! 🕌`
   - Content:
   ```
   Hi {{to_name}},

   {{message}}
   ```

   **Template 2: Update Email**
   - Template ID: `update_template`
   - Subject: `{{subject}}`
   - Content:
   ```
   Hi {{to_name}},

   {{message}}
   ```

4. **Get Your Keys**
   - Public Key: Found in EmailJS dashboard
   - Service ID: From your email service
   - Template IDs: From your templates

5. **Update the Website**
   Replace in `index.html`:
   ```javascript
   emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual public key
   ```
   
   Replace in `js/script.js`:
   ```javascript
   emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
   ```

### 📱 SMS Setup with Twilio

#### Option 1: Simple Backend (Recommended)

Create a simple Node.js backend:

1. **Install Requirements**
   ```bash
   npm init -y
   npm install express twilio cors
   ```

2. **Create `server.js`**
   ```javascript
   const express = require('express');
   const twilio = require('twilio');
   const cors = require('cors');

   const app = express();
   app.use(cors());
   app.use(express.json());

   // Twilio credentials (get from twilio.com)
   const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
   const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
   const twilioPhone = 'YOUR_TWILIO_PHONE_NUMBER';

   const client = twilio(accountSid, authToken);

   app.post('/send-sms', async (req, res) => {
       try {
           const { phone, message } = req.body;
           
           const result = await client.messages.create({
               body: message,
               from: twilioPhone,
               to: phone
           });
           
           res.json({ success: true, sid: result.sid });
       } catch (error) {
           console.error('SMS Error:', error);
           res.status(500).json({ success: false, error: error.message });
       }
   });

   app.listen(3000, () => {
       console.log('SMS server running on port 3000');
   });
   ```

3. **Run Backend**
   ```bash
   node server.js
   ```

#### Option 2: Netlify Functions (Serverless)

Create `.netlify/functions/send-sms.js`:
```javascript
const twilio = require('twilio');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { phone, message } = JSON.parse(event.body);
    
    const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );

    try {
        const result = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, sid: result.sid })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: error.message })
        };
    }
};
```

### 🎯 How to Send Notifications Later

#### Send to All Subscribers
```javascript
// In browser console (F12)
const notifier = new PhotoNotification();

// Send email to all subscribers
notifier.sendBulkNotifications(
    "New Event: Jummah Prayer", 
    "Join us this Friday at 1 PM for Jummah Prayer at the MSA room. See you there! 🕌",
    "email"
);

// Send SMS to all subscribers
notifier.sendBulkNotifications(
    "", 
    "🕌 New MSA event photos are up! Check them out at rutgersmsa.org",
    "sms"
);

// Send both email and SMS
notifier.sendBulkNotifications(
    "MSA Fall Dinner - TONIGHT!", 
    "Don't forget about our Fall Dinner tonight at 7 PM! Delicious food and great company await. 🍽️",
    "both"
);
```

### 💰 Costs

**EmailJS**: FREE (200 emails/month)
**Twilio SMS**: ~$0.0075 per SMS (very cheap!)

For 100 students:
- Emails: FREE
- SMS: ~$0.75 per message to all

### 🔧 Quick Start Checklist

- [ ] Create EmailJS account
- [ ] Set up email templates
- [ ] Update website with EmailJS keys
- [ ] Create Twilio account (for SMS)
- [ ] Set up simple backend or Netlify functions
- [ ] Update SMS endpoint in code
- [ ] Test with your own email/phone
- [ ] Start collecting subscribers!

### 🎉 Usage Examples

**Welcome Message**: Automatically sent when someone signs up
**Event Announcements**: "Join us for Friday Prayer at 1 PM!"
**Photo Updates**: "New photos from Fall Kickoff are now available!"
**Reminders**: "Don't forget about tonight's event!"

### 🛡️ Best Practices

1. **Always include unsubscribe option**
2. **Don't spam - quality over quantity**
3. **Test with small groups first**
4. **Keep messages short and engaging**
5. **Include MSA branding and social links**

### 📞 Support

If you need help setting this up, contact:
**Shaheer Saud** at **Cipher Consulting**
Website: [cipherconsulting.net](https://cipherconsulting.net)
