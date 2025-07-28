# Azure Deployment Guide

This document explains how to deploy the Angular Math Practice App to Azure Static Web Apps.

## Deployment Methods

### Method 1: GitHub Actions (Recommended)

The repository includes a GitHub Actions workflow that automatically deploys to Azure when you push to the main branch.

#### Setup Steps:

1. **Create Azure Static Web App**
   - Go to [Azure Portal](https://portal.azure.com)
   - Create a new "Static Web App" resource
   - Choose "GitHub" as the source
   - Connect to your repository: `catchnthrow/JustKidding`
   - Set build configuration:
     - **App location**: `/student`
     - **Output location**: `dist/student/browser`
     - **Build command**: `npm run build`

2. **Configure Repository Secrets**
   - Azure will automatically add the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret to your GitHub repository
   - The workflow will run automatically on every push to main

3. **Automatic Deployment**
   - Every push to the main branch triggers deployment
   - Pull requests create preview deployments
   - Build status is shown in GitHub

### Method 2: Azure Static Web Apps CLI

For manual deployment:

1. **Install Azure SWA CLI**
   ```bash
   npm install -g @azure/static-web-apps-cli
   ```

2. **Build the Application**
   ```bash
   cd student
   npm install
   npm run build
   ```

3. **Deploy**
   ```bash
   swa deploy ./dist/student/browser --deployment-token YOUR_DEPLOYMENT_TOKEN
   ```

### Method 3: Using the Deployment Script

Run the included deployment script:

```bash
cd student
./deploy-azure.sh
```

## Configuration Files

### `staticwebapp.config.json`
- Configures routing for Single Page Application
- Handles fallback to index.html for Angular routes
- Sets up error pages and platform configuration

### `.github/workflows/azure-static-web-apps.yml`
- GitHub Actions workflow for automatic deployment
- Builds and deploys on push to main branch
- Creates preview deployments for pull requests

## Build Configuration

- **Framework**: Angular 20+
- **Build Command**: `npm run build`
- **Output Directory**: `dist/student/browser`
- **Node Version**: 18+
- **Package Manager**: npm

## Features Deployed

✅ **Homepage with Chapter Navigation**  
✅ **Addition Practice (25 questions)**  
✅ **Making 10 Practice (25 questions)**  
✅ **Auto-advance after 1 second**  
✅ **Celebration effects for high scores**  
✅ **Mobile-responsive design**  
✅ **Server-Side Rendering (SSR) compatible**  
✅ **Lazy loading for performance**  

## Post-Deployment

After deployment, your app will be available at:
- Production: `https://YOUR-APP-NAME.azurestaticapps.net`
- Custom domain can be configured in Azure Portal

## Monitoring

- View deployment logs in Azure Portal
- Monitor performance and usage analytics
- Set up alerts for failures or performance issues

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check Node.js version (use 18+)
   - Verify package.json dependencies
   - Review build logs in Azure Portal

2. **Routing Issues**
   - Ensure `staticwebapp.config.json` is in the root
   - Check fallback routes configuration

3. **Performance**
   - Use Angular's lazy loading (already implemented)
   - Enable compression in Azure (automatic)
   - Monitor Core Web Vitals

## Cost

Azure Static Web Apps offers:
- **Free tier**: 100GB bandwidth, 0.5GB storage
- **Standard tier**: Additional features for production apps
- Perfect for this math practice application

## Security

- HTTPS enabled by default
- Custom domains with SSL certificates
- No server maintenance required
- Automatic security updates
