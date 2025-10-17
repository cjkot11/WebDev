import Parse from 'parse';
import LocalStorageService from '../services/localStorageService';

/**
 * MoodOptions Parse Model
 * Stores configuration data for mood tracking options
 */
class MoodOptions extends Parse.Object {
  constructor() {
    super('MoodOptions');
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
   * Get all mood options
   * @returns {Promise<Object>} Mood options object
   */
  static async getAllOptions() {
    if (this.isParseAvailable()) {
      const query = new Parse.Query(MoodOptions);
      const options = await query.find();
      
      if (options.length === 0) {
        // Return default options if none exist
        return MoodOptions.getDefaultOptions();
      }

      // Convert Parse objects to plain object
      const optionsData = {};
      options.forEach(option => {
        const category = option.get('category');
        const value = option.get('value');
        const label = option.get('label');
        
        if (!optionsData[category]) {
          optionsData[category] = [];
        }
        
        optionsData[category].push({ value, label });
      });

      return optionsData;
    } else {
      // Fallback to localStorage
      const localStorageService = new LocalStorageService();
      return await localStorageService.getAllOptions();
    }
  }

  /**
   * Get options by category
   * @param {string} category - Category name (e.g., 'overallMood', 'energyLevel')
   * @returns {Promise<Array>} Array of options for the category
   */
  static async getByCategory(category) {
    const query = new Parse.Query(MoodOptions);
    query.equalTo('category', category);
    query.ascending('order');
    const options = await query.find();
    
    return options.map(option => ({
      value: option.get('value'),
      label: option.get('label')
    }));
  }

  /**
   * Get default mood options (fallback)
   * @returns {Object} Default options object
   */
  static getDefaultOptions() {
    return {
      overallMood: [
        { value: "ecstatic", label: "Ecstatic - On top of the world!" },
        { value: "happy", label: "Happy - Feeling great" },
        { value: "content", label: "Content - Satisfied and calm" },
        { value: "neutral", label: "Neutral - Neither good nor bad" },
        { value: "anxious", label: "Anxious - Worried or stressed" },
        { value: "sad", label: "Sad - Feeling down" },
        { value: "frustrated", label: "Frustrated - Annoyed or agitated" }
      ],
      energyLevel: [
        { value: "high", label: "High" },
        { value: "medium", label: "Medium" },
        { value: "low", label: "Low" }
      ],
      socialInteractions: [
        { value: "family", label: "Family" },
        { value: "friends", label: "Friends" },
        { value: "colleagues", label: "Colleagues" },
        { value: "strangers", label: "Strangers" },
        { value: "none", label: "Mostly alone" }
      ],
      primaryThoughts: [
        { value: "work", label: "Work/Career" },
        { value: "relationships", label: "Relationships" },
        { value: "health", label: "Health/Wellness" },
        { value: "future", label: "Future plans" },
        { value: "past", label: "Past memories" },
        { value: "creative", label: "Creative projects" },
        { value: "learning", label: "Learning/Growth" },
        { value: "relaxation", label: "Rest and relaxation" }
      ]
    };
  }

  /**
   * Initialize default mood options in Parse
   * @returns {Promise<boolean>} Success status
   */
  static async initializeDefaultOptions() {
    try {
      const defaultOptions = MoodOptions.getDefaultOptions();
      const optionsToSave = [];

      Object.keys(defaultOptions).forEach(category => {
        defaultOptions[category].forEach((option, index) => {
          const moodOption = new MoodOptions();
          moodOption.set('category', category);
          moodOption.set('value', option.value);
          moodOption.set('label', option.label);
          moodOption.set('order', index);
          optionsToSave.push(moodOption);
        });
      });

      await Parse.Object.saveAll(optionsToSave);
      console.log('Default mood options initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing default mood options:', error);
      return false;
    }
  }

  /**
   * Add new option to a category
   * @param {string} category - Category name
   * @param {string} value - Option value
   * @param {string} label - Option label
   * @returns {Promise<MoodOptions>} Created option
   */
  static async addOption(category, value, label) {
    const moodOption = new MoodOptions();
    moodOption.set('category', category);
    moodOption.set('value', value);
    moodOption.set('label', label);
    
    // Get the next order number
    const query = new Parse.Query(MoodOptions);
    query.equalTo('category', category);
    query.descending('order');
    query.limit(1);
    const lastOption = await query.first();
    const nextOrder = lastOption ? lastOption.get('order') + 1 : 0;
    moodOption.set('order', nextOrder);

    return await moodOption.save();
  }

  /**
   * Update option
   * @param {string} id - Parse object ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<MoodOptions>} Updated option
   */
  static async updateOption(id, updateData) {
    const option = await MoodOptions.getById(id);
    
    Object.keys(updateData).forEach(key => {
      option.set(key, updateData[key]);
    });

    return await option.save();
  }

  /**
   * Delete option
   * @param {string} id - Parse object ID
   * @returns {Promise<boolean>} Success status
   */
  static async deleteOption(id) {
    const option = await MoodOptions.getById(id);
    await option.destroy();
    return true;
  }

  /**
   * Get option by ID
   * @param {string} id - Parse object ID
   * @returns {Promise<MoodOptions>} Option object
   */
  static async getById(id) {
    const query = new Parse.Query(MoodOptions);
    return await query.get(id);
  }
}

// Register the subclass
Parse.Object.registerSubclass('MoodOptions', MoodOptions);

export default MoodOptions;
