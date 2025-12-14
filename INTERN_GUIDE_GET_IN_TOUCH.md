# Intern Guide: Updating the "Get In Touch" Section

## 📋 Overview
This guide will teach you how to update the "Get In Touch" section on the Rutgers MSA website. You'll learn how to change text, add examples, and make the section more inviting.

---

## 🎯 What We're Changing

**Before:**
- Simple text: "You can contact us on Instagram"
- No examples of what people can contact about

**After:**
- More inviting: "DM @rutgersmsa for contact!"
- Examples of what people can reach out for:
  - Partnerships & Sponsorships (Ramadan, events)
  - Questions & Concerns
  - Event Inquiries

---

## 📁 Step 1: Find the File

1. **Open your code editor** (VS Code, Sublime Text, or any text editor)
2. **Navigate to the project folder**: `MSA_web_website`
3. **Open the file**: `index.html`
   - This is the main homepage file

---

## 🔍 Step 2: Locate the Contact Section

1. **In `index.html`, press `Ctrl+F` (or `Cmd+F` on Mac)** to open the search box
2. **Search for**: `Get In Touch`
3. **You should see something like this** (around line 1183):

```html
<h2 class="section-title">Get In Touch</h2>
<p class="section-subtitle">You can contact us on Instagram</p>
```

**This is the section we're updating!**

---

## ✏️ Step 3: Understanding HTML Basics

Before we make changes, let's understand what we're looking at:

### HTML Tags Explained:
- `<h2>` = Heading (title)
- `<p>` = Paragraph (regular text)
- `<div>` = Container/box
- `<a>` = Link
- `class="something"` = CSS styling name
- `style="..."` = Inline styling

### What Each Part Does:
```html
<p class="section-subtitle">You can contact us on Instagram</p>
```
- `<p>` = This is a paragraph
- `class="section-subtitle"` = This text uses the "section-subtitle" style
- `You can contact us on Instagram` = The actual text you see on the website

---

## 🛠️ Step 4: Making the Changes

### Change 1: Update the Subtitle Text

**Find this line:**
```html
<p class="section-subtitle">You can contact us on Instagram</p>
```

**Replace it with:**
```html
<p class="section-subtitle">DM <a href="https://instagram.com/rutgersmsa" target="_blank" style="color: #2c5530; text-decoration: none; font-weight: 600;">@rutgersmsa</a> for contact!</p>
```

**What changed?**
- Text is now more inviting: "DM @rutgersmsa for contact!"
- The `@rutgersmsa` is now a clickable link (the `<a>` tag)
- `target="_blank"` opens the link in a new tab
- `style="..."` makes it green and bold

---

### Change 2: Add Description Text

**After the subtitle, add this new paragraph:**

```html
<p style="text-align: center; color: #666; margin-top: 1rem; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.8;">
    Have questions, concerns, or want to work with us? We'd love to hear from you! 
    Reach out to us on Instagram for:
</p>
```

**What this does:**
- Adds friendly, inviting text
- Centers the text
- Makes it gray (`color: #666`)
- Limits width so it's not too wide

---

### Change 3: Add Example Boxes

**After the description, add this section:**

```html
<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; margin: 2rem 0; max-width: 700px; margin-left: auto; margin-right: auto;">
    <div style="background: rgba(44, 85, 48, 0.05); padding: 1rem 1.5rem; border-radius: 12px; border-left: 3px solid #2c5530;">
        <strong style="color: #2c5530; display: block; margin-bottom: 0.5rem;">🤝 Partnerships & Sponsorships</strong>
        <p style="margin: 0; color: #666; font-size: 0.95rem;">Ramadan sponsorships, event partnerships, and collaborations</p>
    </div>
    <div style="background: rgba(44, 85, 48, 0.05); padding: 1rem 1.5rem; border-radius: 12px; border-left: 3px solid #2c5530;">
        <strong style="color: #2c5530; display: block; margin-bottom: 0.5rem;">❓ Questions & Concerns</strong>
        <p style="margin: 0; color: #666; font-size: 0.95rem;">General inquiries, feedback, or any questions you may have</p>
    </div>
    <div style="background: rgba(44, 85, 48, 0.05); padding: 1rem 1.5rem; border-radius: 12px; border-left: 3px solid #2c5530;">
        <strong style="color: #2c5530; display: block; margin-bottom: 0.5rem;">🎉 Event Inquiries</strong>
        <p style="margin: 0; color: #666; font-size: 0.95rem;">Questions about upcoming events, RSVPs, or event suggestions</p>
    </div>
</div>
```

