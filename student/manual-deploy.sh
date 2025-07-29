#!/bin/bash

# Manual Azure Static Web Apps Deployment
# Run this script after creating an Azure Static Web App and getting the deployment token

echo "🚀 Manual Azure Static Web Apps Deployment"
echo ""

# Check if deployment token is provided
if [ -z "$1" ]; then
    echo "❌ Error: Deployment token required"
    echo ""
    echo "Usage: ./manual-deploy.sh YOUR_DEPLOYMENT_TOKEN"
    echo ""
    echo "To get your deployment token:"
    echo "1. Go to Azure Portal: https://portal.azure.com"
    echo "2. Find your Static Web App resource"
    echo "3. Go to 'Overview' → 'Manage deployment token'"
    echo "4. Copy the deployment token"
    echo ""
    echo "Example:"
    echo "  ./manual-deploy.sh 12345678901234567890123456789012345678901234567890"
    exit 1
fi

DEPLOYMENT_TOKEN=$1

echo "🔨 Ensuring build is up to date..."
npm run build

echo ""
echo "📤 Deploying to Azure Static Web Apps..."
echo "Using token: ${DEPLOYMENT_TOKEN:0:10}..." # Show only first 10 chars for security

npx @azure/static-web-apps-cli deploy \
    ./dist/student/browser \
    --deployment-token "$DEPLOYMENT_TOKEN" \
    --env production

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo "🌐 Your math practice app should be live on Azure!"
else
    echo ""
    echo "❌ Deployment failed. Please check:"
    echo "1. Deployment token is correct"
    echo "2. Azure Static Web App resource exists"
    echo "3. Network connectivity"
fi
