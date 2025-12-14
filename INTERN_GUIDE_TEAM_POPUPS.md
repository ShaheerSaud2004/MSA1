# Intern Guide: Creating Popup Pages for Spec Teams

## 📋 Overview
This guide will teach you how to create popup pages (also called modals) that appear when users click on team cards. You'll learn the concepts and structure, then apply them to create popups for each spec team.

---

## 🎯 What You'll Learn

By the end of this guide, you'll know how to:
- ✅ Create a popup/modal structure in HTML
- ✅ Style the popup with CSS
- ✅ Add JavaScript to show/hide the popup
- ✅ Connect team cards to their popups
- ✅ Add content to each team's popup
- ✅ Make the popup responsive for mobile

---

## 🧠 Understanding Popups/Modals

### What is a Popup?
A popup (or modal) is a window that appears on top of the current page. It's like a pop-up book - when you click something, a new layer appears.

### Key Concepts:
1. **Overlay** - The dark background that covers the page
2. **Modal Box** - The actual popup window with content
3. **Close Button** - A way to close the popup
4. **JavaScript** - Code that shows/hides the popup

---

## 📁 Step 1: Understanding the Current Structure

### Find the Teams Section

1. **Open `index.html`**
2. **Search for**: `<!-- Teams Section -->` (around line 211)
3. **Look at a team card structure** - you'll see something like:

```html
<div class="flip-card ladders-card">
    <div class="flip-card-inner">
        <!-- Front and back sides -->
    </div>
</div>
```

**Notice:**
- Each team has a class like `ladders-card`, `hope-card`, etc.
- They're inside a container called `flip-cards-gallery`
- Currently, cards flip on hover

**Your task:** Add a click event that opens a popup instead of (or in addition to) the flip.

---

## 🏗️ Step 2: Creating the Popup Structure

### Basic Popup HTML Structure

A popup needs three parts:

```html
<!-- 1. The Overlay (dark background) -->
<div class="popup-overlay" id="teamPopupOverlay"></div>

<!-- 2. The Modal Box (the actual popup) -->
<div class="popup-modal" id="teamPopup">
    <!-- 3. Close Button -->
    <button class="popup-close" onclick="closeTeamPopup()">
        <i class="fas fa-times"></i>
    </button>
    
    <!-- 4. Content Area (where team info goes) -->
    <div class="popup-content" id="popupContent">
        <!-- Team content will go here -->
    </div>
</div>
```

### Where to Add This

**Add the popup structure at the END of the `<body>` tag** (before `</body>`).

**Why?** So it appears on top of everything else.

---

## 🎨 Step 3: Styling the Popup with CSS

### Understanding CSS for Popups

You need to add styles to `css/styles.css`. Here's what each part does:

### The Overlay (Dark Background)

```css
.popup-overlay {
    display: none;  /* Hidden by default */
    position: fixed;  /* Stays in place when scrolling */
    top: 0;
    left: 0;
    width: 100%;  /* Full screen width */
    height: 100%;  /* Full screen height */
    background: rgba(0, 0, 0, 0.7);  /* Dark, semi-transparent */
    z-index: 9998;  /* Appears above everything */
}
```

**What to change:**
- `rgba(0, 0, 0, 0.7)` - The `0.7` controls darkness (0 = invisible, 1 = solid black)
- Try different values: `0.5` (lighter) or `0.8` (darker)

### The Modal Box (The Popup Window)

```css
.popup-modal {
    display: none;  /* Hidden by default */
    position: fixed;
    top: 50%;  /* Center vertically */
    left: 50%;  /* Center horizontally */
    transform: translate(-50%, -50%);  /* Perfect centering */
    background: white;
    border-radius: 20px;  /* Rounded corners */
    max-width: 800px;  /* Maximum width */
    width: 90%;  /* 90% of screen on mobile */
    max-height: 90vh;  /* 90% of screen height */
    overflow-y: auto;  /* Scroll if content is too long */
    z-index: 9999;  /* Above the overlay */
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);  /* Shadow effect */
}
```

