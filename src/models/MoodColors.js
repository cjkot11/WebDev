import Parse from 'parse';
import LocalStorageService from '../services/localStorageService';

/**
 Mood Colors Parse Model
 stores color mappings for different moods
 */
class MoodColors extends Parse.Object {
  constructor() {
    super('MoodColors');
  }

  //check if the parse is available 
  static isParseAvailable() {
    try {
      return Parse.applicationId && Parse.applicationId !== 'YOUR_APPLICATION_ID';
    } catch {
      return false;
    }
  }

  //static methods for querying

  //get all the colors and returns a promise 
  static async getAllColors() {
    if (this.isParseAvailable()) {
      try {
        const query = new Parse.Query(MoodColors);
        const colors = await query.find();
        
        if (colors.length === 0) {
          //returns default 
          return MoodColors.getDefaultColors();
        }

        //convert Parse objects to plain object
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
      } catch (error) {
        // If Parse returns 403/401 or any error, fall back to localStorage
        // Only log as warning if it's not a 403/401 (which we expect might happen)
        if (error.code !== 209 && error.code !== 101 && !error.message?.includes('403') && !error.message?.includes('unauthorized')) {
          console.warn('Parse error in getAllColors, falling back to localStorage:', error.message);
        }
        const localStorageService = new LocalStorageService();
        return await localStorageService.getAllColors();
      }
    } else {
      //fallback is local -> pretty sure this is the way 
      const localStorageService = new LocalStorageService();
      return await localStorageService.getAllColors();
    }
  }


  //get the color by the mood type
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


  //default mood colrs 
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

//initialize defualt in parse 
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
   Add a new mood color
   need the mood color name and description
   */
  static async addColor(mood, color, name, description = '') {
    const moodColor = new MoodColors();
    moodColor.set('mood', mood);
    moodColor.set('color', color);
    moodColor.set('name', name);
    moodColor.set('description', description);

    return await moodColor.save();
  }

  //update mood color
  static async updateColor(id, updateData) {
    const color = await MoodColors.getById(id);
    
    Object.keys(updateData).forEach(key => {
      color.set(key, updateData[key]);
    });

    return await color.save();
  }

  //delete 
  static async deleteColor(id) {
    const color = await MoodColors.getById(id);
    await color.destroy();
    return true;
  }

  //get the color by the id 
  static async getById(id) {
    const query = new Parse.Query(MoodColors);
    return await query.get(id);
  }

  //generates a color based on the mood
  static async generateMoodColor(mood) {
    if (this.isParseAvailable()) {
      try {
        const colorData = await MoodColors.getByMood(mood);
        
        if (colorData) {
          return colorData;
        }
        
        //fallback to default color
        const defaultColors = MoodColors.getDefaultColors();
        return defaultColors[mood] || { color: "#808080", name: "Unknown", description: "A unique color that represents your current emotional state." };
      } catch (error) {
        // If Parse returns 403/401 or any error, fall back to localStorage
        // Only log as warning if it's not a 403/401 (which we expect might happen)
        if (error.code !== 209 && error.code !== 101 && !error.message?.includes('403') && !error.message?.includes('unauthorized')) {
          console.warn('Parse error in generateMoodColor, falling back to localStorage:', error.message);
        }
        const localStorageService = new LocalStorageService();
        return await localStorageService.generateMoodColor(mood);
      }
    } else {
      const localStorageService = new LocalStorageService();
      return await localStorageService.generateMoodColor(mood);
    }
  }
}

//register - only if Parse is available
try {
  Parse.Object.registerSubclass('MoodColors', MoodColors);
} catch (error) {
  // Parse may not be initialized yet, which is fine - will use localStorage fallback
  console.warn('Could not register MoodColors subclass:', error.message);
}

export default MoodColors;
