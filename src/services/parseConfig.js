import Parse from 'parse';

// Parse configuration for Back4App
const PARSE_CONFIG = {
  APPLICATION_ID: 'YOUR_APPLICATION_ID', // Caz this is where you put in 
  JAVASCRIPT_KEY: 'YOUR_JAVASCRIPT_KEY', // Caz - Replace with your Back4App JavaScript Key
  SERVER_URL: 'https://parseapi.back4app.com/', // Back4App server URL
};

//Parse is properly configured
const isParseConfigured = () => {
  return PARSE_CONFIG.APPLICATION_ID !== 'YOUR_APPLICATION_ID' &&  //Caz - replace 
         PARSE_CONFIG.JAVASCRIPT_KEY !== 'YOUR_JAVASCRIPT_KEY';    //Caz replace
};

//initialize parse 
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


export const getParse = () => {
  return Parse;
};

export default Parse;
