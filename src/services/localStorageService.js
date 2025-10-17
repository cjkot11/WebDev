// localStorage fallback service for when Parse is not configured - got some help creating during our problem solving process 
class LocalStorageService {
  constructor() {
    this.storageKey = 'moodJournal_data';
    this.initializeDefaultData();
  }

  initializeDefaultData() {
    const existingData = this.getData();
    if (!existingData.moodEntries) {
      existingData.moodEntries = [];
    }
    if (!existingData.moodOptions) {
      existingData.moodOptions = {
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
    if (!existingData.moodColors) {
      existingData.moodColors = {
        ecstatic: { color: "#FF69B4", name: "Hot Pink", description: "A vibrant, energetic color that reflects your amazing high spirits!" },
        happy: { color: "#FFD700", name: "Golden Yellow", description: "A bright, cheerful color that captures your positive energy." },
        content: { color: "#87CEEB", name: "Sky Blue", description: "A calm, peaceful color that represents your inner satisfaction." },
        neutral: { color: "#98FB98", name: "Pale Green", description: "A balanced color that reflects your steady, composed state." },
        anxious: { color: "#DDA0DD", name: "Plum", description: "A thoughtful color that acknowledges your current concerns." },
        sad: { color: "#4169E1", name: "Royal Blue", description: "A deep, reflective color that honors your emotions." },
        frustrated: { color: "#FF6347", name: "Tomato", description: "An intense color that captures your current agitation." }
      };
    }
    this.saveData(existingData);
  }

  getData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return {};
    }
  }

  saveData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // MoodEntry methods
  async getAllEntries() {
    const data = this.getData();
    return data.moodEntries || [];
  }

  async createEntry(moodData) {
    const data = this.getData();
    const newEntry = {
      ...moodData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    data.moodEntries = data.moodEntries || [];
    data.moodEntries.unshift(newEntry);
    this.saveData(data);
    return newEntry;
  }

  async getStatistics() {
    const entries = await this.getAllEntries();
    
    if (entries.length === 0) {
      return {
        totalEntries: 0,
        averageStressLevel: 0,
        mostCommonMood: null,
        moodDistribution: {},
        recentTrend: 'stable',
      };
    }

    const totalStress = entries.reduce((sum, entry) => sum + (entry.stressLevel || 0), 0);
    const averageStressLevel = Math.round(totalStress / entries.length);

    const moodDistribution = {};
    entries.forEach((entry) => {
      const mood = entry.overallMood;
      moodDistribution[mood] = (moodDistribution[mood] || 0) + 1;
    });

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

  // Mood Options methods
  async getAllOptions() {
    const data = this.getData();
    return data.moodOptions || {};
  }

  // Mood Colors methods
  async getAllColors() {
    const data = this.getData();
    return data.moodColors || {};
  }

  async generateMoodColor(mood) {
    const colors = await this.getAllColors();
    return colors[mood] || { color: "#808080", name: "Unknown", description: "A unique color that represents your current emotional state." };
  }
}

export default LocalStorageService;
