#!/bin/bash

# Azure Static Web Apps Deployment Script for Math Practice App
# This script will build the Angular app and prepare it for Azure deployment

echo "🚀 Starting Azure deployment process..."

# Check if Angular CLI is installed
if ! command -v ng &> /dev/null; then
    echo "❌ Angular CLI not found. Installing..."
    npm install -g @angular/cli
fi

# Check if Azure Static Web Apps CLI is installed
if ! command -v swa &> /dev/null; then
    echo "📦 Installing Azure Static Web Apps CLI..."
    npm install -g @azure/static-web-apps-cli
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application for production
echo "🔨 Building Angular application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build output location: dist/student/browser"
    echo ""
    echo "🌐 Ready for Azure Static Web Apps deployment!"
    echo ""
    echo "Manual deployment options:"
    echo "1. Create Azure Static Web App in portal (recommended)"
    echo "2. Or use SWA CLI with deployment token:"
    echo "   swa deploy ./dist/student/browser --deployment-token YOUR_TOKEN"
    echo ""
    echo "For GitHub Actions deployment:"
    echo "- The deployment token in GitHub secrets needs to match an existing Azure resource"
    echo "- Current token: AZURE_STATIC_WEB_APPS_API_TOKEN_JOLLY_SEA_0927A0F10"
    echo "- Check Azure Portal for the correct resource or create a new one"
    echo ""
    echo "Files ready for deployment:"
    ls -la dist/student/browser/
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
