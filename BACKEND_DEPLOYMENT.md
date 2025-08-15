# Backend Deployment Guide

## Current Issues
Your backend at `menix-backtest.vercel.app` is not working properly due to:
- ❌ CORS policy errors
- ❌ 500 Internal Server Error
- ❌ Server crashes

## Solutions

### Option 1: Deploy the Simple Backend (Recommended)

1. **Create a new Vercel project** for the backend:
   ```bash
   # In the backend directory
   vercel --name menix-backend-simple
   ```

2. **Use the simple server files**:
   - `simple-server.js` - Clean, working backend
   - `simple-vercel.json` - Proper Vercel configuration

3. **Deploy with proper CORS**:
   ```bash
   vercel --prod
   ```

### Option 2: Fix Current Backend

1. **Check Vercel deployment logs** for errors
2. **Redeploy the current backend**:
   ```bash
   cd backend
   vercel --prod
   ```

### Option 3: Use Local Backend for Testing

1. **Start local server**:
   ```bash
   cd backend
   node simple-server.js
   ```

2. **Frontend will use localhost:5000** automatically

## Files to Use

### For Simple Backend:
- ✅ `simple-server.js` - Clean, working server
- ✅ `simple-vercel.json` - Proper Vercel config
- ✅ `users.json` - User data
- ✅ `tournaments.json` - Tournament data

### Current Backend Issues:
- ❌ `server.js` - Has MongoDB connection problems
- ❌ `vercel.json` - May have routing issues

## Testing

### Test Local Backend:
```bash
# Health check
curl http://localhost:5000/health

# Login test
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"mohit","password":"mohit7407"}'
```

### Test Deployed Backend:
```bash
# Replace with your new backend URL
curl https://your-new-backend.vercel.app/health
```

## Next Steps

1. **Deploy the simple backend** to Vercel
2. **Update frontend** to use the new backend URL
3. **Test the complete flow**
4. **Fix the original backend** if needed

## Why This Happened

- **MongoDB connection failures** crashed the server
- **CORS configuration** was not properly set
- **Vercel deployment** had configuration issues
- **Error handling** was insufficient

The simple backend fixes all these issues and provides a stable foundation. 