import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot } from 'recharts';
import './TrendGraph.css';

/**
 * Story 4: Mood Trend Line Graph Component (Caz - Feature 6)
 * Displays a visual line graph showing how mood colors have changed over time
 */
const TrendGraph = ({ entries = [] }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Helper function to get value from entry (handles both Parse objects and plain objects)
  const getEntryValue = (entry, key) => {
    return entry.get ? entry.get(key) : entry[key];
  };

  // Convert hex color to a numeric value (0-100) for Y-axis
  // Must be defined before useMemo that uses it
  const getColorValue = (hexColor) => {
    if (!hexColor || !hexColor.startsWith('#')) return 50;
    
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate relative luminance (simplified)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return Math.round(luminance * 100);
  };

  // Transform entries into chart data format
  const chartData = useMemo(() => {
    if (!entries || entries.length === 0) return [];

    // Sort entries by date (chronological)
    const sortedEntries = [...entries].sort((a, b) => {
      const dateA = new Date(getEntryValue(a, 'date'));
      const dateB = new Date(getEntryValue(b, 'date'));
      return dateA - dateB;
    });

    return sortedEntries.map((entry, index) => {
      const date = new Date(getEntryValue(entry, 'date'));
      const moodColor = getEntryValue(entry, 'moodColor') || '#CCCCCC';
      const colorName = getEntryValue(entry, 'colorName') || 'Unknown';
      const overallMood = getEntryValue(entry, 'overallMood') || '';
      const stressLevel = getEntryValue(entry, 'stressLevel') || 5;

      // Convert color to a numeric value for the Y-axis (0-100 scale)
      // This is a simple conversion - you could use HSL lightness or other methods
      const colorValue = getColorValue(moodColor);

      return {
        index: index + 1,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date.toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric' 
        }),
        colorValue,
        moodColor,
        colorName,
        overallMood,
        stressLevel,
        entry: entry, // Store full entry for tooltip
      };
    });
  }, [entries]);

  // Custom dot component that shows the actual mood color
  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    return (
      <Dot
        cx={cx}
        cy={cy}
        r={8}
        fill={payload.moodColor}
        stroke="#fff"
        strokeWidth={2}
        onMouseEnter={() => setHoveredPoint(payload)}
        onMouseLeave={() => setHoveredPoint(null)}
        style={{ cursor: 'pointer' }}
      />
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="trend-tooltip">
          <div className="tooltip-header">
            <div
              className="tooltip-color-indicator"
              style={{ backgroundColor: data.moodColor }}
            ></div>
            <div>
              <strong>{data.fullDate}</strong>
            </div>
          </div>
          <div className="tooltip-content">
            <div><strong>Mood:</strong> {data.colorName}</div>
            <div><strong>Overall:</strong> {data.overallMood}</div>
            <div><strong>Stress Level:</strong> {data.stressLevel}/10</div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="trend-graph-empty">
        <p>No mood entries yet</p>
        <p>Create some entries to see your mood trend!</p>
      </div>
    );
  }

  return (
    <div className="trend-graph-container">
      <h3>Mood Trend Over Time</h3>
      <div className="trend-graph-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#666"
              tick={{ fontSize: 12 }}
              label={{ value: 'Mood Value', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="colorValue"
              stroke="#667eea"
              strokeWidth={2}
              dot={<CustomDot />}
              name="Mood Trend"
              activeDot={{ r: 10 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {hoveredPoint && (
        <div className="hovered-point-info">
          <strong>{hoveredPoint.fullDate}</strong> - {hoveredPoint.colorName}
        </div>
      )}
    </div>
  );
};

export default TrendGraph;

