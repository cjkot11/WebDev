import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MoodEntry from '../models/MoodEntry';
import MoodOptions from '../models/MoodOptions';
import MoodColors from '../models/MoodColors';
import './Entry.css';

//making the entry
const Entry = () => {
  const [formData, setFormData] = useState({
    overallMood: '',
    energyLevel: '',
    socialInteractions: [],
    stressLevel: 5,
    primaryThoughts: '',
    gratitude: '',
    highlight: '',
    intention: '',
  });
  const [moodOptions, setMoodOptions] = useState(null);
  const [currentMoodEntry, setCurrentMoodEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadMoodOptions();
  }, []);

  const loadMoodOptions = async () => {
    try {
      // load mood options from Parse Model -> queries outside components 
      const options = await MoodOptions.getAllOptions();
      setMoodOptions(options);
      console.log('Mood options loaded:', options);
    } catch (error) {
      console.error('Error loading mood options:', error);
      setError('Failed to load mood options');
    }
  };

  //handles the user input on the entry
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const socialInteractions = [...formData.socialInteractions];
      if (checked) {
        socialInteractions.push(value);
      } else {
        const index = socialInteractions.indexOf(value);
        if (index > -1) {
          socialInteractions.splice(index, 1);
        }
      }
      setFormData({ ...formData, socialInteractions });
    } else if (type === 'range') {
      // Range inputs return strings, convert to number
      setFormData({ ...formData, [name]: parseInt(value, 10) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  //entry validation once the user wants to submit
  const validateForm = () => {
    const errors = [];
    //errors for each of the required inputs

    if (!formData.overallMood) {
      errors.push('Please select your overall mood');
    }

    if (!formData.energyLevel) {
      errors.push('Please select your energy level');
    }

    if (!formData.primaryThoughts) {
      errors.push('Please select what dominated your thoughts');
    }

    if (formData.stressLevel < 1 || formData.stressLevel > 10) {
      errors.push('Stress level must be between 1 and 10');
    }

    return errors;
  };

  //generating the entry
  const generateMoodEntry = async (formData) => {
    try {
      // simulate async processing
      await new Promise(resolve => setTimeout(resolve, 800));

      // get moood color from the parse model
      const colorData = await MoodColors.generateMoodColor(formData.overallMood);

      const moodEntry = {
        ...formData,
        moodColor: colorData.color,
        colorName: colorData.name,
        colorDescription: colorData.description,
      };

      return moodEntry;
    } catch (error) {
      console.error('Error generating mood entry:', error);
      throw error;
    }
  };

  //the user submitting
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // validate form
      const errors = validateForm();
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      //generate
      const moodEntry = await generateMoodEntry(formData);
      setCurrentMoodEntry(moodEntry);

      console.log('Mood entry generated:', moodEntry);
    } catch (error) {
      console.error('Error handling form submission:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  //saving the entry
  const saveMoodEntry = async () => {
    try {
      if (!currentMoodEntry) {
        throw new Error('No mood entry to save');
      }

      setLoading(true);
      setError(null);

      //using the promise
      await new Promise(resolve => setTimeout(resolve, 500));

      //using parse model to save 
      const savedEntry = await MoodEntry.createEntry(currentMoodEntry);

      console.log('Mood entry saved:', savedEntry);
      setSuccess('Mood entry saved successfully!');

      //reset 
      setFormData({
        overallMood: '',
        energyLevel: '',
        socialInteractions: [],
        stressLevel: 5,
        primaryThoughts: '',
        gratitude: '',
        highlight: '',
        intention: '',
      });
      setCurrentMoodEntry(null);
    } catch (error) {
      console.error('Error saving mood entry:', error);
      setError('Failed to save mood entry');
    } finally {
      setLoading(false);
    }
  };

  //resetting the form
  const resetForm = () => {
    setFormData({
      overallMood: '',
      energyLevel: '',
      socialInteractions: [],
      stressLevel: 5,
      primaryThoughts: '',
      gratitude: '',
      highlight: '',
      intention: '',
    });
    setCurrentMoodEntry(null);
    setError(null);
    setSuccess(null);
  };

  //load spinner
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
//html
  return (
    <div className="entry-container">
      <div className="header-section">
        <h1>Daily Mood Entry</h1>
        <p>Take a moment to reflect on your day and track your emotions</p>
      </div>

      {error && (
        <div className="error-message">
          <div className="error-content">
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={() => setError(null)}>Close</button>
          </div>
        </div>
      )}

      {success && (
        <div className="success-message">
          <div className="success-content">
            <h3>Success!</h3>
            <p>{success}</p>
            <button onClick={() => setSuccess(null)}>Close</button>
          </div>
        </div>
      )}

      <form id="mood-form" onSubmit={handleSubmit} className="mood-form">
        {/* Overall Mood */}
        <div className="form-group">
          <label htmlFor="overallMood">How are you feeling overall?</label>
          <select
            id="overallMood"
            name="overallMood"
            value={formData.overallMood}
            onChange={handleInputChange}
            required
          >
            <option value="">Choose your mood...</option>
            {moodOptions?.overallMood?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Energy Level */}
        <div className="form-group">
          <label htmlFor="energyLevel">What's your energy level?</label>
          <select
            id="energyLevel"
            name="energyLevel"
            value={formData.energyLevel}
            onChange={handleInputChange}
            required
          >
            <option value="">Select energy level...</option>
            {moodOptions?.energyLevel?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Social Interactions */}
        <div className="form-group">
          <label>Who did you interact with today?</label>
          <div className="checkbox-group">
            {moodOptions?.socialInteractions?.map((option) => (
              <label key={option.value} className="checkbox-label">
                <input
                  type="checkbox"
                  name="socialInteractions"
                  value={option.value}
                  checked={formData.socialInteractions.includes(option.value)}
                  onChange={handleInputChange}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        {/* Stress Level */}
        <div className="form-group">
          <label htmlFor="stress-slider">
            Stress Level: {formData.stressLevel}/10
          </label>
          <input
            type="range"
            id="stress-slider"
            name="stressLevel"
            min="1"
            max="10"
            value={formData.stressLevel}
            onChange={handleInputChange}
            className="stress-slider"
          />
        </div>

        {/* Primary Thoughts */}
        <div className="form-group">
          <label htmlFor="primaryThoughts">What dominated your thoughts today?</label>
          <select
            id="primaryThoughts"
            name="primaryThoughts"
            value={formData.primaryThoughts}
            onChange={handleInputChange}
            required
          >
            <option value="">Select primary focus...</option>
            {moodOptions?.primaryThoughts?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Gratitude */}
        <div className="form-group">
          <label htmlFor="gratitude">What are you grateful for today?</label>
          <textarea
            id="gratitude"
            name="gratitude"
            value={formData.gratitude}
            onChange={handleInputChange}
            placeholder="Share something you're thankful for..."
            rows="3"
          />
        </div>

        {/* Highlight */}
        <div className="form-group">
          <label htmlFor="highlight">What was the highlight of your day?</label>
          <textarea
            id="highlight"
            name="highlight"
            value={formData.highlight}
            onChange={handleInputChange}
            placeholder="Describe the best part of your day..."
            rows="3"
          />
        </div>

        {/* Intention */}
        <div className="form-group">
          <label htmlFor="intention">What's your intention for tomorrow?</label>
          <textarea
            id="intention"
            name="intention"
            value={formData.intention}
            onChange={handleInputChange}
            placeholder="Set an intention for tomorrow..."
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Generate My Mood Color
          </button>
          <button type="button" onClick={resetForm} className="reset-button">
            Reset Form
          </button>
        </div>
      </form>

      {/* Result Section */}
      {currentMoodEntry && (
        <div id="result-section" className="result-section">
          <h3>Your Mood Color</h3>
          <div className="color-display">
            <div
              className="color-circle"
              style={{ backgroundColor: currentMoodEntry.moodColor }}
            ></div>
            <div className="color-info">
              <h4 id="color-name">{currentMoodEntry.colorName}</h4>
              <p id="color-description">{currentMoodEntry.colorDescription}</p>
            </div>
          </div>
          <div className="result-actions">
            <button onClick={saveMoodEntry} className="save-button">
              Save Entry
            </button>
            <Link to="/history" className="view-history-button">
              View History
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Entry;
