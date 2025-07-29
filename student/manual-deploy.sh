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

echo "� Validating deployment token..."
echo "Token format: ${DEPLOYMENT_TOKEN:0:10}..." # Show only first 10 chars for security

# Check token length (Azure SWA tokens are typically 40+ characters)
if [ ${#DEPLOYMENT_TOKEN} -lt 40 ]; then
    echo "❌ Error: Token appears too short (${#DEPLOYMENT_TOKEN} characters)"
    echo "Azure Static Web App tokens are typically 40+ characters long"
    exit 1
fi

# Test token validity with a simple API call
echo "🧪 Testing token validity..."
TEST_RESPONSE=$(npx @azure/static-web-apps-cli deploy --dry-run ./dist/student/browser --deployment-token "$DEPLOYMENT_TOKEN" 2>&1)
if echo "$TEST_RESPONSE" | grep -q "No matching Static Web App was found"; then
    echo "❌ Error: Token validation failed"
    echo "Reason: No matching Static Web App was found or the token is invalid"
    echo ""
    echo "Please verify:"
    echo "1. Azure Static Web App resource exists"
    echo "2. Token is copied correctly from Azure Portal"
    echo "3. Token hasn't expired or been regenerated"
    echo ""
    echo "To get the correct token:"
    echo "• Go to Azure Portal → Your Static Web App → Overview → 'Manage deployment token'"
    exit 1
elif echo "$TEST_RESPONSE" | grep -q "error\|Error\|failed\|Failed"; then
    echo "⚠️  Warning: Token test returned errors, but continuing..."
    echo "Test response: $TEST_RESPONSE"
else
    echo "✅ Token validation passed!"
fi

echo ""
echo "�🔨 Ensuring build is up to date..."
npm run build

echo ""
echo "📤 Deploying to Azure Static Web Apps..."
echo "Using validated token: ${DEPLOYMENT_TOKEN:0:10}..." # Show only first 10 chars for security

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
