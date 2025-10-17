import Parse from 'parse';

/**
 * User Parse Model
 * Extends Parse.User to add custom user functionality
 * Establishes relationships with mood entries (Rule of 10)
 */
class User extends Parse.User {
  constructor() {
    super();
  }

  // Static methods for querying (following rubric - queries outside components)

  /**
   * Get current user
   * @returns {Parse.User|null} Current user or null
   */
  static getCurrentUser() {
    return Parse.User.current();
  }

  /**
   * Sign up a new user
   * @param {string} username - Username
   * @param {string} password - Password
   * @param {Object} additionalData - Additional user data
   * @returns {Promise<Parse.User>} Created user
   */
  static async signUp(username, password, additionalData = {}) {
    const user = new User();
    user.set('username', username);
    user.set('password', password);
    
    // Set additional data
    Object.keys(additionalData).forEach(key => {
      user.set(key, additionalData[key]);
    });

    return await user.signUp();
  }

  /**
   * Log in user
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise<Parse.User>} Logged in user
   */
  static async logIn(username, password) {
    return await Parse.User.logIn(username, password);
  }

  /**
   * Log out current user
   * @returns {Promise<void>}
   */
  static async logOut() {
    return await Parse.User.logOut();
  }

  /**
   * Get user's mood entries (relationship query)
   * @param {string} userId - User ID (optional, defaults to current user)
   * @returns {Promise<Array>} Array of user's mood entries
   */
  static async getUserMoodEntries(userId = null) {
    const user = userId ? await User.getById(userId) : User.getCurrentUser();
    
    if (!user) {
      throw new Error('User not found');
    }

    const query = new Parse.Query('MoodEntry');
    query.equalTo('user', user);
    query.descending('createdAt');
    return await query.find();
  }

  /**
   * Get user's recent mood entries (last 7 days)
   * @param {string} userId - User ID (optional, defaults to current user)
   * @returns {Promise<Array>} Array of recent mood entries
   */
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

  /**
   * Get user's mood statistics
   * @param {string} userId - User ID (optional, defaults to current user)
   * @returns {Promise<Object>} User's mood statistics
   */
  static async getUserStatistics(userId = null) {
    const user = userId ? await User.getById(userId) : User.getCurrentUser();
    
    if (!user) {
      throw new Error('User not found');
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

    // Calculate statistics
    const totalStress = entries.reduce((sum, entry) => sum + entry.get('stressLevel'), 0);
    const averageStressLevel = Math.round(totalStress / entries.length);

    // Calculate mood distribution
    const moodDistribution = {};
    entries.forEach((entry) => {
      const mood = entry.get('overallMood');
      moodDistribution[mood] = (moodDistribution[mood] || 0) + 1;
    });

    // Find most common mood
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

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<Parse.User>} User object
   */
  static async getById(id) {
    const query = new Parse.Query(Parse.User);
    return await query.get(id);
  }

  /**
   * Update user profile
   * @param {string} userId - User ID (optional, defaults to current user)
   * @param {Object} updateData - Data to update
   * @returns {Promise<Parse.User>} Updated user
   */
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

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  static isAuthenticated() {
    return Parse.User.current() !== null;
  }

  /**
   * Get user's display name
   * @param {string} userId - User ID (optional, defaults to current user)
   * @returns {string} Display name
   */
  static async getDisplayName(userId = null) {
    const user = userId ? await User.getById(userId) : User.getCurrentUser();
    
    if (!user) {
      return 'Guest';
    }

    return user.get('displayName') || user.get('username') || 'User';
  }

  // Instance methods

  /**
   * Get user's mood entries count
   * @returns {Promise<number>} Number of mood entries
   */
  async getMoodEntriesCount() {
    const query = new Parse.Query('MoodEntry');
    query.equalTo('user', this);
    const count = await query.count();
    return count;
  }

  /**
   * Get user's last mood entry
   * @returns {Promise<Parse.Object|null>} Last mood entry or null
   */
  async getLastMoodEntry() {
    const query = new Parse.Query('MoodEntry');
    query.equalTo('user', this);
    query.descending('createdAt');
    query.limit(1);
    return await query.first();
  }
}

// Register the subclass
Parse.Object.registerSubclass('_User', User);

export default User;
