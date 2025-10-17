import Parse from 'parse';

/**
  User Parse Model
  Extends Parse.User to add custom user functionality
 */
class User extends Parse.User {
  constructor() {
    super();
  }


 //get the user 
  static getCurrentUser() {
    return Parse.User.current();
  }

  //sign up a new user 
  static async signUp(username, password, additionalData = {}) {
    const user = new User();
    user.set('username', username);
    user.set('password', password);
    
    //set data 
    Object.keys(additionalData).forEach(key => {
      user.set(key, additionalData[key]);
    });

    return await user.signUp();
  }

  //login
  static async logIn(username, password) {
    return await Parse.User.logIn(username, password);
  }

  //logout
  static async logOut() {
    return await Parse.User.logOut();
  }

  //get user's mood entry - the relationship 
  static async getUserMoodEntries(userId = null) {
    const user = userId ? await User.getById(userId) : User.getCurrentUser();
    
    if (!user) {
      throw new Error('User not found'); //error 
    }

    const query = new Parse.Query('MoodEntry');
    query.equalTo('user', user);
    query.descending('createdAt');
    return await query.find();
  }

  //the recent mood entries - 7 days 
  static async getUserRecentEntries(userId = null) {
    const user = userId ? await User.getById(userId) : User.getCurrentUser();
    
    if (!user) {
      throw new Error('User not found');
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const query = new Parse.Query('MoodEntry');
    query.equalTo('user', user);
    query.greaterThanOrEqualTo('date', sevenDaysAgo);
    query.descending('createdAt');
    return await query.find();
  }

  //user's mood stats - might make less repetitive in future features 
  static async getUserStatistics(userId = null) {
    const user = userId ? await User.getById(userId) : User.getCurrentUser();
    
    if (!user) {
      throw new Error('User not found'); //error
    }

    const query = new Parse.Query('MoodEntry');
    query.equalTo('user', user);
    const entries = await query.find();
    
    if (entries.length === 0) {
      return {
        totalEntries: 0,
        averageStressLevel: 0,
        mostCommonMood: null,
        moodDistribution: {},
        recentTrend: 'stable',
      };
    }

    //calculate stats 
    const totalStress = entries.reduce((sum, entry) => sum + entry.get('stressLevel'), 0);
    const averageStressLevel = Math.round(totalStress / entries.length);

    //mood distribution
    const moodDistribution = {};
    entries.forEach((entry) => {
      const mood = entry.get('overallMood');
      moodDistribution[mood] = (moodDistribution[mood] || 0) + 1;
    });

    //most common 
    const mostCommonMood = Object.keys(moodDistribution).reduce((a, b) =>
      moodDistribution[a] > moodDistribution[b] ? a : b
    );

    return {
      totalEntries: entries.length,
      averageStressLevel,
      mostCommonMood,
      moodDistribution,
      recentTrend: 'stable',
    };
  }

  //user by id
  static async getById(id) {
    const query = new Parse.Query(Parse.User);
    return await query.get(id);
  }

  //update the user profile 
  static async updateProfile(userId = null, updateData) {
    const user = userId ? await User.getById(userId) : User.getCurrentUser();
    
    if (!user) {
      throw new Error('User not found');
    }

    Object.keys(updateData).forEach(key => {
      user.set(key, updateData[key]);
    });

    return await user.save();
  }

  //authentification - dont know if we want to use 
  static isAuthenticated() {
    return Parse.User.current() !== null;
  }

  //get the user's name 
  static async getDisplayName(userId = null) {
    const user = userId ? await User.getById(userId) : User.getCurrentUser();
    
    if (!user) {
      return 'Guest'; //default 
    }

    return user.get('displayName') || user.get('username') || 'User';
  }

  // Instance methods

  //entry counts 
  async getMoodEntriesCount() {
    const query = new Parse.Query('MoodEntry');
    query.equalTo('user', this);
    const count = await query.count();
    return count;
  }

  //last entry 
  async getLastMoodEntry() {
    const query = new Parse.Query('MoodEntry');
    query.equalTo('user', this);
    query.descending('createdAt');
    query.limit(1);
    return await query.first();
  }
}

//register 
Parse.Object.registerSubclass('_User', User);

export default User;
