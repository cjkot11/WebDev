import Parse from 'parse';

// Parse configuration for Back4App
const PARSE_CONFIG = {
  APPLICATION_ID: 'mSp0fnMf7qX9Buh21cJQWa14588cqN5VUUBrbFiD', // Replace with your Back4App Application ID
  JAVASCRIPT_KEY: 'clKiHVEVxM8aMHOd1IRkHk5kCWUkkVDL8xC8Jmdk', // Replace with your Back4App JavaScript Key
  SERVER_URL: 'https://parseapi.back4app.com/', // Back4App server URL
};

// Check if Parse is properly configured
const isParseConfigured = () => {
  return PARSE_CONFIG.APPLICATION_ID !== 'YOUR_APPLICATION_ID' && 
         PARSE_CONFIG.JAVASCRIPT_KEY !== 'YOUR_JAVASCRIPT_KEY';
};

/**
 * Initialize Parse with Back4App configuration
 */
export const initializeParse = () => {
  try {
    if (!isParseConfigured()) {
      console.warn('Parse not configured with Back4App credentials. Using localStorage fallback.');
      return false;
    }
    
    Parse.initialize(PARSE_CONFIG.APPLICATION_ID, PARSE_CONFIG.JAVASCRIPT_KEY);
    Parse.serverURL = PARSE_CONFIG.SERVER_URL;
    
    console.log('Parse initialized successfully with Back4App');
    return true;
  } catch (error) {
    console.error('Error initializing Parse:', error);
    return false;
  }
};

/**
 * Get Parse instance
 * @returns {Parse} Parse instance
 */
export const getParse = () => {
  return Parse;
};

export default Parse;
