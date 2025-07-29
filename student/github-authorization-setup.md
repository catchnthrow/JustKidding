# 🚀 Azure Static Web Apps with GitHub Authorization

## 🎯 GitHub Authorization vs Token-Based Deployment

### **GitHub Authorization (Recommended)**
- ✅ More secure (no tokens to manage)
- ✅ Uses GitHub's built-in authentication
- ✅ Automatic permission management
- ✅ No token expiration issues
- ✅ Cleaner workflow setup

### **Token-Based (Old Method)**
- ❌ Manual token management
- ❌ Tokens can expire
- ❌ Security risk if tokens leak
- ❌ More complex setup

## 🔧 Setup Steps with GitHub Authorization

### **Step 1: Create Azure Static Web App**

1. **Azure Portal**: https://portal.azure.com
2. **Create Resource** → Search "Static Web App" → Create
3. **Basic Settings**:
   - Name: `justkidding-math-app`
   - Plan: **Free**
   - Region: (any available)

### **Step 2: Choose GitHub Authorization**

4. **Deployment Details**:
   - **Source**: GitHub
   - **Authorization**: **Choose "GitHub" instead of "GitHub Actions"**
   - Sign in to GitHub when prompted
   - **Organization**: `catchnthrow`
   - **Repository**: `JustKidding`
   - **Branch**: `prod`

### **Step 3: Build Configuration**

5. **Build Details**:
   - **Build Presets**: Angular
   - **App location**: `/student`
   - **API location**: (leave empty)
   - **Output location**: `dist/student/browser`

### **Step 4: Review and Create**

6. Click **Review + Create** → **Create**

## 🎉 What Happens Automatically

When you use GitHub authorization, Azure will:

1. ✅ **Request GitHub permissions** for your repository
2. ✅ **Create the Static Web App resource**
3. ✅ **Generate a GitHub Actions workflow** (no tokens needed!)
4. ✅ **Set up automatic deployments** on push to `prod`
5. ✅ **Deploy immediately** from your current code

## 📋 Expected Workflow File

Azure will create something like this in `.github/workflows/`:

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - prod
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - prod

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_XXX }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/student"
          output_location: "dist/student/browser"
```

## 🎯 Key Benefits

### **No Manual Token Management**
- GitHub handles authentication automatically
- No copying/pasting deployment tokens
- No token expiration worries

### **Cleaner Security**
- Uses GitHub's built-in `GITHUB_TOKEN`
- Azure manages the Static Web Apps token automatically
- Proper permission scoping

### **Automatic Setup**
- Azure creates the workflow file for you
- Configures all the build settings correctly
- Deploys immediately after creation

## 🚀 Next Steps

1. **Create the Static Web App** with GitHub authorization in Azure Portal
2. **Wait for automatic deployment** (5-10 minutes)
3. **Check the live URL** provided by Azure
4. **Make changes and push** to `prod` branch for automatic updates

This approach eliminates all the token confusion we had earlier!