**What to customize:**
- `max-width: 800px` - Make it wider (`1000px`) or narrower (`600px`)
- `border-radius: 20px` - More rounded (`30px`) or less (`10px`)
- `background: white` - Try a color like `#f8f9fa` for light gray

### Showing the Popup

```css
.popup-overlay.active,
.popup-modal.active {
    display: block;  /* Show when "active" class is added */
}
```

**How it works:** When you add the class `active` to these elements, they become visible.

### The Close Button

```css
.popup-close {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #666;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s;
}

.popup-close:hover {
    background: #f0f0f0;
    color: #333;
}
```

**What to customize:**
- `top: 15px; right: 15px` - Position of the X button
- `font-size: 1.5rem` - Size of the X icon

### Content Area

```css
.popup-content {
    padding: 2rem;
}
```

**What to customize:**
- `padding: 2rem` - Space inside the popup (try `1.5rem` or `3rem`)

### Mobile Responsiveness

```css
@media (max-width: 768px) {
    .popup-modal {
        width: 95%;
        max-height: 95vh;
        border-radius: 15px;
    }
    
    .popup-content {
        padding: 1.5rem;
    }
}
```

**Why:** Makes the popup work better on phones.

---

## 💻 Step 4: Adding JavaScript Functionality

### Understanding JavaScript for Popups

JavaScript controls when the popup shows and hides. You'll add this in a `<script>` tag, usually at the end of `index.html` (before `</body>`).

### Basic Functions You Need

#### Function 1: Open the Popup

```javascript
function openTeamPopup(teamName) {
    // Get the popup elements
    const overlay = document.getElementById('teamPopupOverlay');
    const modal = document.getElementById('teamPopup');
    const content = document.getElementById('popupContent');
    
    // Add content based on team name
    content.innerHTML = getTeamContent(teamName);
    
    // Show the popup
    overlay.classList.add('active');
    modal.classList.add('active');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}
```

**What it does:**
- Takes a `teamName` parameter (like "ladders" or "hope")
- Gets the popup elements
- Fills in the content
- Shows the popup by adding the `active` class

#### Function 2: Close the Popup

```javascript
function closeTeamPopup() {
    const overlay = document.getElementById('teamPopupOverlay');
    const modal = document.getElementById('teamPopup');
    
    // Hide the popup
    overlay.classList.remove('active');
    modal.classList.remove('active');
    
    // Allow body scrolling again
    document.body.style.overflow = '';
}
```

**What it does:**
- Removes the `active` class to hide the popup
- Restores scrolling

#### Function 3: Get Team Content

```javascript
function getTeamContent(teamName) {
    // This is where YOU fill in the content for each team
    const teamData = {
        'ladders': {
            title: 'Ladders',
            subtitle: 'Professional Development',
            description: 'Your description here...',
            features: ['Feature 1', 'Feature 2', 'Feature 3'],
            instagram: '@ladders.rumsa',
            // Add more fields as needed
        },
        'hope': {
            title: 'HOPE',
            subtitle: 'Charity & Service',
            description: 'Your description here...',
            // ... etc
        }
        // Add all other teams here
    };
    
    const team = teamData[teamName];
    if (!team) return '<p>Team not found</p>';
    
    // Build the HTML content
    return `
        <h2>${team.title}</h2>
        <p class="popup-subtitle">${team.subtitle}</p>
        <p class="popup-description">${team.description}</p>
        <!-- Add more HTML here -->
    `;
}
```

**Your task:** Fill in the content for each team in the `teamData` object.

---

## 🔗 Step 5: Connecting Team Cards to Popups

### Method 1: Add onclick to Each Card

Find each team card and add an `onclick` attribute:

```html
<div class="flip-card ladders-card" onclick="openTeamPopup('ladders')">
    <!-- card content -->
</div>
```

