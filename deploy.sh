#!/bin/bash

echo "🚀 Deploying Menix BGMI Tournament App to Vercel..."

echo "📦 Installing dependencies..."
npm install

echo "🔧 Building frontend..."
npm run build

echo "🌐 Deploying backend to Vercel..."
cd backend
vercel --prod --yes

echo "🎨 Deploying frontend to Vercel..."
cd ..
vercel --prod --yes

echo "✅ Deployment complete!"
echo ""
echo "🔗 Backend URL: https://menix-backtest.vercel.app"
echo "🔗 Frontend URL: https://menix.vercel.app"
echo ""
echo "📝 Don't forget to:"
echo "   1. Set MONGODB_URI environment variable in Vercel"
echo "   2. Update frontend API URLs if needed"
echo "   3. Test the login functionality" 