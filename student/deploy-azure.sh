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
    echo "Next steps:"
    echo "1. Create an Azure Static Web App resource in Azure Portal"
    echo "2. Connect it to your GitHub repository"
    echo "3. Configure build settings:"
    echo "   - App location: /student"
    echo "   - Output location: dist/student/browser"
    echo "   - Build command: npm run build"
    echo ""
    echo "Or deploy manually with:"
    echo "swa deploy ./dist/student/browser --deployment-token YOUR_DEPLOYMENT_TOKEN"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
