import MoodColors from '../models/MoodColors';

// Cache for color palette to avoid repeated fetches -> problem that I ran into in development 
let colorPaletteCache = null;

/**
 * Load color palette from JSON file that is in Data 
 * @returns {Promise<Array>} Array of color objects with name and hex
 */
async function loadColorPalette() {
  if (colorPaletteCache) {
    return colorPaletteCache;
  }

  try {
    const response = await fetch('/data/colorPalette.json');
    if (!response.ok) {
      throw new Error('Failed to load color palette');
    }
    colorPaletteCache = await response.json();
    return colorPaletteCache;
  } catch (error) {
    console.warn('Failed to load color palette, using fallback:', error);
    //returns a minimal fallback palette
    return [
      { name: "Gold", hex: "#FFD700" },
      { name: "Hot Pink", hex: "#FF69B4" },
      { name: "Sky Blue", hex: "#87CEEB" },
      { name: "Pale Green", hex: "#98FB98" },
      { name: "Plum", hex: "#DDA0DD" },
      { name: "Royal Blue", hex: "#4169E1" },
      { name: "Tomato", hex: "#FF6347" }
    ];
  }
}

/**
 * Categorize colors by their characteristics (warm, cool, neutral, intense, soft)
 * @param {Array} colors - Array of color objects
 * @returns {Object} Categorized colors
 */
function categorizeColors(colors) {
  const categories = {
    warm: [],      // Yellows, oranges, reds, pinks
    cool: [],      // Blues, greens, purples
    neutral: [],   // Grays, browns, beiges
    intense: [],   // Bright, vibrant colors
    soft: []       // Pastels, muted colors
  };

  colors.forEach(color => {
    const rgb = hexToRgb(color.hex);
    if (!rgb) return;

    // Calculate brightness and saturation - AI help for the formula
    const brightness = (rgb.r + rgb.g + rgb.b) / 3;
    const max = Math.max(rgb.r, rgb.g, rgb.b);
    const min = Math.min(rgb.r, rgb.g, rgb.b);
    const saturation = max === 0 ? 0 : (max - min) / max;

    // Categorize by hue (warm vs cool) - AI help for the formula
    if (rgb.r > rgb.b && rgb.r > rgb.g - 30) {
      categories.warm.push(color);
    } else if (rgb.b > rgb.r && rgb.g > rgb.r) {
      categories.cool.push(color);
    } else {
      categories.neutral.push(color);
    }

    // Categorize by intensity - AI help for the formula
    if (brightness > 200 && saturation > 0.5) {
      categories.intense.push(color);
    } else if (brightness > 150 && saturation < 0.4) {
      categories.soft.push(color);
    }
  });

  return categories;
}

/**
 * Get appropriate color category for a mood
 * @param {string} mood - The mood name
 * @returns {Array} Array of appropriate category names
 */
function getColorCategoriesForMood(mood) {
  const moodLower = mood.toLowerCase();
  const moodCategories = {
    ecstatic: ['warm', 'intense'],
    happy: ['warm', 'intense', 'soft'],
    content: ['cool', 'soft', 'neutral'],
    neutral: ['neutral', 'cool', 'soft'],
    anxious: ['cool', 'intense'],
    sad: ['cool', 'neutral'],
    frustrated: ['warm', 'intense', 'cool']
  };

  return moodCategories[moodLower] || ['neutral', 'cool', 'warm'];
}

/**
 * Simple hash function to create deterministic index from string - AI help for the formula
 * @param {string} str - Input string
 * @returns {number} Hash value
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Select color from palette based on mood data
 * @param {Object} moodData - Mood data containing mood, stressLevel, socialInteractions
 * @param {Array} palette - Color palette array
 * @returns {Object} Selected color object
 */
