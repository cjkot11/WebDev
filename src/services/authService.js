import Parse from 'parse';

// Check if Parse is initialized
// Parse is initialized when Parse.serverURL is set
const isParseReady = () => {
  try {
    // Check if Parse has been initialized by checking serverURL
    // If Parse.serverURL exists, it means Parse.initialize() was called
    return typeof Parse !== 'undefined' && 
           Parse.serverURL !== undefined && 
           Parse.serverURL !== null &&
           Parse.serverURL !== '';
  } catch (e) {
    return false;
  }
};

const authService = {
  async signUp(username, password, extra = {}) {
    if (!isParseReady()) {
      throw new Error('Parse is not initialized. Please wait for app initialization.');
    }
    const user = new Parse.User();
    user.set('username', username);
    user.set('password', password);
    Object.keys(extra || {}).forEach((k) => user.set(k, extra[k]));
    return await user.signUp();
  },

  async logIn(username, password) {
    if (!isParseReady()) {
      throw new Error('Parse is not initialized. Please wait for app initialization.');
    }
    return await Parse.User.logIn(username, password);
  },

  async logOut() {
    if (!isParseReady()) {
      return true; // If Parse isn't ready, consider logout successful
    }
    await Parse.User.logOut();
    return true;
  },

  getCurrentUser() {
    if (!isParseReady()) {
      return null;
    }
    try {
      return Parse.User.current();
    } catch (e) {
      return null;
    }
  },

  isAuthenticated() {
    if (!isParseReady()) {
      return false;
    }
    try {
      return !!Parse.User.current();
    } catch (e) {
      return false;
    }
  }
};

export default authService;
