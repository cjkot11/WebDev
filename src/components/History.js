import React, { useState, useEffect } from 'react';
import MoodEntry from '../models/MoodEntry';
import MoodOptions from '../models/MoodOptions';
import './History.css';

const History = () => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [moodOptions, setMoodOptions] = useState(null);
  const [filters, setFilters] = useState({
    mood: '',
    dateRange: 'all',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get value from entry (handles both Parse objects and plain objects)
  const getEntryValue = (entry, key) => {
    return entry.get ? entry.get(key) : entry[key];
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [moodEntries, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 600));

      // Load data from Parse Models (queries outside components)
      const [entries, options] = await Promise.all([
        MoodEntry.getAllEntries(),
        MoodOptions.getAllOptions(),
      ]);

      setMoodEntries(entries);
      setMoodOptions(options);

      console.log('History data loaded:', {
        entries: entries.length,
        options: Object.keys(options),
      });
    } catch (error) {
      console.error('Error loading history data:', error);
      setError('Failed to load mood history');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...moodEntries];

    // Apply mood filter
    if (filters.mood) {
      filtered = filtered.filter(
        (entry) => getEntryValue(entry, 'overallMood') === filters.mood
      );
    }

    // Apply date range filter
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

    setFilteredEntries(filtered);
    console.log(
      `Filtered entries: ${filtered.length} of ${moodEntries.length}`
    );
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({ ...filters, [filterType]: value });
  };

  const clearFilters = () => {
    setFilters({
      mood: '',
      dateRange: 'all',
    });
  };

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
