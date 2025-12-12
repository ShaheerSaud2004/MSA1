# Test Login Credentials

## 🎯 Quick Test Account

Use these credentials to log in to the community section:

### Login Credentials
```
Email: test@rutgers.edu
Password: test1234
```

---

## 🚀 How to Use

### Option 1: Use Existing Test Account
1. Go to `/community/` or click "Community" button on main site
2. Click "Login" tab
3. Enter:
   - **Email**: `test@rutgers.edu`
   - **Password**: `test1234`
4. Click "Login"
5. You'll be redirected to the dashboard!

### Option 2: Create Your Own Account
1. Go to `/community/`
2. Click "Sign Up" tab
3. Fill in the form with any information
4. Use any email (e.g., `yourname@rutgers.edu`)
5. Password must be at least 8 characters
6. Click "Create Account"
7. You'll be redirected to dashboard!

---

## 🔧 Create Test User (If Needed)

If the test account doesn't exist yet, you can create it by:

### Method 1: Use Seed Endpoint
Visit this URL in your browser (after deploying):
```
https://your-domain.vercel.app/api/auth/seed-test-user
```

Or run locally:
```bash
curl http://localhost:3000/api/auth/seed-test-user
```

### Method 2: Sign Up Manually
Just use the signup form with:
- Email: `test@rutgers.edu`
- Password: `test1234`
- Any other info you want

---

## 📝 Test User Details

The test account includes:
- **Name**: Test User
- **Year**: Sophomore
- **Major**: Computer Science
- **Email**: test@rutgers.edu
- **Bio**: "This is a test account for development"

---

## 🎨 What You'll See After Login

Once logged in, you'll see:
- ✅ Community Dashboard
- ✅ Activity Feed Preview
- ✅ Quick Actions
- ✅ Upcoming Events
- ✅ Prayer Times Widget
- ✅ Suggested Friends
- ✅ Trending Topics

---

## 🔄 Reset/Recreate Test User

If you need to reset the test user:
1. Delete the user file from Vercel Blob Storage (if you have access)
2. Or visit the seed endpoint again
3. Or just sign up with a different email

---

## 💡 Tips

- **First time?** Just sign up with any email - it's the easiest way!
- **Forgot password?** Currently no reset feature (coming soon)
- **Multiple accounts?** You can create as many as you want!

---

## 🐛 Troubleshooting

### "Invalid email or password"
- Make sure you're using: `test@rutgers.edu` / `test1234`
- Or create a new account via signup

### "Network error"
- Check that Vercel Blob Storage is configured
- Verify API routes are deployed
- Check browser console for errors

### Can't see dashboard
- Make sure you're logged in (check localStorage)
- Try logging out and back in
- Clear browser cache if needed

---

**Ready to test!** Use the credentials above or create your own account. 🚀

