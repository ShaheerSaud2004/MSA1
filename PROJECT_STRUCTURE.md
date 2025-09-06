# MSA Website - Project Structure

## 📁 Organized File Structure

```
MSA_web_website/
├── 📄 index.html              # Main website page
├── 📄 index-modern.html       # Alternative modern layout
├── 📄 README.md              # Project documentation
├── 📄 PROJECT_STRUCTURE.md   # This file
├── 📄 create_thumbnails.sh   # Image optimization script
│
├── 📁 css/                   # Stylesheets
│   ├── styles.css           # Main website styles
│   └── modern-styles.css    # Modern layout styles
│
├── 📁 js/                    # JavaScript files
│   ├── script.js            # Main website functionality
│   └── modern-script.js     # Modern layout functionality
│
└── 📁 images/               # All image assets
    ├── 📁 logos/            # Organization logos
    │   ├── MSA.png          # Main MSA logo
    │   ├── RUTGERS.png      # Rutgers University logo
    │   ├── msa-logo.svg     # MSA SVG logo
    │   ├── rutgers-msa-logo.png
    │   └── rutgers-msa-logo.svg
    │
    ├── 📁 posters/          # Event posters
    │   ├── KickoffPoster.png
    │   └── Freshman Orientation.JPG
    │
    ├── 📁 team/             # Team/committee images
    │   ├── BS.jpg           # Brothers Social
    │   ├── SS.jpg           # Sisters Social
    │   ├── IAW.jpg          # Islamic Awareness Week
    │   ├── RR.jpg           # Road to Ramadan
    │   ├── Sub.jpg          # Submissions
    │   ├── hope.jpg         # HOPE
    │   └── Lad.jpg          # Ladders
    │
    └── 📁 gallery/          # Photo galleries
        └── Photos/          # Event photos
            ├── Fall Kickoff/
            │   ├── Brothers/     # 244 photos
            │   ├── Sisters/      # 180 photos
            │   └── Thumbnails/
            │       ├── Brothers/ # Optimized thumbnails
            │       └── Sisters/  # Optimized thumbnails
            └── [Other event photos...]
```

## 🔄 Updated References

All file references have been updated throughout the project:

### HTML Files
- ✅ CSS imports updated to `css/` folder
- ✅ JavaScript imports updated to `js/` folder  
- ✅ Logo references updated to `images/logos/`
- ✅ Poster references updated to `images/posters/`
- ✅ Team images updated to `images/team/`
- ✅ Gallery photos updated to `images/gallery/Photos/`

### JavaScript Files
- ✅ Photo gallery paths updated to new structure
- ✅ Thumbnail generation paths updated
- ✅ Event photo references updated

## 🚀 Benefits of New Structure

1. **Professional Organization**: Clear separation of file types
2. **Easy Maintenance**: Logical grouping makes finding files simple
3. **Scalability**: Easy to add new images/styles/scripts
4. **Deployment Ready**: Clean structure for hosting platforms
5. **Team Collaboration**: Clear organization for multiple developers

## 📝 Development Notes

- Main entry point: `index.html`
- Primary styles: `css/styles.css`
- Main functionality: `js/script.js`
- All images organized by purpose/type
- Thumbnail system maintained for performance

## 🌐 Hosting Ready

This structure is optimized for deployment on:
- ✅ Vercel
- ✅ Netlify  
- ✅ GitHub Pages
- ✅ Any static hosting platform

The organized structure ensures fast loading and easy maintenance for your MSA website!
