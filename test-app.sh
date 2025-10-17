#!/bin/bash

echo "🧪 Testing Mood Color Journal React Application"
echo "=============================================="

# Check node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check version
NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check version
NPM_VERSION=$(npm --version)
echo "✅ npm version: $NPM_VERSION"

# dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Dependencies installed successfully"
    else
        echo "❌ Failed to install dependencies"
        exit 1
    fi
else
    echo "✅ Dependencies already installed"
fi

# file check
echo "🔍 Checking required files..."

REQUIRED_FILES=(
    "src/index.js"
    "src/App.js"
    "src/components/Home.js"
    "src/components/Entry.js"
    "src/components/History.js"
    "src/models/MoodEntry.js"
    "src/models/MoodOptions.js"
    "src/models/MoodColors.js"
    "src/models/User.js"
    "src/services/parseConfig.js"
    "webpack.config.js"
    "package.json"
    "public/index.html"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file is missing"
        exit 1
    fi
done

# package.json
PACKAGE_VERSION=$(grep '"version"' package.json | cut -d'"' -f4)
echo "✅ Package version: $PACKAGE_VERSION"

# Check Parse
if grep -q "YOUR_APPLICATION_ID" src/services/parseConfig.js; then
    echo "⚠️  Parse configuration needs to be updated with your Back4App credentials"
    echo "   Please update src/services/parseConfig.js with your Application ID and JavaScript Key"
else
    echo "✅ Parse configuration appears to be set up"
fi

# build
echo "🔨 Testing webpack build..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Webpack build successful"
else
    echo "❌ Webpack build failed"
    exit 1
fi

# dist folder
if [ -d "dist" ]; then
    echo "✅ Production build created in dist folder"
else
    echo "❌ Production build folder not found"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Your React application is ready."
echo ""
echo "📋 Next steps:"
echo "1. Update Parse configuration in src/services/parseConfig.js"
echo "2. Run 'npm run dev' to start development server"
echo "3. Open http://localhost:3000 in your browser"
echo "4. Test all functionality and check browser console for errors"
echo ""
echo "🚀 For production deployment:"
echo "1. Run 'npm run build' to create production build"
echo "2. Upload dist folder contents to your hosting service"
echo "3. Configure your Back4App Parse app for production"
