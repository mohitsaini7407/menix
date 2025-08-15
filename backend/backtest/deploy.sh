#!/bin/bash

echo "🚀 Deploying Menix Backend - Backtest Version"
echo "=============================================="

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📁 Current directory: $(pwd)"
echo "📋 Files to deploy:"
ls -la

echo ""
echo "🔧 Deploying to Vercel..."
echo "📝 Project name: menix-backend-working"
echo "🌐 Environment: Production"
echo ""

# Deploy to Vercel
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "🔗 Your backend URL will be shown above"
echo ""
echo "🧪 Test your backend:"
echo "   curl https://your-backend-url.vercel.app/health"
echo "   curl https://your-backend-url.vercel.app/test"
echo ""
echo "📱 Update your frontend with the new backend URL"
echo "🎯 Login page should work immediately!" 