import Parse from 'parse';
import LocalStorageService from '../services/localStorageService';

/**
 Mood Entry Parse Model
 *Represents a single mood entry with all associated data
 */
class MoodEntry extends Parse.Object {
  constructor() {
    super('MoodEntry');
  }

  //check is available
  static isParseAvailable() {
    try {
      return Parse.applicationId && Parse.applicationId !== 'YOUR_APPLICATION_ID';
    } catch {
      return false;
    }
  }

  
  //get all entries 
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

  //get mood entry by the id 
  static async getById(id) {
    const query = new Parse.Query(MoodEntry);
    return await query.get(id);
  }

  //get the recent entries - 7 days 
  static async getRecentEntries() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const query = new Parse.Query(MoodEntry);
    query.greaterThanOrEqualTo('date', sevenDaysAgo);
    query.descending('createdAt');
    return await query.find();
  }

  //entries by mood 
  static async getByMood(mood) {
    const query = new Parse.Query(MoodEntry);
    query.equalTo('overallMood', mood);
    query.descending('createdAt');
    return await query.find();
  }

  //entries by the date 
  static async getByDateRange(startDate, endDate) {
    const query = new Parse.Query(MoodEntry);
    query.greaterThanOrEqualTo('date', startDate);
    query.lessThanOrEqualTo('date', endDate);
    query.descending('createdAt');
    return await query.find();
  }

  //mood stats 
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

      //way to calculate the stats - might change later 
      const totalStress = entries.reduce((sum, entry) => sum + entry.get('stressLevel'), 0);
      const averageStressLevel = Math.round(totalStress / entries.length);

      //the distribution 
      const moodDistribution = {};
      entries.forEach((entry) => {
        const mood = entry.get('overallMood');
        moodDistribution[mood] = (moodDistribution[mood] || 0) + 1;
      });

      // most common mood 
      const mostCommonMood = Object.keys(moodDistribution).reduce((a, b) =>
        moodDistribution[a] > moodDistribution[b] ? a : b
      );

      return {
        totalEntries: entries.length,
        averageStressLevel,
        mostCommonMood,
        moodDistribution,
        recentTrend: 'stable', // might add a trend analysis later 
      };
    } else {
      // fallback
      const localStorageService = new LocalStorageService();
      return await localStorageService.getStatistics();
    }
  }

  // Instance methods

  //create a new mood entry
  static async createEntry(moodData, user = null) {
    if (this.isParseAvailable()) {
      const moodEntry = new MoodEntry();
      
      //set user relationship (Rule of 10)
      const currentUser = user || Parse.User.current();
      if (currentUser) {
        moodEntry.set('user', currentUser);
      }
      
      //set all the mood data
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
      const localStorageService = new LocalStorageService();
      return await localStorageService.createEntry(moodData);
    }
  }

  //update mood entry 
  static async updateEntry(id, updateData) {
    const moodEntry = await MoodEntry.getById(id);
    
    Object.keys(updateData).forEach(key => {
      moodEntry.set(key, updateData[key]);
    });

    return await moodEntry.save();
  }

  //delete 
  static async deleteEntry(id) {
    const moodEntry = await MoodEntry.getById(id);
    await moodEntry.destroy();
    return true;
  }
}

//register 
Parse.Object.registerSubclass('MoodEntry', MoodEntry);

export default MoodEntry;
