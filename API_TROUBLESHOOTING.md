# API Troubleshooting Guide

## 🔧 Common Issues and Fixes

### Issue: 405 Method Not Allowed

**Symptoms:**
- Console shows "405 (Method Not Allowed)" error
- Login/Signup fails with server error

**Causes:**
1. API route not accessible (not running `vercel dev`)
2. Wrong HTTP method being sent
3. CORS preflight failing

**Solutions:**

#### 1. Make sure Vercel Dev Server is Running

```bash
# In the project root
vercel dev
```

Or:
```bash
npm run dev
```

**Important:** API routes only work when Vercel dev server is running locally!

#### 2. Check API Route Structure

API routes must be in `/api/` folder at root:
```
/api/auth/login.js  ✅ Correct
/community/api/...  ❌ Wrong
```

#### 3. Use Absolute Paths

Always use absolute paths starting with `/api/`:
```javascript
fetch('/api/auth/login', {...})  ✅ Correct
fetch('../api/auth/login', {...})  ❌ May not work
```

#### 4. Check Browser Console

Open DevTools (F12) and check:
- Network tab: See actual request/response
- Console tab: See error messages
- Look for CORS errors or 405 errors

---

## 🧪 Testing the API

### Test 1: Check if API is Running

Visit in browser:
```
http://localhost:3000/api/auth/login
```

Should return: `{"error":"Method not allowed"}` (because it's a GET, not POST)

### Test 2: Test with curl

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test1234"}'
```

### Test 3: Use Test Page

Visit: `/community/test-api.html`

---

## 🚀 Quick Fix Checklist

- [ ] Is `vercel dev` running?
- [ ] Are you using absolute paths (`/api/...`)?
- [ ] Check browser console for errors
- [ ] Check Network tab in DevTools
- [ ] Verify API files exist in `/api/auth/` folder
- [ ] Try the test page: `/community/test-api.html`

---

## 📝 Expected Behavior

### When API Works:
- Console: "Calling API: /api/auth/login"
- Console: "Response status: 200" (or 401 for wrong password)
- Success message appears
- Redirects to dashboard

### When API Doesn't Work:
- Console: "Failed to fetch" or "405 Method Not Allowed"
- Error message appears
- No redirect

---

## 🔍 Debug Steps

1. **Check if server is running:**
   ```bash
   # Should see Vercel dev server output
   vercel dev
   ```

2. **Check API file exists:**
   ```bash
   ls api/auth/login.js
   ```

3. **Check browser Network tab:**
   - Open DevTools → Network tab
   - Try to login
   - Look for `/api/auth/login` request
   - Check status code and response

4. **Check console logs:**
   - Should see "Calling API: /api/auth/login"
   - Should see "Response status: XXX"

---

## 💡 Pro Tips

1. **Always run `vercel dev` when testing locally**
2. **Use absolute paths** (`/api/...` not `../api/...`)
3. **Check Network tab** to see actual HTTP requests
4. **Check console** for detailed error messages
5. **Test with curl** to isolate frontend vs backend issues

---

## 🆘 Still Not Working?

1. Restart `vercel dev` server
2. Clear browser cache
3. Check Vercel Blob Storage is configured
4. Verify environment variables are set
5. Check `vercel.json` configuration

---

**Need more help?** Check the console logs and Network tab for specific error messages!

