# Deployment Guide

## Local Testing

The development server is running at: **http://localhost:3000**

### Quick Test Checklist:
1. ✅ Open http://localhost:3000 in your browser
2. ✅ Check browser console (F12) for any errors
3. ✅ Navigate between pages (Home, Daily Entry, Mood History)
4. ✅ Create a mood entry and verify it appears in History
5. ✅ Verify no console errors

## GitHub Pages Deployment

### Option 1: Deploy to GitHub Pages (Recommended)

1. **Build the production version:**
   ```bash
   npm run build
   ```

2. **Configure webpack for GitHub Pages** (if deploying to a subdirectory):
   - If your repo is `username/mood-journal`, update `webpack.config.js`:
     ```javascript
     publicPath: '/mood-journal/',
     ```

3. **Deploy using gh-pages package:**
   ```bash
   npm install --save-dev gh-pages
   ```
   
   Add to `package.json` scripts:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```
   
   Then run:
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages:**
   - Go to your GitHub repo → Settings → Pages
   - Select source: "Deploy from a branch"
   - Select branch: `gh-pages` → folder: `/ (root)`
   - Your site will be available at: `https://username.github.io/mood-journal`

### Option 2: Manual Deployment

1. Build the app:
   ```bash
   npm run build
   ```

2. The `dist/` folder contains your production files

3. Upload the contents of `dist/` to your web hosting service

## Testing Checklist

### Basic Functionality:
- [ ] Home page loads and displays statistics
- [ ] Navigation links work correctly
- [ ] Daily Entry form submits successfully
- [ ] Mood History displays entries
- [ ] No console errors

### Parse/Back4App Integration:
- [ ] Check console for Parse initialization message
- [ ] If Parse credentials are set: entries should sync to Back4App
- [ ] If Parse credentials are NOT set: entries should use localStorage fallback

### Browser Compatibility:
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test on mobile device (if possible)

