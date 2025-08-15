# 🚀 Menix Backend - Backtest Version

This is a **clean, working backend** that fixes all the 500 errors and CORS issues from your current deployment.

## ✅ What This Fixes:

- ❌ **No more 500 Internal Server Error**
- ❌ **No more CORS policy blocked**
- ❌ **No more MongoDB connection failures**
- ❌ **No more server crashes**

## 🚀 Quick Deployment:

### **Step 1: Deploy to Vercel**

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import your GitHub repo** or create new
4. **Name it:** `menix-backend-working`

### **Step 2: Upload These Files**

```
backend/backtest/
├── server.js          ← Working backend server
├── vercel.json        ← Vercel configuration
├── package.json       ← Dependencies
└── README.md          ← This file
```

### **Step 3: Deploy**

```bash
cd backend/backtest
vercel --prod
```

## 🔧 How It Works:

- **No MongoDB dependency** → Server starts immediately
- **Proper CORS headers** → Frontend can connect
- **JSON file storage** → Data persists without database
- **Error handling** → Graceful failures

## 📡 Endpoints Available:

- `POST /login` - User authentication
- `POST /register` - User registration  
- `GET /tournaments` - Get tournaments
- `GET /user/:id` - Get user by ID
- `GET /health` - Health check
- `GET /test` - Test endpoint

## 🧪 Test Your Backend:

```bash
# Health check
curl https://your-new-backend.vercel.app/health

# Test endpoint
curl https://your-new-backend.vercel.app/test

# Login test
curl -X POST https://your-new-backend.vercel.app/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"mohit","password":"mohit7407"}'
```

## 🔄 Update Frontend:

After deploying, update your frontend to use the new backend URL:

```javascript
// In Login.jsx, change this line:
const res = await fetch('https://your-new-backend.vercel.app/login', {
```

## 🎯 Expected Results:

- ✅ **Login page works** without errors
- ✅ **No CORS issues**
- ✅ **Proper error messages**
- ✅ **Stable backend** that doesn't crash

## 📁 File Structure:

```
backend/backtest/
├── server.js          ← Main server file
├── vercel.json        ← Vercel deployment config
├── package.json       ← Node.js dependencies
└── README.md          ← This documentation
```

## 🚨 Important Notes:

- **This backend uses JSON files** for data storage
- **No database required** - works immediately
- **CORS configured** for `https://menix.vercel.app`
- **Error handling** prevents crashes

## 🔗 Next Steps:

1. **Deploy this backend** to Vercel
2. **Test all endpoints** work correctly
3. **Update frontend** with new backend URL
4. **Deploy frontend** to Vercel
5. **Test complete flow** - login should work!

---

**This will fix your login page immediately!** 🎉 