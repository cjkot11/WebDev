import Parse from 'parse';
import LocalStorageService from '../services/localStorageService';

/**
  Mood Options Parse Model
  Stores configuration data for mood tracking options
 */
class MoodOptions extends Parse.Object {
  constructor() {
    super('MoodOptions');
  }

  //check availability 
  static isParseAvailable() {
    try {
      return Parse.applicationId && Parse.applicationId !== 'YOUR_APPLICATION_ID';
    } catch {
      return false;
    }
  }


  //get the mood options 
  static async getAllOptions() {
    if (this.isParseAvailable()) {
      const query = new Parse.Query(MoodOptions);
      const options = await query.find();
      
      if (options.length === 0) {
        //default 
        return MoodOptions.getDefaultOptions();
      }

      //convert Parse objects to plain object
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
      //fallback 
      const localStorageService = new LocalStorageService();
      return await localStorageService.getAllOptions();
    }
  }

  //get options by category
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

  //fallback 
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

  //initialize in parse 
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

  //add a new option 
  static async addOption(category, value, label) {
    const moodOption = new MoodOptions();
    moodOption.set('category', category);
    moodOption.set('value', value);
    moodOption.set('label', label);
    
    //next order number 
    const query = new Parse.Query(MoodOptions);
    query.equalTo('category', category);
    query.descending('order');
    query.limit(1);
    const lastOption = await query.first();
    const nextOrder = lastOption ? lastOption.get('order') + 1 : 0;
    moodOption.set('order', nextOrder);

    return await moodOption.save();
  }

  //update the option 
  static async updateOption(id, updateData) {
    const option = await MoodOptions.getById(id);
    
    Object.keys(updateData).forEach(key => {
      option.set(key, updateData[key]);
    });

    return await option.save();
  }

  //delete the option 
  static async deleteOption(id) {
    const option = await MoodOptions.getById(id);
    await option.destroy();
    return true;
  }

  //by id 
  static async getById(id) {
    const query = new Parse.Query(MoodOptions);
    return await query.get(id);
  }
}


Parse.Object.registerSubclass('MoodOptions', MoodOptions);

export default MoodOptions;
