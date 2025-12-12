# Quick Login Guide - Local Testing

## 🎯 Test User Credentials

```
Email: test@rutgers.edu
Password: test1234
```

---

## 🚀 Quick Steps to Login Locally

### Step 1: Make Sure Server is Running

Open terminal and run:
```bash
vercel dev
```

Wait for: `Ready! Available at http://localhost:3000`

### Step 2: Create Test User (If Needed)

**Option A: Use the Helper Page**
1. Go to: `http://localhost:3000/create-test-user-simple.html`
2. Click "Create Test User" button
3. Wait for success message

**Option B: Sign Up Manually**
1. Go to: `http://localhost:3000/community/`
2. Click "Sign Up" tab
3. Enter:
   - Email: `test@rutgers.edu`
   - Password: `test1234`
   - First Name: Test
   - Last Name: User
   - Year: Any
   - Major: Any
4. Click "Create Account"

### Step 3: Login

1. Go to: `http://localhost:3000/community/`
2. Click "Login" tab
3. Enter:
   - Email: `test@rutgers.edu`
   - Password: `test1234`
4. Click "Login"
5. Should redirect to dashboard!

---

## 🐛 Troubleshooting

### "Network error" or "Cannot connect to server"
- **Fix:** Make sure `vercel dev` is running
- Check terminal for "Ready! Available at http://localhost:3000"

### "Invalid email or password"
- **Fix:** The test user doesn't exist yet
- Create it using one of the methods above

### "405 Method Not Allowed"
- **Fix:** API routes aren't accessible
- Make sure you're using `vercel dev` (not just opening HTML files)
- The API only works when Vercel dev server is running

### Still not working?
1. Check browser console (F12) for errors
2. Check Network tab to see API requests
3. Make sure you're accessing via `http://localhost:3000` (not `file://`)

---

## ✅ Quick Test

1. **Check server:** Visit `http://localhost:3000/api/test`
   - Should return JSON with `"success": true`

2. **Create user:** Visit `http://localhost:3000/create-test-user-simple.html`
   - Click button to create test user

3. **Login:** Go to `http://localhost:3000/community/`
   - Use credentials above

---

**Remember:** The API only works when `vercel dev` is running! 🚀