function selectColorFromPalette(moodData, palette) {
  const baseMood = moodData.overallMood.toLowerCase();
  const stressLevel = Number(moodData.stressLevel) || 5;
  const socialInteractions = Array.isArray(moodData.socialInteractions) 
    ? moodData.socialInteractions.sort().join(',') 
    : 'none';

  //create deterministic key from mood + stress + social interactions
  const colorKey = `${baseMood}_${stressLevel}_${socialInteractions}`;
  const hashValue = simpleHash(colorKey);

  //get appropriate color categories for this mood
  const categories = categorizeColors(palette);
  const preferredCategories = getColorCategoriesForMood(baseMood);

  //collect candidate colors from preferred categories
  const candidateColors = [];
  preferredCategories.forEach(cat => {
    if (categories[cat] && categories[cat].length > 0) {
      candidateColors.push(...categories[cat]);
    }
  });

  //use all colors if no candidates found
  const colorsToChooseFrom = candidateColors.length > 0 ? candidateColors : palette;

  // Filter by stress level characteristics
  // Lower stress (1-3): prefer softer, lighter colors
  // Medium stress (4-7): balanced
  // High stress (8-10): prefer more intense, darker colors
  let filteredColors = colorsToChooseFrom;
  if (stressLevel <= 3) {
    //prefer soft colors for low stress
    filteredColors = colorsToChooseFrom.filter(color => {
      const rgb = hexToRgb(color.hex);
      if (!rgb) return false;
      const brightness = (rgb.r + rgb.g + rgb.b) / 3;
      return brightness > 150;
    });
    if (filteredColors.length === 0) filteredColors = colorsToChooseFrom;
  } else if (stressLevel >= 8) {
    //prefer more intense colors for high stress
    filteredColors = colorsToChooseFrom.filter(color => {
      const rgb = hexToRgb(color.hex);
      if (!rgb) return false;
      const max = Math.max(rgb.r, rgb.g, rgb.b);
      const min = Math.min(rgb.r, rgb.g, rgb.b);
      const saturation = max === 0 ? 0 : (max - min) / max;
      return saturation > 0.3;
    });
    if (filteredColors.length === 0) filteredColors = colorsToChooseFrom;
  }

  // Use hash from earlier to deterministically select a color
  const selectedIndex = hashValue % filteredColors.length;
  const selectedColor = filteredColors[selectedIndex];

  //build description with context - would enhance in the future but this is a start with the time constraint
  const socialContext = socialInteractions !== 'none' ? ` with ${socialInteractions}` : '';
  return {
    color: selectedColor.hex,
    name: selectedColor.name,
    description: `A color that represents your ${baseMood} mood with stress level ${stressLevel}${socialContext}.`
  };
}

/**
 * Decision Logic for Color Generation - longer explanantion
 * 
 * Takes comprehensive mood data (sentiment scores, keywords, mood attributes)
 * and returns a single color based on the decision-making logic.
 * Uses the color palette JSON file with deterministic selection based on
 * mood + stress level + social interactions.
 * 
 * @param {Object} moodData - The mood entry data containing:
 *   - overallMood: string (required) - Primary mood indicator
 *   - energyLevel: string (optional) - 'high', 'medium', 'low'
 *   - stressLevel: number (optional) - 1-10 scale
 *   - sentimentScores: Object (optional) - Sentiment analysis scores
 *   - keywords: Array (optional) - Keywords extracted from text
 *   - socialInteractions: Array (optional) - Social interaction types
 *   - primaryThoughts: string (optional) - Primary thought category
 *   - tags: Array (optional) - User-defined tags
 * 
 * @returns {Object} Color object with:
 *   - color: string - Hex color code (e.g., "#FFD700")
 *   - name: string - Color name
 *   - description: string - Color description
 */
export async function generateColorFromMoodData(moodData) {
  try {
    // Validate input
    if (!moodData || !moodData.overallMood) {
      throw new Error('Mood data must include overallMood');
    }

    //from json
    const colorPalette = await loadColorPalette();

    const selectedColor = selectColorFromPalette(moodData, colorPalette);

    return selectedColor;

  } catch (error) {
    console.error('Error in generateColorFromMoodData:', error);
    // Fallback to default color
    const defaultColors = MoodColors.getDefaultColors();
    const baseMood = moodData?.overallMood?.toLowerCase();
    return defaultColors[baseMood] || {
      color: "#808080",
      name: "Unknown",
      description: "A unique color that represents your current emotional state."
    };
  }
}

/**
 * Convert hex color to RGB - AI help for the formula
 * @param {string} hex - Hex color code (e.g., "#FFD700")
 * @returns {Object} RGB object with r, g, b values (0-255)
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert RGB to hex color - AI help for the formula
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} Hex color code
 */
export function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

