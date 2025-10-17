import Parse from 'parse';
import LocalStorageService from '../services/localStorageService';

/**
 * MoodColors Parse Model
 * Stores color mappings for different moods
 */
class MoodColors extends Parse.Object {
  constructor() {
    super('MoodColors');
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
   * Get all mood colors
   * @returns {Promise<Object>} Mood colors object
   */
  static async getAllColors() {
    if (this.isParseAvailable()) {
      const query = new Parse.Query(MoodColors);
      const colors = await query.find();
      
      if (colors.length === 0) {
        // Return default colors if none exist
        return MoodColors.getDefaultColors();
      }

      // Convert Parse objects to plain object
      const colorsData = {};
      colors.forEach(color => {
        const mood = color.get('mood');
        colorsData[mood] = {
          color: color.get('color'),
          name: color.get('name'),
          description: color.get('description') || ''
        };
      });

      return colorsData;
    } else {
      // Fallback to localStorage
      const localStorageService = new LocalStorageService();
      return await localStorageService.getAllColors();
    }
  }

  /**
   * Get color by mood
   * @param {string} mood - Mood type
   * @returns {Promise<Object>} Color object for the mood
   */
  static async getByMood(mood) {
    const query = new Parse.Query(MoodColors);
    query.equalTo('mood', mood);
    const color = await query.first();
    
    if (color) {
      return {
        color: color.get('color'),
        name: color.get('name'),
        description: color.get('description') || ''
      };
    }
    
    return null;
  }

  /**
   * Get default mood colors (fallback)
   * @returns {Object} Default colors object
   */
  static getDefaultColors() {
    return {
      ecstatic: { color: "#FF69B4", name: "Hot Pink", description: "A vibrant, energetic color that reflects your amazing high spirits!" },
      happy: { color: "#FFD700", name: "Golden Yellow", description: "A bright, cheerful color that captures your positive energy." },
      content: { color: "#87CEEB", name: "Sky Blue", description: "A calm, peaceful color that represents your inner satisfaction." },
      neutral: { color: "#98FB98", name: "Pale Green", description: "A balanced color that reflects your steady, composed state." },
      anxious: { color: "#DDA0DD", name: "Plum", description: "A thoughtful color that acknowledges your current concerns." },
      sad: { color: "#4169E1", name: "Royal Blue", description: "A deep, reflective color that honors your emotions." },
      frustrated: { color: "#FF6347", name: "Tomato", description: "An intense color that captures your current agitation." }
    };
  }

  /**
   * Initialize default mood colors in Parse
   * @returns {Promise<boolean>} Success status
   */
  static async initializeDefaultColors() {
    try {
      const defaultColors = MoodColors.getDefaultColors();
      const colorsToSave = [];

      Object.keys(defaultColors).forEach(mood => {
        const colorData = defaultColors[mood];
        const moodColor = new MoodColors();
        moodColor.set('mood', mood);
        moodColor.set('color', colorData.color);
        moodColor.set('name', colorData.name);
        moodColor.set('description', colorData.description);
        colorsToSave.push(moodColor);
      });

      await Parse.Object.saveAll(colorsToSave);
      console.log('Default mood colors initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing default mood colors:', error);
      return false;
    }
  }

  /**
   * Add new mood color
   * @param {string} mood - Mood type
   * @param {string} color - Hex color code
   * @param {string} name - Color name
   * @param {string} description - Color description
   * @returns {Promise<MoodColors>} Created color
   */
  static async addColor(mood, color, name, description = '') {
    const moodColor = new MoodColors();
    moodColor.set('mood', mood);
    moodColor.set('color', color);
    moodColor.set('name', name);
    moodColor.set('description', description);

    return await moodColor.save();
  }

  /**
   * Update mood color
   * @param {string} id - Parse object ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<MoodColors>} Updated color
   */
  static async updateColor(id, updateData) {
    const color = await MoodColors.getById(id);
    
    Object.keys(updateData).forEach(key => {
      color.set(key, updateData[key]);
    });

    return await color.save();
  }

  /**
   * Delete mood color
   * @param {string} id - Parse object ID
   * @returns {Promise<boolean>} Success status
   */
  static async deleteColor(id) {
    const color = await MoodColors.getById(id);
    await color.destroy();
    return true;
  }

  /**
   * Get color by ID
   * @param {string} id - Parse object ID
   * @returns {Promise<MoodColors>} Color object
   */
  static async getById(id) {
    const query = new Parse.Query(MoodColors);
    return await query.get(id);
  }

  /**
   * Generate mood color based on mood type
   * @param {string} mood - Mood type
   * @returns {Promise<Object>} Generated color object
   */
  static async generateMoodColor(mood) {
    if (this.isParseAvailable()) {
      const colorData = await MoodColors.getByMood(mood);
      
      if (colorData) {
        return colorData;
      }
      
      // Fallback to default color
      const defaultColors = MoodColors.getDefaultColors();
      return defaultColors[mood] || { color: "#808080", name: "Unknown", description: "A unique color that represents your current emotional state." };
    } else {
      // Fallback to localStorage
      const localStorageService = new LocalStorageService();
      return await localStorageService.generateMoodColor(mood);
    }
  }
}

// Register the subclass
Parse.Object.registerSubclass('MoodColors', MoodColors);

export default MoodColors;
