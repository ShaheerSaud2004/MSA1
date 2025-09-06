# Rutgers MSA Website

A beautiful, responsive website for the Rutgers University Muslim Student Association (MSA). This website showcases the organization's mission, teams, events, and photo galleries with modern design and interactive features.

## Features

### 🏠 **Homepage**
- Beautiful hero section with animated elements
- MSA mission statement and organization overview
- Engaging statistics and key information
- Smooth scrolling navigation

### 👥 **Teams Section**
- Showcase of all MSA committees and specialized teams
- Interactive team cards with hover effects
- Detailed descriptions of each team's role

### 📅 **Events Calendar**
- Interactive calendar showing upcoming events
- Monthly navigation with event highlighting
- Featured events with detailed information
- Responsive design for all devices

### 📸 **Photo Gallery**
- Filterable gallery by event categories
- Beautiful hover effects and overlays
- Placeholder images with Islamic geometric patterns
- Albums for different event types:
  - Ramadan Challenge
  - Nasheed Recordings
  - Social Events
  - Educational Programs

### 📧 **Contact Section**
- Contact form with validation
- Social media links
- Location and contact information
- Interactive feedback messages

### ✨ **Interactive Features**
- Smooth scroll animations
- Mobile-responsive hamburger navigation
- Counter animations for statistics
- Gallery filtering system
- Calendar functionality
- Form validation
- Scroll-triggered animations

## Technology Stack

- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript (ES6+)** - Interactive functionality and animations
- **Font Awesome** - Icons and visual elements
- **Google Fonts** - Inter font family for typography

## Design Highlights

### 🎨 **Visual Elements**
- Islamic-inspired color scheme (green and gold)
- Geometric patterns in placeholder images
- Professional typography with Inter font
- Responsive design for all screen sizes
- Smooth animations and transitions

### 📱 **Responsive Design**
- Mobile-first approach
- Optimized for tablets and desktop
- Collapsible navigation menu
- Adaptive grid layouts
- Touch-friendly interactions

### 🌟 **User Experience**
- Intuitive navigation
- Fast loading times
- Accessibility considerations
- Smooth user interactions
- Professional presentation

## Setup Instructions

1. **Clone or Download**
   ```bash
   git clone [repository-url]
   # OR download the ZIP file and extract
   ```

2. **File Structure**
   ```
   MSA_web_website/
   ├── index.html          # Main HTML file
   ├── styles.css          # CSS styling
   ├── script.js           # JavaScript functionality
   ├── assets/
   │   └── msa-logo.svg    # MSA logo
   └── README.md           # This file
   ```

3. **Local Development**
   - Open `index.html` in your web browser
   - OR use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Python 2
     python -m SimpleHTTPServer 8000
     
     # Node.js
     npx serve .
     ```

4. **Deploy**
   - Upload all files to your web hosting service
   - Ensure the file structure is maintained
   - The website is ready to use!

## Customization

### 🖼️ **Adding Real Photos**
Replace the placeholder images in the gallery:
1. Add your event photos to the `assets/` folder
2. Update the `src` attributes in the gallery section of `index.html`
3. Name files descriptively (e.g., `ramadan-iftar-2024.jpg`)

### 📅 **Updating Events**
Modify the events in `script.js`:
```javascript
this.events = {
    '2025-01-15': 'Your Event Name',
    '2025-01-22': 'Another Event',
    // Add more events...
};
```

### 🎨 **Color Customization**
Update the CSS color variables in `styles.css`:
```css
:root {
    --primary-color: #2c5530;   /* Main green */
    --secondary-color: #4a7c59; /* Light green */
    --accent-color: #FFD700;    /* Gold */
}
```

### 📝 **Content Updates**
- Edit text content directly in `index.html`
- Update team descriptions, mission statement, etc.
- Add or modify sections as needed

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## Performance Features

- Optimized CSS and JavaScript
- Efficient animations
- Lazy loading considerations
- Minimal external dependencies
- Fast rendering on all devices

## Future Enhancements

Potential features to add:
- [ ] Backend integration for contact form
- [ ] Event registration system
- [ ] Member portal/login
- [ ] Blog section
- [ ] Prayer times integration
- [ ] Multi-language support
- [ ] SEO optimization
- [ ] Analytics integration

## Contributing

To contribute to this website:
1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This website is created for the Rutgers Muslim Student Association. All rights reserved.

## Support

For questions or support:
- Email: info@rutgersmsa.org
- Instagram: @rutgersmsa
- LinkTree: linktr.ee/rumsamarketing

---

**Built with ❤️ for the Rutgers MSA Community**

*"And whoever saves a life, it is as if he has saved all of mankind." - Quran 5:32*