**What this creates:**
- Three boxes side-by-side (on desktop)
- Each box has:
  - An emoji icon
  - A bold title
  - A description
  - Light green background
  - Green left border

**The boxes will stack on mobile automatically!**

---

## 📝 Step 5: Complete Code Example

Here's what the **entire updated section** should look like:

```html
<h2 class="section-title">Get In Touch</h2>
<p class="section-subtitle">DM <a href="https://instagram.com/rutgersmsa" target="_blank" style="color: #2c5530; text-decoration: none; font-weight: 600;">@rutgersmsa</a> for contact!</p>
<p style="text-align: center; color: #666; margin-top: 1rem; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.8;">
    Have questions, concerns, or want to work with us? We'd love to hear from you! 
    Reach out to us on Instagram for:
</p>
<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; margin: 2rem 0; max-width: 700px; margin-left: auto; margin-right: auto;">
    <div style="background: rgba(44, 85, 48, 0.05); padding: 1rem 1.5rem; border-radius: 12px; border-left: 3px solid #2c5530;">
        <strong style="color: #2c5530; display: block; margin-bottom: 0.5rem;">🤝 Partnerships & Sponsorships</strong>
        <p style="margin: 0; color: #666; font-size: 0.95rem;">Ramadan sponsorships, event partnerships, and collaborations</p>
    </div>
    <div style="background: rgba(44, 85, 48, 0.05); padding: 1rem 1.5rem; border-radius: 12px; border-left: 3px solid #2c5530;">
        <strong style="color: #2c5530; display: block; margin-bottom: 0.5rem;">❓ Questions & Concerns</strong>
        <p style="margin: 0; color: #666; font-size: 0.95rem;">General inquiries, feedback, or any questions you may have</p>
    </div>
    <div style="background: rgba(44, 85, 48, 0.05); padding: 1rem 1.5rem; border-radius: 12px; border-left: 3px solid #2c5530;">
        <strong style="color: #2c5530; display: block; margin-bottom: 0.5rem;">🎉 Event Inquiries</strong>
        <p style="margin: 0; color: #666; font-size: 0.95rem;">Questions about upcoming events, RSVPs, or event suggestions</p>
    </div>
</div>
```

---

## 🧪 Step 6: Testing Your Changes

### Option A: Using a Local Server (Recommended)

