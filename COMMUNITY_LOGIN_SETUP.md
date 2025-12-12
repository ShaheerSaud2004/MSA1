# Community Login System - Setup Guide

## ✅ What's Been Set Up

A complete authentication system with:
- **Login API** (`/api/auth/login.js`)
- **Signup API** (`/api/auth/signup.js`)
- **Auth Check API** (`/api/auth/check.js`)
- **Frontend integration** (updated `community.js`)

---

## 🔐 How It Works

### Signup Flow
1. User fills out signup form
2. Frontend sends data to `/api/auth/signup`
3. API creates user file in Vercel Blob Storage (`users/user_id.json`)
4. Returns user data + session token
5. Frontend stores session in localStorage
6. Redirects to dashboard

### Login Flow
1. User enters email/password
2. Frontend sends to `/api/auth/login`
3. API searches for user by email in Blob Storage
4. Validates password
5. Returns user data + session token
6. Frontend stores session
7. Redirects to dashboard

### Session Management
- Token stored in localStorage
- Expires after 24 hours
- Auto-redirects if expired

---

## 🚀 Testing the Login

### Test Account (Create via Signup)
1. Go to `/community/`
2. Click "Sign Up" tab
3. Fill in:
   - First Name: Test
   - Last Name: User
   - Email: test@rutgers.edu
   - Password: test1234
   - Year: Freshman
   - Major: Computer Science
4. Click "Create Account"
5. Should redirect to dashboard

### Login with Test Account
1. Go to `/community/`
2. Enter:
   - Email: test@rutgers.edu
   - Password: test1234
3. Click "Login"
4. Should redirect to dashboard

---

## 📁 File Structure

```
api/
├── auth/
│   ├── login.js      # Login endpoint
│   ├── signup.js     # Signup endpoint
│   └── check.js      # Auth verification
```

---

## 🔒 Security Notes

### Current Implementation (Demo)
- Passwords stored in **plain text** (NOT SECURE)
- Simple token generation
- No password hashing

### Production Upgrades Needed
1. **Password Hashing**: Use bcrypt or similar
   ```javascript
   import bcrypt from 'bcrypt';
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **JWT Tokens**: Use proper JWT for sessions
   ```javascript
   import jwt from 'jsonwebtoken';
   const token = jwt.sign({ userId }, secret, { expiresIn: '24h' });
   ```

3. **Email Verification**: Send verification emails
4. **Rate Limiting**: Prevent brute force attacks
5. **HTTPS Only**: Ensure all requests are encrypted

---

## 🛠️ Recommended: Upgrade to Supabase

For production, consider using **Supabase Auth**:

### Benefits
- ✅ Built-in password hashing
- ✅ Email verification
- ✅ Social OAuth (Google, GitHub)
- ✅ Secure session management
- ✅ Password reset flows
- ✅ User management dashboard

### Migration Path
1. Set up Supabase project
2. Replace API endpoints with Supabase client
3. Update frontend to use Supabase Auth
4. Migrate existing users (if any)

---

## 📝 API Endpoints

### POST `/api/auth/signup`
**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@rutgers.edu",
  "password": "password123",
  "year": "sophomore",
  "major": "Computer Science"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "user_123...",
    "firstName": "John",
    "email": "john@rutgers.edu",
    ...
  },
  "token": "base64_token",
  "expiresAt": 1234567890
}
```

### POST `/api/auth/login`
**Request:**
```json
{
  "email": "john@rutgers.edu",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": { ... },
  "token": "base64_token",
  "expiresAt": 1234567890
}
```

### POST `/api/auth/check`
**Request:**
```json
{
  "token": "base64_token",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "authenticated": true,
  "user": { ... }
}
```

---

## 🐛 Troubleshooting

### "Network error" on login/signup
- Check Vercel Blob Storage is configured
- Verify API routes are deployed
- Check browser console for errors

### "User not found" on login
- User might not exist - try signing up first
- Check email is correct (case-insensitive)

### Session expires immediately
- Check `expiresAt` is being set correctly
- Verify localStorage is working

### Redirect not working
- Check `dashboard.html` exists
- Verify path is correct (`dashboard.html` not `/dashboard.html`)

---

## 🎯 Next Steps

1. **Test the login** - Create an account and log in
2. **Add password hashing** - Upgrade security
3. **Add email verification** - Verify user emails
4. **Add password reset** - Allow password recovery
5. **Upgrade to Supabase** - For production-ready auth

---

## 💡 Quick Test

Run this in browser console after signing up:
```javascript
// Check stored user
console.log(localStorage.getItem('msa_user'));

// Check if logged in
const user = JSON.parse(localStorage.getItem('msa_user') || '{}');
console.log('Logged in:', user.loggedIn);
```

---

**Login system is ready!** Test it out and let me know if you need any adjustments. 🚀

