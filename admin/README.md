# MSA Admin Panel

This admin panel allows authorized users to manage events, photos, and featured content for the Rutgers MSA website.

## Access

To access the admin panel, visit:
```
rutgersmsa.org/admin/admin?key=msa_admin_2025_secure_key
```

## Features

### 1. Events Management
- **Add New Events**: Create events with title, date, time, location, type, description, and optional poster
- **Edit Events**: Modify existing events
- **Delete Events**: Remove events from the system
- **Event Types**: General, HOPE, Ladders, IAW, Road to Revival, Submissions, Sisters Social, Brothers Social

### 2. Photo Gallery Management
- **Upload Photos**: Add photos to specific events and categories (General, Brothers, Sisters)
- **Organize Photos**: Photos are automatically organized by event and category
- **Delete Photos**: Remove individual photos from the gallery
- **Drag & Drop**: Support for drag and drop photo uploads

### 3. Featured Events
- **Set Featured Event**: Choose which event to highlight on the main page
- **Custom Content**: Override event title, description, and poster for featured display
- **Remove Featured**: Unset the current featured event

### 4. Data Management
- **Export Data**: Download all admin data as JSON file
- **Import Data**: Restore data from a previously exported JSON file
- **Clear All Data**: Reset the entire system (use with caution)

## How It Works

### Data Storage
- All data is stored in the browser's localStorage
- Changes are automatically saved and reflected on the main website
- Data persists across browser sessions

### Real-time Updates
- Changes made in the admin panel are immediately visible on the main website
- No page refresh required for updates to appear

### Authentication
- Simple URL-based authentication using a secure key
- Session-based access (remains logged in until browser is closed)
- Access key is required in the URL: `?key=msa_admin_2025_secure_key`

## Usage Instructions

### Adding an Event
1. Go to "Events Management" tab
2. Fill out the event form with all required information
3. Optionally upload a poster image
4. Click "Add Event"
5. The event will appear in the events list and on the main website

### Adding Photos
1. Go to "Photo Gallery" tab
2. Select an existing event from the dropdown
3. Choose a category (General, Brothers, or Sisters)
4. Upload photos by clicking the upload area or dragging files
5. Click "Upload Photos"
6. Photos will be organized by event and category

### Setting Featured Event
1. Go to "Featured Events" tab
2. Select an event to feature from the dropdown
3. Optionally customize the title, description, or poster
4. Click "Set as Featured"
5. The event will be highlighted on the main website

### Managing Data
1. Go to "Settings" tab
2. Use "Export Data" to backup all information
3. Use "Import Data" to restore from a backup
4. Use "Clear All Data" to reset everything (be careful!)

## Security Notes

- The admin key should be kept secure and not shared publicly
- Consider changing the admin key periodically
- The system uses client-side storage, so data is tied to the specific browser/device
- For production use, consider implementing server-side storage and more robust authentication

## Technical Details

- Built with vanilla JavaScript (no external dependencies)
- Uses localStorage for data persistence
- Responsive design that works on desktop and mobile
- Integrates seamlessly with the main MSA website
- Supports image uploads with preview functionality

## Troubleshooting

### Can't Access Admin Panel
- Make sure you're using the correct URL with the key parameter
- Check that the key is exactly: `msa_admin_2025_secure_key`
- Try clearing browser cache and cookies

### Changes Not Appearing
- Refresh the main website page
- Check browser console for any JavaScript errors
- Ensure localStorage is enabled in your browser

### Data Lost
- Check if you have a recent export file to restore from
- Data is stored in browser localStorage, so it's tied to the specific browser/device
- Consider regular exports as backups

## Support

For technical support or questions about the admin panel, contact the website administrator.