1. **Install a simple server** (if you don't have one):
   ```bash
   # If you have Python installed:
   python -m http.server 8000
   
   # Or if you have Node.js:
   npx http-server
   ```

2. **Open your browser** and go to: `http://localhost:8000`

3. **Scroll down** to the "Get In Touch" section

4. **Check that:**
   - The subtitle says "DM @rutgersmsa for contact!"
   - The @rutgersmsa link is clickable and green
   - You see the description text
   - You see three boxes with examples
   - Everything looks good on mobile (resize your browser window)

### Option B: Opening Directly in Browser

1. **Right-click on `index.html`**
2. **Select "Open with" → Your web browser**
3. **Scroll to the contact section**
4. **Note:** Some features might not work perfectly this way, but you can see the basic layout

---

## 🎨 Step 7: Customizing (Optional)

Want to change the text or add more examples? Here's how:

### Changing the Text in Boxes

**Find this part:**
```html
<strong>🤝 Partnerships & Sponsorships</strong>
<p>Ramadan sponsorships, event partnerships, and collaborations</p>
```

**Change it to whatever you want:**
```html
<strong>💼 Business Inquiries</strong>
<p>Want to partner with us? Let's talk!</p>
```

### Adding More Boxes

**Copy one of the `<div>` boxes and paste it inside the container:**

```html
<div style="background: rgba(44, 85, 48, 0.05); padding: 1rem 1.5rem; border-radius: 12px; border-left: 3px solid #2c5530;">
    <strong style="color: #2c5530; display: block; margin-bottom: 0.5rem;">✨ Your New Example</strong>
    <p style="margin: 0; color: #666; font-size: 0.95rem;">Your description here</p>
</div>
```

### Changing Colors

**The green color is:** `#2c5530`

**To change it, find all instances of `#2c5530` and replace with your color:**
- Blue: `#0066cc`
- Purple: `#6b46c1`
- Red: `#dc2626`

---

## ✅ Step 8: Saving and Committing

### Save Your Work

1. **Press `Ctrl+S` (or `Cmd+S` on Mac)** to save the file
2. **Make sure you saved `index.html`**

### If Using Git (Optional)

If the project uses Git, you can commit your changes:

```bash
git add index.html
git commit -m "Update Get In Touch section with more inviting text and examples"
git push
```

**Ask your supervisor before pushing if you're not sure!**

---

## 🐛 Common Issues & Solutions

### Issue 1: Changes Don't Show Up
**Solution:**
- Make sure you saved the file (`Ctrl+S`)
- Refresh your browser (`Ctrl+R` or `F5`)
- Try hard refresh (`Ctrl+Shift+R` or `Cmd+Shift+R`)

### Issue 2: Boxes Look Weird
**Solution:**
- Check that you copied all the code correctly
- Make sure all `<div>` tags are properly closed with `</div>`
- Check for typos in the `style` attributes

### Issue 3: Link Doesn't Work
**Solution:**
- Make sure the link is: `https://instagram.com/rutgersmsa`
- Check that `target="_blank"` is included
- Make sure the `<a>` tag is properly closed with `</a>`

### Issue 4: Text is Too Wide or Too Narrow
**Solution:**
- Adjust `max-width: 600px` to a different value
- Try `max-width: 500px` for narrower
- Try `max-width: 800px` for wider

---

## 📚 Learning Resources

### HTML Basics
- [MDN HTML Tutorial](https://developer.mozilla.org/en-US/docs/Learn/HTML)
- [W3Schools HTML](https://www.w3schools.com/html/)

### CSS Basics (for styling)
- [MDN CSS Tutorial](https://developer.mozilla.org/en-US/docs/Learn/CSS)
- [W3Schools CSS](https://www.w3schools.com/css/)

### VS Code (Code Editor)
- [VS Code Getting Started](https://code.visualstudio.com/docs/getstarted/introvideos)

---

## 🎓 What You Learned

After completing this guide, you now know how to:

✅ Find and edit HTML files  
✅ Understand basic HTML structure  
✅ Change text content  
✅ Add links  
✅ Create styled boxes/containers  
✅ Use inline CSS styling  
✅ Test your changes  
✅ Customize content  

---

## 💡 Next Steps

Once you're comfortable with this, you can try:

1. **Update other sections** - Try changing text in other parts of the website
2. **Add more examples** - Add more boxes to the contact section
3. **Change colors** - Experiment with different color schemes
4. **Learn CSS** - Move styles to a separate CSS file for better organization

---

## ❓ Questions?

If you get stuck:
1. **Check the code** - Make sure everything is spelled correctly
2. **Compare with the example** - Use the complete code example as reference
3. **Ask for help** - Don't hesitate to ask your supervisor or team members
4. **Test in browser** - See what the browser shows you (right-click → Inspect)

---

## 📝 Checklist

Before you're done, make sure:

- [ ] You found the "Get In Touch" section in `index.html`
- [ ] You updated the subtitle text
- [ ] You added the description paragraph
- [ ] You added the three example boxes
- [ ] You tested it in a browser
- [ ] Everything looks good on desktop
- [ ] Everything looks good on mobile (resize browser)
- [ ] The Instagram link works
- [ ] You saved the file

---

**Great job! You've successfully updated the website! 🎉**

