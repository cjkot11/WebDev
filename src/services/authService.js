import Parse from 'parse';

const authService = {
  async signUp(username, password, extra = {}) {
    const user = new Parse.User();
    user.set('username', username);
    user.set('password', password);
    Object.keys(extra || {}).forEach((k) => user.set(k, extra[k]));
    return await user.signUp();
  },

  async logIn(username, password) {
    return await Parse.User.logIn(username, password);
  },

  async logOut() {
    await Parse.User.logOut();
    return true;
  },

  getCurrentUser() {
    return Parse.User.current();
  },

  isAuthenticated() {
    return !!Parse.User.current();
  }
};

export default authService;