**For each team:**
- Ladders: `onclick="openTeamPopup('ladders')"`
- HOPE: `onclick="openTeamPopup('hope')"`
- Road to Revival: `onclick="openTeamPopup('r2r')"`
- etc.

### Method 2: Close on Overlay Click

Add this to close when clicking the dark background:

```javascript
document.getElementById('teamPopupOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeTeamPopup();
    }
});
```

### Method 3: Close on Escape Key

```javascript
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeTeamPopup();
    }
});
```

---

## 📝 Step 6: Designing the Popup Content

### Content Structure Ideas

Think about what information each team popup should have:

1. **Header Section**
   - Team name
   - Team subtitle/tagline
   - Team logo/image

2. **Description Section**
   - What the team does
   - Mission/purpose
   - Who it's for

3. **Features/Activities**
   - List of what they do
   - Events they organize
   - Programs they run

4. **Social Links**
   - Instagram handle
   - Other social media
   - Contact information

5. **Call to Action**
   - "Learn More" button
   - "Follow Us" button
   - "Get Involved" button

### Example HTML Structure

```html
<div class="popup-header">
    <img src="images/team/Lad.jpg" alt="Team Logo" class="popup-logo">
    <h2>Ladders</h2>
    <p class="popup-subtitle">Professional Development</p>
</div>

<div class="popup-body">
    <p class="popup-description">
        Empowering professional growth through networking, 
        skill development, and mentorship opportunities...
    </p>
    
    <div class="popup-features">
        <h3>What We Do</h3>
        <ul>
            <li>Career Workshops</li>
            <li>Networking Events</li>
            <li>Mentorship Program</li>
        </ul>
    </div>
    
    <div class="popup-social">
        <a href="https://instagram.com/ladders.rumsa" target="_blank">
            <i class="fab fa-instagram"></i> @ladders.rumsa
        </a>
    </div>
</div>
```

**Your task:** Design the content structure for each team. Make it informative and engaging!

---

## 🎨 Step 7: Styling the Popup Content

### Add Styles for Content Elements

```css
.popup-header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid #f0f0f0;
}

.popup-logo {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1rem;
}

.popup-header h2 {
    color: #2c5530;
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.popup-subtitle {
    color: #666;
    font-size: 1.1rem;
    font-style: italic;
}

.popup-description {
    line-height: 1.8;
    color: #555;
    margin-bottom: 2rem;
}

.popup-features {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 10px;
    margin-bottom: 2rem;
}

.popup-features ul {
    list-style: none;
    padding: 0;
}

.popup-features li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #e0e0e0;
}

.popup-features li:last-child {
    border-bottom: none;
}

.popup-social a {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
    color: white;
    text-decoration: none;
    border-radius: 25px;
    transition: transform 0.3s;
}

.popup-social a:hover {
    transform: scale(1.05);
}
```

**Your task:** Customize these styles to match the website's design!

---

## 🧪 Step 8: Testing Your Popup

### Testing Checklist

1. **Click a team card** - Does the popup appear?
2. **Check the overlay** - Is the background dark?
3. **Click the X button** - Does it close?
4. **Click the overlay** - Does it close?
5. **Press Escape key** - Does it close?
6. **Check content** - Is all team information showing?
7. **Test on mobile** - Does it look good on phone?
8. **Test scrolling** - If content is long, can you scroll?
9. **Test all teams** - Does each team have its own popup?

### Common Issues

**Issue:** Popup doesn't appear
- **Check:** Did you add the `active` class in JavaScript?
- **Check:** Are the CSS classes correct?

**Issue:** Popup appears but is empty
- **Check:** Did you fill in the `getTeamContent()` function?
- **Check:** Is the team name matching (case-sensitive)?

**Issue:** Popup is too small/large
- **Fix:** Adjust `max-width` in CSS
- **Fix:** Adjust `width` percentage

**Issue:** Content overflows
- **Fix:** Add `overflow-y: auto` to `.popup-modal`
- **Fix:** Reduce padding or font sizes

