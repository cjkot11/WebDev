import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MoodEntry from '../models/MoodEntry';
import MoodOptions from '../models/MoodOptions';
import MoodColors from '../models/MoodColors';
import { generateColorFromMoodData } from '../utils/colorDecisionLogic';
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
    tags: [], // Story 6: Tags (max 3)
  });
  const [tagInput, setTagInput] = useState('');
  const [availableTags, setAvailableTags] = useState(['work', 'family', 'stress', 'exercise', 'social', 'creative', 'rest', 'travel', 'health', 'celebration']);
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

      // Use the decision-making function that considers multiple mood factors
      // Extract scores and keywords from text fields if needed
      const sentimentScores = extractSentimentScores(formData);
      const keywords = extractKeywords(formData);

      const moodData = {
        overallMood: formData.overallMood,
        energyLevel: formData.energyLevel,
        stressLevel: formData.stressLevel,
        socialInteractions: formData.socialInteractions,
        primaryThoughts: formData.primaryThoughts,
        sentimentScores: sentimentScores,
        keywords: keywords,
        tags: formData.tags || []
      };

      // Get color using decision logic function (feature 6)
      const colorData = await generateColorFromMoodData(moodData);

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

  // Extract scores from text fields (simple keyword-based analysis)
  const extractSentimentScores = (formData) => {
    const positiveWords = ['grateful', 'happy', 'great', 'wonderful', 'amazing', 'excited', 'love', 'joy', 'celebration', 'success', 'achievement'];
    const negativeWords = ['worried', 'anxious', 'stress', 'sad', 'frustrated', 'tired', 'lonely', 'concerned', 'difficult', 'challenge'];
    
    const text = `${formData.gratitude || ''} ${formData.highlight || ''} ${formData.intention || ''}`.toLowerCase();
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      if (text.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (text.includes(word)) negativeCount++;
    });
    
    const totalWords = positiveCount + negativeCount;
    if (totalWords === 0) {
      return { positive: 0.5, negative: 0.3, neutral: 0.2 };
    }
    
    return {
      positive: positiveCount / totalWords,
      negative: negativeCount / totalWords,
      neutral: 1 - (positiveCount / totalWords) - (negativeCount / totalWords)
    };
  };

  // Extract keywords from text fields
  const extractKeywords = (formData) => {
    const keywords = [];
    const text = `${formData.gratitude || ''} ${formData.highlight || ''} ${formData.intention || ''}`.toLowerCase();
    
    // Common mood-related keywords
    const moodKeywords = ['work', 'family', 'friends', 'health', 'exercise', 'creative', 'relaxation', 'learning', 'celebration', 'stress', 'peaceful', 'energetic'];
    
    moodKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        keywords.push(keyword);
      }
    });
    
    // Add tags as keywords
    if (formData.tags && Array.isArray(formData.tags)) {
      keywords.push(...formData.tags);
    }
    
    return [...new Set(keywords)]; // Remove duplicates
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
        tags: [], // Story 6: Reset tags
      });
      setTagInput('');
      setCurrentMoodEntry(null);
    } catch (error) {
      console.error('Error saving mood entry:', error);
      setError('Failed to save mood entry');
    } finally {
      setLoading(false);
    }
  };

  // Story 6: Tag handlers
  const handleAddTag = (tag) => {
    const currentTags = formData.tags || [];
    if (currentTags.length >= 3) {
      setError('Maximum 3 tags allowed');
      return;
    }
    const normalizedTag = tag.toLowerCase().trim();
    if (normalizedTag && !currentTags.includes(normalizedTag)) {
      setFormData({ ...formData, tags: [...currentTags, normalizedTag] });
      setTagInput('');
      setError(null);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const currentTags = formData.tags || [];
    setFormData({
      ...formData,
      tags: currentTags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tagInput.trim()) {
        handleAddTag(tagInput);
      }
    }
  };

  //resetting the form - outside the other function (a little repetitive but it is a work around)
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
      tags: [],
    });
    setTagInput('');
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

        {/* Story 6: Tags */}
        <div className="form-group">
          <label htmlFor="tags">Tags (optional, max 3)</label>
          <div className="tag-input-container">
            <input
              type="text"
              id="tag-input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder={(formData.tags || []).length >= 3 ? "Maximum 3 tags reached" : "Type a tag and press Enter"}
              disabled={(formData.tags || []).length >= 3}
              style={{ width: '100%', padding: '0.8rem', border: '2px solid #e1e5e9', borderRadius: 8 }}
            />
            <button
              type="button"
              onClick={() => handleAddTag(tagInput)}
              disabled={(formData.tags || []).length >= 3 || !tagInput.trim()}
              className="add-tag-button"
              style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#667eea', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}
            >
              Add Tag
            </button>
          </div>
          {(formData.tags || []).length > 0 && (
            <div className="tags-display" style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(formData.tags || []).map((tag, index) => (
                <span
                  key={index}
                  className="tag-badge"
                  style={{
                    background: '#667eea',
                    color: 'white',
                    padding: '0.3rem 0.8rem',
                    borderRadius: 15,
                    fontSize: '0.9rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    style={{
                      background: 'rgba(255,255,255,0.3)',
                      border: 'none',
                      color: 'white',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      lineHeight: '1'
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="available-tags" style={{ marginTop: '0.5rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.3rem' }}>Suggested tags:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {availableTags
                .filter(tag => !(formData.tags || []).includes(tag.toLowerCase()))
                .slice(0, 8)
                .map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    disabled={(formData.tags || []).length >= 3}
                    style={{
                      padding: '0.2rem 0.6rem',
                      background: '#f0f0f0',
                      border: '1px solid #ddd',
                      borderRadius: 12,
                      fontSize: '0.8rem',
                      cursor: (formData.tags || []).length >= 3 ? 'not-allowed' : 'pointer',
                      opacity: (formData.tags || []).length >= 3 ? 0.5 : 1
                    }}
                  >
                    {tag}
                  </button>
                ))}
            </div>
          </div>
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
