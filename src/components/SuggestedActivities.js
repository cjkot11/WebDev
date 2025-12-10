import React, { useState, useEffect } from 'react';
import MoodEntry from '../models/MoodEntry';
import MoodOptions from '../models/MoodOptions';
import { getActivitiesForMood, getRandomActivitiesForMood } from '../utils/activitySuggestions';
import './SuggestedActivities.css';

/**
 * Suggested Activities Component (Sophia Feature 6)
 * Displays activity suggestions based on user's current mood or most recent entry
 */
const SuggestedActivities = () => {
  const [recentEntry, setRecentEntry] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [activities, setActivities] = useState([]);
  const [moodOptions, setMoodOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // helper function to get value from entry
  const getEntryValue = (entry, key) => {
    return entry.get ? entry.get(key) : entry[key];
  };

  // Load recent entry and mood options on component mount
  useEffect(() => {
    loadData();
  }, []);

  // update activities when selected mood changes
  useEffect(() => {
    if (selectedMood) {
      const suggestedActivities = getRandomActivitiesForMood(selectedMood, 5);
      setActivities(suggestedActivities);
    }
  }, [selectedMood]);

  //load recent entry and mood options
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      //done in parallel
      const [options, entries] = await Promise.all([
        MoodOptions.getAllOptions().catch(() => MoodOptions.getDefaultOptions()),
        MoodEntry.getAllEntries().catch(() => [])
      ]);

      setMoodOptions(options || MoodOptions.getDefaultOptions());

      //most recent entry
      if (entries && entries.length > 0) {
        // Sort by date (most recent first)
        const sortedEntries = [...entries].sort((a, b) => {
          const dateA = getEntryValue(a, 'date') || getEntryValue(a, 'createdAt');
          const dateB = getEntryValue(b, 'date') || getEntryValue(b, 'createdAt');
          return new Date(dateB) - new Date(dateA);
        });

        const mostRecent = sortedEntries[0];
        setRecentEntry(mostRecent);
        
        //initial mood from most recent entry
        const recentMood = getEntryValue(mostRecent, 'overallMood');
        if (recentMood) {
          setSelectedMood(recentMood);
        }
      } else {
        // No entries - default to neutral mood
        setSelectedMood('neutral');
      }
    } catch (error) {
      console.error('Error loading data for suggested activities:', error);
      setError('Failed to load mood data');
      setSelectedMood('neutral');
    } finally {
      setLoading(false);
    }
  };

  //handles mood selection change
  const handleMoodChange = (e) => {
    const newMood = e.target.value;
    setSelectedMood(newMood);
  };

  //get mood label from value
  const getMoodLabel = (moodValue) => {
    if (!moodOptions || !moodOptions.overallMood) return moodValue;
    const mood = moodOptions.overallMood.find(m => m.value === moodValue);
    return mood ? mood.label : moodValue;
  };

  if (loading) {
    return (
      <div className="activities-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading activity suggestions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="activities-container">
      <div className="activities-header">
        <h1>Suggested Activities</h1>
        <p>Get personalized activity recommendations based on your mood</p>
      </div>

      {error && (
        <div className="activities-error">
          <p>{error}</p>
          <button onClick={loadData}>Retry</button>
        </div>
      )}

      {/* Mood Selection */}
      <div className="mood-selection-section">
        <label htmlFor="mood-select">
          <strong>Select your current mood:</strong>
        </label>
        <select
          id="mood-select"
          value={selectedMood || ''}
          onChange={handleMoodChange}
          className="mood-select"
        >
          {moodOptions?.overallMood?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {recentEntry && (
          <p className="recent-entry-note">
            💡 Based on your most recent entry: <strong>{getMoodLabel(getEntryValue(recentEntry, 'overallMood'))}</strong>
          </p>
        )}
      </div>

      {/* Activities Display */}
      {selectedMood && activities.length > 0 && (
        <div className="activities-section">
          <h2>Activities for {getMoodLabel(selectedMood)}</h2>
          <p className="activities-intro">
            Here are {activities.length} activities tailored to help you based on your current mood:
          </p>
          
          <div className="activities-grid">
            {activities.map((activity, index) => (
              <div key={index} className="activity-card">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <h3 className="activity-title">{activity.title}</h3>
                  <p className="activity-description">{activity.description}</p>
                  <span className="activity-category">{activity.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="activities-info">
        <h3>How It Works</h3>
        <p>
          Our activity suggestions are tailored to your current mood. Each mood type receives activities 
          designed to either enhance positive feelings, provide support during difficult times, or help 
          you find balance. Activities are selected to be appropriate and helpful for your emotional state.
        </p>
        <ul>
          <li><strong>Positive moods</strong> (ecstatic, happy): Activities to maintain and share your positive energy</li>
          <li><strong>Calm moods</strong> (content, neutral): Activities to maintain balance and explore interests</li>
          <li><strong>Challenging moods</strong> (anxious, sad, frustrated): Activities to provide support, calm, or energize</li>
        </ul>
      </div>
    </div>
  );
};

export default SuggestedActivities;