---

## 🎓 Step 9: Advanced Features (Optional)

### Feature 1: Add Animations

Make the popup fade in smoothly:

```css
.popup-overlay {
    opacity: 0;
    transition: opacity 0.3s ease;
}

.popup-overlay.active {
    opacity: 1;
}

.popup-modal {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
    transition: all 0.3s ease;
}

.popup-modal.active {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
}
```

### Feature 2: Add Team-Specific Images

```javascript
const teamImages = {
    'ladders': 'images/team/Lad.jpg',
    'hope': 'images/team/hope.jpg',
    // etc.
};
```

### Feature 3: Add Links to Team Events

Link to the team's events in the gallery:

```html
<a href="#events" onclick="closeTeamPopup()" class="popup-link">
    View Our Events <i class="fas fa-arrow-right"></i>
</a>
```

---

## 📚 Learning Resources

### HTML & CSS
- [MDN HTML Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [CSS Positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/position)
- [CSS Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

### JavaScript
- [MDN JavaScript Basics](https://developer.mozilla.org/en-US/docs/Learn/JavaScript)
- [DOM Manipulation](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)

### Popups/Modals
- [W3Schools Modal Tutorial](https://www.w3schools.com/howto/howto_css_modals.asp)
- [CSS-Tricks Modal Examples](https://css-tricks.com/considerations-styling-modal/)

---

## ✅ Your Assignment

### Task 1: Create the Basic Popup Structure
1. Add the HTML structure for the popup
2. Add basic CSS styling
3. Test that it appears/disappears

### Task 2: Connect One Team
1. Pick one team (start with Ladders)
2. Add the `onclick` to the card
3. Create the content for that team
4. Test it works

### Task 3: Add All Teams
1. Create content for each team
2. Connect all team cards
3. Test each one

### Task 4: Polish and Customize
1. Add your own styling touches
2. Add animations if you want
3. Make sure it's mobile-friendly
4. Test everything thoroughly

---

## 💡 Tips for Success

1. **Start Simple** - Get one popup working first, then add the rest
2. **Test Often** - Check your work in the browser frequently
3. **Use Browser DevTools** - Right-click → Inspect to see what's happening
4. **Copy and Modify** - Use the Ladders popup as a template for others
5. **Ask Questions** - If you're stuck, ask for help!
6. **Be Creative** - Add your own touches to make it unique

---

## 🐛 Debugging Tips

### Use Console.log()

Add this to see what's happening:

```javascript
function openTeamPopup(teamName) {
    console.log('Opening popup for:', teamName);
    // ... rest of code
}
```

### Check Browser Console

1. Press `F12` (or right-click → Inspect)
2. Go to "Console" tab
3. Look for errors (they'll be in red)

### Inspect Elements

1. Right-click on the popup
2. Select "Inspect"
3. See what CSS is applied
4. Check if classes are added correctly

---

## 📝 Checklist

Before you're done, make sure:

- [ ] Popup HTML structure is added
- [ ] CSS styles are added and working
- [ ] JavaScript functions are created
- [ ] At least one team card opens a popup
- [ ] Close button works
- [ ] Overlay click closes popup
- [ ] Escape key closes popup
- [ ] Content displays correctly
- [ ] Works on mobile
- [ ] All teams have popups
- [ ] No console errors
- [ ] Looks good and matches website style

---

## 🎉 You Did It!

Once you complete this, you'll have:
- ✅ Learned how popups/modals work
- ✅ Created interactive team pages
- ✅ Improved the user experience
- ✅ Gained valuable web development skills

**Great work! Keep learning and building! 🚀**

---

## ❓ Questions to Think About

As you work, consider:
- What information is most important for each team?
- How can you make the popup engaging?
- Should the popup replace the flip card or work alongside it?
- What would make users want to learn more about each team?
- How can you make it accessible for all users?

---

**Remember:** This is a learning experience. Don't be afraid to experiment and try new things. The best way to learn is by doing! 💪

