import Parse from 'parse';

// Parse configuration for Back4App
const PARSE_CONFIG = {
  APPLICATION_ID: 'mSp0fnMf7qX9Buh21cJQWa14588cqN5VUUBrbFiD', // Replace with your Back4App Application ID
  JAVASCRIPT_KEY: 'clKiHVEVxM8aMHOd1IRkHk5kCWUkkVDL8xC8Jmdk', // Replace with your Back4App JavaScript Key
  SERVER_URL: 'https://parseapi.back4app.com/', // Back4App server URL
};

// Track if Parse has been tested and found to be working
let parseWorking = null; // null = not tested, true = working, false = not working

// Check if Parse is properly configured
const isParseConfigured = () => {
  return PARSE_CONFIG.APPLICATION_ID !== 'YOUR_APPLICATION_ID' && 
         PARSE_CONFIG.JAVASCRIPT_KEY !== 'YOUR_JAVASCRIPT_KEY';
};

/**
 * Test if Parse is actually working by making a simple query
 * This helps avoid 403 errors in console
 */
export const testParseConnection = async () => {
  if (parseWorking !== null) {
    return parseWorking; // Return cached result
  }

  if (!isParseConfigured()) {
    parseWorking = false;
    return false;
  }

  try {
    // Try a simple query that should work with proper credentials
    const testQuery = new Parse.Query('_User');
    testQuery.limit(1);
    await testQuery.find({ useMasterKey: false });
    parseWorking = true;
    return true;
  } catch (error) {
    // If we get 403/401, Parse credentials are invalid
    if (error.code === 209 || error.code === 101 || error.message?.includes('403') || error.message?.includes('unauthorized')) {
      parseWorking = false;
      console.warn('Parse credentials appear to be invalid. Using localStorage fallback.');
      return false;
    }
    // Other errors might be temporary, so we'll still try
    parseWorking = true;
    return true;
  }
};

/**
 * Initialize Parse with Back4App configuration
 */
export const initializeParse = () => {
  try {
    if (!isParseConfigured()) {
      console.warn('Parse not configured with Back4App credentials. Using localStorage fallback.');
      parseWorking = false;
      return false;
    }
    
    Parse.initialize(PARSE_CONFIG.APPLICATION_ID, PARSE_CONFIG.JAVASCRIPT_KEY);
    Parse.serverURL = PARSE_CONFIG.SERVER_URL;
    
    // Test connection asynchronously (don't block initialization)
    testParseConnection().then(working => {
      if (working) {
        console.log('Parse initialized successfully with Back4App');
      } else {
        console.warn('Parse initialized but credentials may be invalid. Using localStorage fallback.');
      }
    });
    
    return true; // Return true initially, let async test determine if it actually works
  } catch (error) {
    console.error('Error initializing Parse:', error);
    parseWorking = false;
    return false;
  }
};

/**
 * Check if Parse is actually working (not just configured)
 */
export const isParseWorking = () => {
  return parseWorking === true;
};

/**
 * Get Parse instance
 * @returns {Parse} Parse instance
 */
export const getParse = () => {
  return Parse;
};

/**
 * Test function to verify Back4App connection and permissions
 * Call this from browser console: window.testBack4App()
 */
export const testBack4AppConnection = async () => {
  try {
    console.log('Testing Back4App connection...');
    console.log('Application ID:', PARSE_CONFIG.APPLICATION_ID);
    console.log('JavaScript Key:', PARSE_CONFIG.JAVASCRIPT_KEY.substring(0, 10) + '...');
    
    // Test 1: Try to query MoodEntry
    console.log('\n1. Testing MoodEntry query...');
    const entryQuery = new Parse.Query('MoodEntry');
    entryQuery.limit(1);
    const entries = await entryQuery.find();
    console.log('✅ MoodEntry query works! Found', entries.length, 'entries');
    
    // Test 2: Try to create a test entry
    console.log('\n2. Testing MoodEntry create...');
    const testEntry = new Parse.Object('MoodEntry');
    testEntry.set('overallMood', 'happy');
    testEntry.set('energyLevel', 'high');
    testEntry.set('stressLevel', 5);
    testEntry.set('moodColor', '#FFD700');
    testEntry.set('colorName', 'Test Color');
    testEntry.set('date', new Date());
    const saved = await testEntry.save();
    console.log('✅ MoodEntry create works! Created entry ID:', saved.id);
    
    // Clean up test entry
    await testEntry.destroy();
    console.log('✅ Test entry cleaned up');
    
    console.log('\n🎉 Back4App is working correctly!');
    return true;
  } catch (error) {
    console.error('❌ Back4App test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 209 || error.message?.includes('unauthorized')) {
      console.error('\n🔴 PERMISSIONS ISSUE:');
      console.error('The "unauthorized" error means Back4App permissions are blocking the operation.');
      console.error('Check in Back4App Dashboard:');
      console.error('1. Go to Database Browser → MoodEntry');
      console.error('2. Click "Security" or "Permissions"');
      console.error('3. Ensure these are enabled for PUBLIC:');
      console.error('   - Find: ✓');
      console.error('   - Get: ✓');
      console.error('   - Create: ✓ (THIS IS CRITICAL)');
      console.error('   - Update: ✓');
      console.error('   - Delete: ✓');
    }
    
    return false;
  }
};

// Make it available globally for console testing
if (typeof window !== 'undefined') {
  window.testBack4App = testBack4AppConnection;
  window.Parse = Parse; // Make Parse available in console for debugging
}

export default Parse;
