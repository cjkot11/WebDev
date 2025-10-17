import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MoodEntry from '../models/MoodEntry';
import './Home.css';

//home page 
const Home = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  //loading in the data 
  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      await new Promise(resolve => setTimeout(resolve, 500));

      //stats from the parse model 
      const statistics = await MoodEntry.getStatistics();
      setStats(statistics);

      console.log('Statistics loaded:', statistics);
    } catch (error) {
      console.error('Error loading statistics:', error);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={loadStatistics}>Retry</button>
        </div>
      </div>
    );
  }

  //html
  return (
    <div className="home-container">
      <div className="header-section">
        <h1>Mood Color Journal</h1>
        <h2>Track Your Daily Emotions Through Colors</h2>

        {/* Image from the public folder */}
        <img
          src="/images/colors.jpg"
          alt="colorful image"
          width="300"
          height="200"
        />

        <p>Find your own rainbow</p>
      </div>

      <hr />

      <div className="content-section">
        <h3>Welcome to Your Personal Mood Tracker!</h3>

        <div className="how-it-works">
          <b>How it works:</b>
          <ol>
            <li>Complete your daily mood questionnaire</li>
            <li>Receive your personalized mood color</li>
            <li>View your emotional journey over time</li>
            <li>Reflect on patterns and growth</li>
          </ol>
        </div>
      </div>

      <hr />

      <div className="cta-section">
        <h3>Ready to Start Your Colorful Journey?</h3>
        <p>
          <Link to="/entry">
            <button className="cta-button">Create Today's Entry</button>
          </Link>
        </p>
        <p>
          Or{' '}
          <Link to="/history">view your past moods</Link> to see your progress!
        </p>
      </div>

      {/* Statistics Section */}
      {stats && stats.totalEntries > 0 && (
        <div className="stats-section">
          <h3>Your Mood Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{stats.totalEntries}</div>
              <div className="stat-label">Total Entries</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.averageStressLevel}</div>
              <div className="stat-label">Avg Stress Level</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {stats.mostCommonMood
                  ? stats.mostCommonMood.charAt(0).toUpperCase() +
                    stats.mostCommonMood.slice(1)
                  : 'None'}
              </div>
              <div className="stat-label">Most Common Mood</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
