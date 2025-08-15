#!/bin/bash

echo "🧪 Testing Production Endpoints..."
echo ""

# Test health endpoint
echo "1️⃣ Testing Health Endpoint..."
curl -s https://menix-backtest.vercel.app/health | jq '.' 2>/dev/null || curl -s https://menix-backtest.vercel.app/health
echo ""

# Test login endpoint
echo "2️⃣ Testing Login Endpoint..."
curl -s -X POST https://menix-backtest.vercel.app/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"mohit","password":"mohit7407"}' | jq '.' 2>/dev/null || curl -s -X POST https://menix-backtest.vercel.app/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"mohit","password":"mohit7407"}'
echo ""

# Test MongoDB login endpoint
echo "3️⃣ Testing MongoDB Login Endpoint..."
curl -s -X POST https://menix-backtest.vercel.app/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"mohit","password":"mohit7407"}' | jq '.' 2>/dev/null || curl -s -X POST https://menix-backtest.vercel.app/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"mohit","password":"mohit7407"}'
echo ""

# Test tournaments endpoint
echo "4️⃣ Testing Tournaments Endpoint..."
curl -s https://menix-backtest.vercel.app/tournaments | jq '.' 2>/dev/null || curl -s https://menix-backtest.vercel.app/tournaments
echo ""

echo "✅ Testing complete!"
echo ""
echo "📝 If you see errors, check:"
echo "   1. Backend deployment status"
echo "   2. Environment variables in Vercel"
echo "   3. MongoDB Atlas connection"
echo "   4. CORS configuration" 