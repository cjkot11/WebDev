import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MoodEntry from '../models/MoodEntry';
import MoodOptions from '../models/MoodOptions';
import TrendGraph from './TrendGraph'; // Story 4: Trend Graph
import './History.css';

//the mood history page 
const History = () => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [moodOptions, setMoodOptions] = useState(null);
  const [filters, setFilters] = useState({
    mood: '',
    dateRange: 'all',
    tag: '', // Story 6: Tag filter
  });
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  //helper function to get value from entry (handles both Parse objects and plain objects)
  const getEntryValue = (entry, key) => {
    return entry.get ? entry.get(key) : entry[key];
  };

  // Reload data when component mounts or when route changes (e.g., after saving an entry)
  useEffect(() => {
    loadData();
  }, [location.pathname]);

  useEffect(() => {
    applyFilters();
  }, [moodEntries, filters]);
  
  //loading the data in 
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      await new Promise(resolve => setTimeout(resolve, 600));

      //load data from the parse models (will fallback to localStorage on error)
      const [entries, options] = await Promise.all([
        MoodEntry.getAllEntries().catch(() => []), // Fallback to empty array if error
        MoodOptions.getAllOptions().catch(() => MoodOptions.getDefaultOptions()), // Fallback to defaults if error
      ]);

      setMoodEntries(entries || []);
      setMoodOptions(options || MoodOptions.getDefaultOptions());
      
      // Story 6: Extract all unique tags from entries
      const allTags = new Set();
      (entries || []).forEach(entry => {
        const tags = getEntryValue(entry, 'tags') || [];
        if (Array.isArray(tags)) {
          tags.forEach(tag => allTags.add(tag));
        }
      });
      setAvailableTags(Array.from(allTags).sort());
      
      //for our errors
      console.log('History data loaded:', {
        entries: entries?.length || 0,
        options: Object.keys(options || {}),
        tags: Array.from(allTags),
      });
    } catch (error) {
      console.error('Error loading history data:', error);
      // Even on error, initialize with empty/default values so page doesn't break
      setMoodEntries([]);
      setMoodOptions(MoodOptions.getDefaultOptions());
      setError('Failed to load mood history - using default options');
    } finally {
      setLoading(false);
    }
  };

  //filters that the user can apply
  const applyFilters = () => {
    let filtered = [...moodEntries];

    //mood filter
    if (filters.mood) {
      filtered = filtered.filter(
        (entry) => getEntryValue(entry, 'overallMood') === filters.mood
      );
    }

    //date range 
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate;

      switch (filters.dateRange) {
        case 'week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffDate = null;
      }

      if (cutoffDate) {
        filtered = filtered.filter((entry) => {
          const entryDate = new Date(getEntryValue(entry, 'date'));
          return entryDate >= cutoffDate;
        });
      }
    }

    // Story 6: Tag filter
    if (filters.tag) {
      filtered = filtered.filter((entry) => {
        const entryTags = getEntryValue(entry, 'tags') || [];
        return Array.isArray(entryTags) && entryTags.includes(filters.tag);
      });
    }

    //to tell the user 
    setFilteredEntries(filtered);
    console.log(
      `Filtered entries: ${filtered.length} of ${moodEntries.length}`
    );
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({ ...filters, [filterType]: value });
  };

  //clear 
  const clearFilters = () => {
    setFilters({
      mood: '',
      dateRange: 'all',
      tag: '', // Story 6: Clear tag filter
    });
  };

  //for each entry 
  const createEntryCard = (entry) => {
    const date = new Date(getEntryValue(entry, 'date'));
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const socialInteractions = getEntryValue(entry, 'socialInteractions') || [];
    const gratitude = getEntryValue(entry, 'gratitude') || '';
    const highlight = getEntryValue(entry, 'highlight') || '';
    const tags = getEntryValue(entry, 'tags') || []; // Story 6: Get tags

    //html
    return (
      <div key={entry.id || entry.objectId} className="entry-card">
        <div className="entry-header">
          <div className="entry-date">{formattedDate}</div>
          <div
            className="entry-mood-color"
            style={{ backgroundColor: getEntryValue(entry, 'moodColor') }}
          ></div>
        </div>
        <div className="entry-content">
          <div className="entry-mood">
            <strong>Mood:</strong> {getEntryValue(entry, 'colorName')}
          </div>
          <div className="entry-details">
            <div className="detail-item">
              <span className="detail-label">Energy:</span>
              <span className="detail-value">{getEntryValue(entry, 'energyLevel')}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Stress:</span>
              <span className="detail-value">{getEntryValue(entry, 'stressLevel')}/10</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Focus:</span>
              <span className="detail-value">{getEntryValue(entry, 'primaryThoughts')}</span>
            </div>
          </div>
          {/* Story 6: Display tags */}
          {Array.isArray(tags) && tags.length > 0 && (
            <div className="entry-tags" style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="tag-badge"
                  style={{
                    background: '#667eea',
                    color: 'white',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 12,
                    fontSize: '0.8rem'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {socialInteractions.length > 0 && (
            <div className="entry-social">
              <strong>Social:</strong> {socialInteractions.join(', ')}
            </div>
          )}
          {gratitude && (
            <div className="entry-gratitude">
              <strong>Grateful for:</strong> {gratitude}
            </div>
          )}
          {highlight && (
            <div className="entry-highlight">
              <strong>Highlight:</strong> {highlight}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderColorPalette = () => {
    if (filteredEntries.length === 0) {
      return (
        <div className="palette-empty">
          <p>No colors to display yet</p>
          <p>Complete some entries to see your color palette!</p>
        </div>
      );
    }

    // Get unique colors from filtered entries
    const uniqueColors = [
      ...new Set(filteredEntries.map((entry) => getEntryValue(entry, 'moodColor'))),
    ];

    return (
      <div className="color-swatches">
        {uniqueColors.map((color) => {
          const matchingEntry = filteredEntries.find((entry) => getEntryValue(entry, 'moodColor') === color);
          const colorName = matchingEntry ? getEntryValue(matchingEntry, 'colorName') : 'Unknown';
          const count = filteredEntries.filter(
            (entry) => getEntryValue(entry, 'moodColor') === color
          ).length;

          return (
            <div key={color} className="color-swatch" style={{ backgroundColor: color }}>
              <div className="swatch-info">
                <div className="swatch-name">{colorName}</div>
                <div className="swatch-count">
                  {count} {count === 1 ? 'entry' : 'entries'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPaletteStats = () => {
    if (filteredEntries.length === 0) {
      return null;
    }

    const totalEntries = filteredEntries.length;
    const uniqueColors = [
      ...new Set(filteredEntries.map((entry) => getEntryValue(entry, 'moodColor'))),
    ];
    const avgStress =
      filteredEntries.reduce((sum, entry) => sum + getEntryValue(entry, 'stressLevel'), 0) /
      totalEntries;

    return (
      <div className="palette-stats">
        <div className="stat-item">
          <div className="stat-number">{totalEntries}</div>
          <div className="stat-label">Total Entries</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{uniqueColors.length}</div>
          <div className="stat-label">Unique Colors</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{avgStress.toFixed(1)}</div>
          <div className="stat-label">Avg Stress</div>
        </div>
      </div>
    );
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
          <button onClick={loadData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="header-section">
        <h1>Mood History</h1>
        <p>Explore your emotional journey through colors and patterns</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <h3>Filter Entries</h3>
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="mood-filter">Mood:</label>
            <select
              id="mood-filter"
              value={filters.mood}
              onChange={(e) => handleFilterChange('mood', e.target.value)}
            >
              <option value="">All Moods</option>
              {moodOptions?.overallMood?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label.split(' - ')[0]}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="date-range">Date Range:</label>
            <select
              id="date-range"
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>

          {/* Story 6: Tag filter */}
          {availableTags.length > 0 && (
            <div className="filter-group">
              <label htmlFor="tag-filter">Tag:</label>
              <select
                id="tag-filter"
                value={filters.tag}
                onChange={(e) => handleFilterChange('tag', e.target.value)}
              >
                <option value="">All Tags</option>
                {availableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button onClick={clearFilters} className="clear-filters">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Entries */}
      <div className="entries-section">
        <h3>Your Mood Entries</h3>
        <div className="entries-container">
          {filteredEntries.length === 0 ? (
            <div className="no-entries">
              <h4>No mood entries found</h4>
              <p>
                {moodEntries.length === 0
                  ? "Complete your first daily entry to start tracking!"
                  : "Try adjusting your filters to see more entries."}
              </p>
            </div>
          ) : (
            filteredEntries
              .sort((a, b) => new Date(getEntryValue(b, 'date')) - new Date(getEntryValue(a, 'date')))
              .map((entry) => createEntryCard(entry))
          )}
        </div>
      </div>

      {/* Story 4: Mood Trend Line Graph */}
      <TrendGraph entries={moodEntries} />

      {/* Color Palette */}
      <div className="palette-section">
        <h3>Your Color Palette</h3>
        {renderColorPalette()}
        {renderPaletteStats()}
      </div>
    </div>
  );
};

export default History;
