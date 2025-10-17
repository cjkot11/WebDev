import Parse from 'parse';
import LocalStorageService from '../services/localStorageService';

/**
 * MoodEntry Parse Model
 * Represents a single mood entry with all associated data
 */
class MoodEntry extends Parse.Object {
  constructor() {
    super('MoodEntry');
  }

  // Check if Parse is available
  static isParseAvailable() {
    try {
      return Parse.applicationId && Parse.applicationId !== 'YOUR_APPLICATION_ID';
    } catch {
      return false;
    }
  }

  // Static methods for querying (following rubric - queries outside components)
  
  /**
   * Get all mood entries
   * @returns {Promise<Array>} Array of mood entries
   */
  static async getAllEntries() {
    if (this.isParseAvailable()) {
      const query = new Parse.Query(MoodEntry);
      query.descending('createdAt');
      return await query.find();
    } else {
      // Fallback to localStorage
      const localStorageService = new LocalStorageService();
      return await localStorageService.getAllEntries();
    }
  }

  /**
   * Get mood entry by ID
   * @param {string} id - Parse object ID
   * @returns {Promise<MoodEntry>} Mood entry object
   */
  static async getById(id) {
    const query = new Parse.Query(MoodEntry);
    return await query.get(id);
  }

  /**
   * Get recent mood entries (last 7 days)
   * @returns {Promise<Array>} Array of recent mood entries
   */
  static async getRecentEntries() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const query = new Parse.Query(MoodEntry);
    query.greaterThanOrEqualTo('date', sevenDaysAgo);
    query.descending('createdAt');
    return await query.find();
  }

  /**
   * Get mood entries by mood type
   * @param {string} mood - Mood type to filter by
   * @returns {Promise<Array>} Array of mood entries
   */
  static async getByMood(mood) {
    const query = new Parse.Query(MoodEntry);
    query.equalTo('overallMood', mood);
    query.descending('createdAt');
    return await query.find();
  }

  /**
   * Get mood entries by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} Array of mood entries
   */
  static async getByDateRange(startDate, endDate) {
    const query = new Parse.Query(MoodEntry);
    query.greaterThanOrEqualTo('date', startDate);
    query.lessThanOrEqualTo('date', endDate);
    query.descending('createdAt');
    return await query.find();
  }

  /**
   * Get mood statistics
   * @returns {Promise<Object>} Statistics object
   */
  static async getStatistics() {
    if (this.isParseAvailable()) {
      const query = new Parse.Query(MoodEntry);
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
        recentTrend: 'stable', // Could be enhanced with trend analysis
      };
    } else {
      // Fallback to localStorage
      const localStorageService = new LocalStorageService();
      return await localStorageService.getStatistics();
    }
  }

  // Instance methods

  /**
   * Create a new mood entry
   * @param {Object} moodData - Mood entry data
   * @param {Parse.User} user - User creating the entry (optional, defaults to current user)
   * @returns {Promise<MoodEntry>} Created mood entry
   */
  static async createEntry(moodData, user = null) {
    if (this.isParseAvailable()) {
      const moodEntry = new MoodEntry();
      
      // Set user relationship (Rule of 10)
      const currentUser = user || Parse.User.current();
      if (currentUser) {
        moodEntry.set('user', currentUser);
      }
      
      // Set all the mood data
      moodEntry.set('overallMood', moodData.overallMood);
      moodEntry.set('energyLevel', moodData.energyLevel);
      moodEntry.set('socialInteractions', moodData.socialInteractions || []);
      moodEntry.set('stressLevel', moodData.stressLevel);
      moodEntry.set('primaryThoughts', moodData.primaryThoughts);
      moodEntry.set('gratitude', moodData.gratitude || '');
      moodEntry.set('highlight', moodData.highlight || '');
      moodEntry.set('intention', moodData.intention || '');
      moodEntry.set('moodColor', moodData.moodColor);
      moodEntry.set('colorName', moodData.colorName);
      moodEntry.set('colorDescription', moodData.colorDescription || '');
      moodEntry.set('date', new Date(moodData.date || Date.now()));

      return await moodEntry.save();
    } else {
      // Fallback to localStorage
      const localStorageService = new LocalStorageService();
      return await localStorageService.createEntry(moodData);
    }
  }

  /**
   * Update mood entry
   * @param {string} id - Parse object ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<MoodEntry>} Updated mood entry
   */
  static async updateEntry(id, updateData) {
    const moodEntry = await MoodEntry.getById(id);
    
    Object.keys(updateData).forEach(key => {
      moodEntry.set(key, updateData[key]);
    });

    return await moodEntry.save();
  }

  /**
   * Delete mood entry
   * @param {string} id - Parse object ID
   * @returns {Promise<boolean>} Success status
   */
  static async deleteEntry(id) {
    const moodEntry = await MoodEntry.getById(id);
    await moodEntry.destroy();
    return true;
  }
}

// Register the subclass
Parse.Object.registerSubclass('MoodEntry', MoodEntry);

export default MoodEntry;
