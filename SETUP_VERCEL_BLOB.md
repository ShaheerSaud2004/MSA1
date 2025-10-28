# Vercel Blob Setup Instructions

## 🔧 Set Up Vercel Blob Storage for Email/Phone Collection

### Step 1: Add Environment Variable in Vercel

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your MSA project
3. Click **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: `vercel_blob_rw_TOdUEnPoObkpfhEo_rBxgICdtlVmTQVO9arqASdG7NhlDbU`
   - **Environments**: Check all (Production, Preview, Development)
5. Click **Save**

### Step 2: Redeploy Your Site

After adding the environment variable:
1. Go to **Deployments** tab
2. Click the ⋯ menu on the latest deployment
3. Click **Redeploy**

OR just push a new commit and it will auto-deploy.

### Step 3: Test the Setup

1. Visit your website: https://rutgersmsa.org
2. Fill out the notification signup form
3. Go to admin dashboard: https://rutgersmsa.org/admin/ihatemarketing
4. You should see the new subscription!

### Step 4: View Your Data in Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Click **Storage** → **Blob**
4. You'll see a `subscriptions/` folder with all your JSON files
5. Each file is a subscription with email/phone/timestamp

---

## ✅ What's Now Working:

- ✅ Subscriptions save to Vercel Blob (server-side storage)
- ✅ Data persists forever (won't be lost)
- ✅ You can see ALL subscriptions from ALL visitors
- ✅ Admin dashboard at `/admin/ihatemarketing`
- ✅ Export to CSV feature
- ✅ Search and filter subscriptions

## 🔒 Security

- The admin URL `/admin/ihatemarketing` is secret - don't share it!
- Only people who know the exact URL can access it
- No password needed (security through obscurity)
- All data stored securely in Vercel

---

## 📝 Your Blob Token

Your token: `vercel_blob_rw_TOdUEnPoObkpfhEo_rBxgICdtlVmTQVO9arqASdG7NhlDbU`

**Keep this private!** Don't commit it to git or share publicly.

