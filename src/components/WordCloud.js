import React, { useState, useEffect, useRef } from 'react';
import MoodEntry from '../models/MoodEntry';
import './WordCloud.css';

// Import wordcloud library that I found online 
// The wordcloud library exports a function directly
let wordcloud;
if (typeof window !== 'undefined') {
  try {
    wordcloud = require('wordcloud');
    //handle both default export and direct export
    if (wordcloud && wordcloud.default) {
      wordcloud = wordcloud.default;
    }
  } catch (e) {
    console.error('Could not load wordcloud library:', e);
  }
}

/**
 * Word Cloud Visualization Component (Sophia - Feature 6)
 * Displays a word cloud generated from journal entries
 */
const WordCloud = () => {
  const [entries, setEntries] = useState([]);
  const [wordData, setWordData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const wordcloudInstanceRef = useRef(null);

  //helper function to get value from entry 
  const getEntryValue = (entry, key) => {
    return entry.get ? entry.get(key) : entry[key];
  };

  useEffect(() => {
    loadEntries();
  }, []);

  //process words and generate word cloud when entries or wordData changes
  useEffect(() => {
    if (entries.length > 0) {
      const processedWords = processEntriesToWords(entries);
      setWordData(processedWords);
    } else {
      setWordData([]);
    }
  }, [entries]);

  //render word cloud when wordData changes
  useEffect(() => {
    if (wordData.length > 0 && canvasRef.current) {
      //adds a small delay so canvas is fully rendered
      const timer = setTimeout(() => {
        renderWordCloud();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [wordData, canvasRef.current]);

  //load all mood entries
  const loadEntries = async () => {
    try {
      setLoading(true);
      setError(null);

      const allEntries = await MoodEntry.getAllEntries();
      setEntries(allEntries || []);
      
      console.log('WordCloud: Loaded', allEntries?.length || 0, 'entries');
    } catch (error) {
      console.error('Error loading entries for word cloud:', error);
      setError('Failed to load journal entries');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  //extract and process text from entries
  const processEntriesToWords = (entries) => {
    // Extended stop words to exclude common verbs, gerunds, and generic words
    // This keeps meaningful nouns and descriptive words like "sleep", "good", "family", "grateful", "health"
    //this was listed by AI!
    const stopWords = new Set([
      // Articles and prepositions
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
      'by', 'from', 'as', 'into', 'onto', 'upon', 'over', 'under', 'through', 'during',
      // Common verbs (present, past, gerunds) - these are too generic
      'is', 'was', 'are', 'were', 'been', 'be', 'being', 'am',
      'have', 'has', 'had', 'having',
      'do', 'does', 'did', 'doing', 'done',
      'get', 'gets', 'got', 'getting', 'gotten',
      'go', 'goes', 'went', 'going', 'gone',
      'make', 'makes', 'made', 'making',
      'take', 'takes', 'took', 'taking', 'taken',
      'see', 'sees', 'saw', 'seeing', 'seen',
      'know', 'knows', 'knew', 'knowing', 'known',
      'think', 'thinks', 'thought', 'thinking',
      'come', 'comes', 'came', 'coming',
      'want', 'wants', 'wanted', 'wanting',
      'use', 'uses', 'used', 'using',
      'find', 'finds', 'found', 'finding',
      'give', 'gives', 'gave', 'giving', 'given',
      'tell', 'tells', 'told', 'telling',
      'work', 'works', 'worked', 'working',
      'call', 'calls', 'called', 'calling',
      'try', 'tries', 'tried', 'trying',
      'ask', 'asks', 'asked', 'asking',
      'need', 'needs', 'needed', 'needing',
      'feel', 'feels', 'felt', 'feeling',
      'become', 'becomes', 'became', 'becoming',
      'leave', 'leaves', 'left', 'leaving',
      'put', 'puts', 'putting',
      'mean', 'means', 'meant', 'meaning',
      'keep', 'keeps', 'kept', 'keeping',
      'let', 'lets', 'letting',
      'begin', 'begins', 'began', 'beginning', 'begun',
      'seem', 'seems', 'seemed', 'seeming',
      'help', 'helps', 'helped', 'helping',
      'show', 'shows', 'showed', 'showing', 'shown',
      'hear', 'hears', 'heard', 'hearing',
      'play', 'plays', 'played', 'playing',
      'run', 'runs', 'ran', 'running',
      'move', 'moves', 'moved', 'moving',
      'like', 'likes', 'liked', 'liking',
      'live', 'lives', 'lived', 'living',
      'believe', 'believes', 'believed', 'believing',
      'bring', 'brings', 'brought', 'bringing',
      'happen', 'happens', 'happened', 'happening',
      'write', 'writes', 'wrote', 'writing', 'written',
      'sit', 'sits', 'sat', 'sitting',
      'stand', 'stands', 'stood', 'standing',
      'lose', 'loses', 'lost', 'losing',
      'pay', 'pays', 'paid', 'paying',
      'meet', 'meets', 'met', 'meeting',
      'include', 'includes', 'included', 'including',
      'continue', 'continues', 'continued', 'continuing',
      'set', 'sets', 'setting',
      'learn', 'learns', 'learned', 'learning',
      'change', 'changes', 'changed', 'changing',
      'lead', 'leads', 'led', 'leading',
      'understand', 'understands', 'understood', 'understanding',
      'watch', 'watches', 'watched', 'watching',
      'follow', 'follows', 'followed', 'following',
      'stop', 'stops', 'stopped', 'stopping',
      'create', 'creates', 'created', 'creating',
      'speak', 'speaks', 'spoke', 'speaking', 'spoken',
      'read', 'reads', 'reading',
      'allow', 'allows', 'allowed', 'allowing',
      'add', 'adds', 'added', 'adding',
      'spend', 'spends', 'spent', 'spending',
      'grow', 'grows', 'grew', 'growing', 'grown',
      'open', 'opens', 'opened', 'opening',
      'walk', 'walks', 'walked', 'walking',
      'win', 'wins', 'won', 'winning',
      'offer', 'offers', 'offered', 'offering',
      'remember', 'remembers', 'remembered', 'remembering',
      'love', 'loves', 'loved', 'loving',
      'consider', 'considers', 'considered', 'considering',
      'appear', 'appears', 'appeared', 'appearing',
      'buy', 'buys', 'bought', 'buying',
      'wait', 'waits', 'waited', 'waiting',
      'serve', 'serves', 'served', 'serving',
      'die', 'dies', 'died', 'dying',
      'send', 'sends', 'sent', 'sending',
      'build', 'builds', 'built', 'building',
      'stay', 'stays', 'stayed', 'staying',
      'fall', 'falls', 'fell', 'falling', 'fallen',
      'cut', 'cuts', 'cutting',
      'reach', 'reaches', 'reached', 'reaching',
      'kill', 'kills', 'killed', 'killing',
      'raise', 'raises', 'raised', 'raising',
      'pass', 'passes', 'passed', 'passing',
      'sell', 'sells', 'sold', 'selling',
      'decide', 'decides', 'decided', 'deciding',
      'return', 'returns', 'returned', 'returning',
      'explain', 'explains', 'explained', 'explaining',
      'develop', 'develops', 'developed', 'developing',
      'carry', 'carries', 'carried', 'carrying',
      'break', 'breaks', 'broke', 'breaking', 'broken',
      'receive', 'receives', 'received', 'receiving',
      'agree', 'agrees', 'agreed', 'agreeing',
      'support', 'supports', 'supported', 'supporting',
      'hit', 'hits', 'hitting',
      'produce', 'produces', 'produced', 'producing',
      'eat', 'eats', 'ate', 'eating', 'eaten',
      'cover', 'covers', 'covered', 'covering',
      'catch', 'catches', 'caught', 'catching',
      'draw', 'draws', 'drew', 'drawing', 'drawn',
      'choose', 'chooses', 'chose', 'choosing', 'chosen',
      // Modal verbs
      'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can',
      // Pronouns
      'i', 'you', 'he', 'she', 'it', 'we', 'they',
      'my', 'your', 'his', 'her', 'its', 'our', 'their',
      'me', 'him', 'us', 'them',
      'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'themselves',
      // Question words
      'what', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why', 'how',
      // Common adjectives/adverbs (too generic) - but keep meaningful ones like "good"
      'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such',
      'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just',
      'also', 'even', 'much', 'many', 'well', 'still', 'back', 'here', 'there',
      'now', 'then', 'again', 'once', 'always', 'never', 'often', 'sometimes',
      'already', 'yet', 'again', 'once', 'twice',
      // Generic words
      'thing', 'things', 'way', 'ways', 'time', 'times', 'day', 'days',
      'year', 'years', 'man', 'men', 'woman', 'women', 'people', 'person', 'persons',
      'life', 'lives', 'world', 'worlds', 'place', 'places', 'part', 'parts',
      'case', 'cases', 'point', 'points', 'group', 'groups', 'number', 'numbers',
      'fact', 'facts', 'lot', 'lots', 'kind', 'kinds', 'sort', 'sorts',
      'bit', 'bits', 'piece', 'pieces', 'end', 'ends', 'start', 'starts',
      'beginning', 'beginnings', 'middle', 'middles', 'side', 'sides',
      'top', 'tops', 'bottom', 'bottoms', 'front', 'fronts', 'back', 'backs',
      // Common connecting words
      'that', 'this', 'these', 'those', 'than', 'then',
      // Generic descriptors (but keep meaningful ones like "good", "grateful", "health")
      'bad', 'big', 'small', 'large', 'little', 'long', 'short',
      'new', 'old', 'young', 'high', 'low', 'right', 'wrong', 'true', 'false',
      'sure', 'certain', 'different', 'same', 'similar', 'important', 'possible',
      'real', 'really', 'actually', 'probably', 'maybe', 'perhaps',
      // Time words (too generic)
      'today', 'tomorrow', 'yesterday', 'morning', 'afternoon', 'evening', 'night',
      'week', 'weeks', 'month', 'months', 'hour', 'hours', 'minute', 'minutes',
      // Common filler words
      'um', 'uh', 'er', 'ah', 'oh', 'hmm', 'yeah', 'yes', 'no', 'ok', 'okay',
      'please', 'thanks', 'thank', 'sorry', 'welcome'
    ]);

  
    let allText = '';
    
    entries.forEach(entry => {
      //extracting text 
      const gratitude = getEntryValue(entry, 'gratitude') || '';
      const highlight = getEntryValue(entry, 'highlight') || '';
      const intention = getEntryValue(entry, 'intention') || '';
      const primaryThoughts = getEntryValue(entry, 'primaryThoughts') || '';
      const tags = getEntryValue(entry, 'tags') || [];
      
      //combine all the text from the different fields
      allText += ` ${gratitude} ${highlight} ${intention} ${primaryThoughts}`;
      
      //add tags as words too
      if (Array.isArray(tags)) {
        tags.forEach(tag => {
          if (tag && typeof tag === 'string') {
            allText += ` ${tag}`;
          }
        });
      }
    });

    //count words
    const words = allText
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .split(/\s+/) // Split by whitespace
      .filter(word => word.length > 3) // Filter out words shorter than 4 characters (more meaningful)
      .filter(word => !stopWords.has(word)) // Remove stop words
      .filter(word => !/^\d+$/.test(word)); // Remove pure numbers

    //count word frequencies
    const wordCounts = {};
    words.forEach(word => {
      if (word && word.trim()) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });

    // Convert to array format for wordcloud library -> found online, not my library
    // Format: [['word', frequency], ...]
    const wordArray = Object.entries(wordCounts)
      .map(([word, count]) => [word, count])
      .sort((a, b) => b[1] - a[1]) // Sort by frequency descending
      .slice(0, 50); // Limit to top 50 words for better visibility

    console.log('WordCloud: Processed', wordArray.length, 'unique words');
    console.log('Top 10 words:', wordArray.slice(0, 10));
    return wordArray;
  };

  //rendering
  const renderWordCloud = () => {
    if (!canvasRef.current || wordData.length === 0) {
      console.log('WordCloud render skipped:', {
        hasCanvas: !!canvasRef.current,
        wordDataLength: wordData.length,
        hasWordcloud: !!wordcloud
      });
      return;
    }

    //check for availability errors 
    if (!wordcloud) {
      console.error('Wordcloud library not loaded');
      setError('Word cloud library failed to load. Please refresh the page.');
      return;
    }

    const canvas = canvasRef.current;
    
    const container = canvas.parentElement;
    const width = container ? Math.max(container.offsetWidth - 40, 800) : 800; // Account for padding
    const height = 600;

    canvas.width = width;
    canvas.height = height;
    
    //clear previous 
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    if (wordcloudInstanceRef.current) {
      try {
        if (wordcloud.stop) {
          wordcloud.stop();
        }
      } catch (e) {
        console.warn('Error stopping wordcloud:', e);
      }
    }

    console.log('Rendering word cloud with', wordData.length, 'words on canvas', width, 'x', height);
    console.log('Sample word data:', wordData.slice(0, 10));

    //Integration done with the help of AI and online library 
    // Calculate normalized weight factor
    // Find max frequency to normalize sizes
    const maxFreq = wordData.length > 0 ? wordData[0][1] : 1;
    const minFreq = wordData.length > 0 ? wordData[wordData.length - 1][1] : 1;
    
    // Create wordcloud configuration
    const wordcloudConfig = {
      list: wordData,
      gridSize: 8, // Smaller grid allows more words to fit
      weightFactor: function (size) {
        // Normalize the size: scale from min to max frequency
        // This ensures all words are visible, not just the largest
        const normalizedSize = (size - minFreq) / (maxFreq - minFreq + 1);
        // Scale between 12px (min) and 60px (max) for better visibility
        return 12 + (normalizedSize * 48);
      },
      fontFamily: 'Arial, sans-serif',
      color: function (word, weight, fontSize, distance, theta) {
        // Generate colors based on word frequency
        const hue = (word.charCodeAt(0) * 137.508) % 360;
        const saturation = 50 + Math.min(weight * 3, 30);
        const lightness = 40 + Math.min(weight * 2, 30);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      },
      rotateRatio: 0.5,
      rotationSteps: 2,
      minSize: 12, // Minimum font size
      drawOutOfBound: false,
      shrinkToFit: true
    };

    // Generate word cloud
    try {
      // Ensure wordcloud is a function
      if (typeof wordcloud === 'function') {
        wordcloud(canvas, wordcloudConfig);
      } else if (wordcloud.default && typeof wordcloud.default === 'function') {
        // Handle default export
        wordcloud.default(canvas, wordcloudConfig);
      } else {
        throw new Error('Wordcloud is not a function');
      }

      wordcloudInstanceRef.current = true;
      console.log('Word cloud rendered successfully');
    } catch (error) {
      console.error('Error rendering word cloud:', error);
      setError(`Failed to render word cloud: ${error.message}`);
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (wordData.length > 0) {
        renderWordCloud();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [wordData]);

  if (loading) {
    return (
      <div className="wordcloud-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading word cloud...</p>
        </div>
      </div>
    );
  }

  if (error && entries.length === 0) {
    return (
      <div className="wordcloud-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={loadEntries}>Retry</button>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="wordcloud-container">
        <div className="wordcloud-header">
          <h1>Word Cloud</h1>
          <p>Visualize the most common themes and words from your journal entries</p>
        </div>
        <div className="wordcloud-empty">
          <p>No journal entries found</p>
          <p>Start creating entries to see your word cloud!</p>
        </div>
      </div>
    );
  }

  if (wordData.length === 0) {
    return (
      <div className="wordcloud-container">
        <div className="wordcloud-header">
          <h1>Word Cloud</h1>
          <p>Visualize the most common themes and words from your journal entries</p>
        </div>
        <div className="wordcloud-empty">
          <p>Not enough text to generate word cloud</p>
          <p>Add more detailed entries to see your word cloud!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wordcloud-container">
      <div className="wordcloud-header">
        <h1>Word Cloud</h1>
        <p>Visualize the most common themes and words from your journal entries</p>
        <p className="wordcloud-stats">
          Based on {entries.length} {entries.length === 1 ? 'entry' : 'entries'} • {wordData.length} unique words
        </p>
      </div>

      {error && (
        <div className="wordcloud-error">
          <p>{error}</p>
        </div>
      )}

      <div className="wordcloud-wrapper">
        <canvas
          ref={canvasRef}
          className="wordcloud-canvas"
          width={800}
          height={600}
          style={{ width: '100%', height: '600px', display: 'block' }}
        />
      </div>

      <div className="wordcloud-info">
        <p>
          <strong>How it works:</strong> This word cloud is generated from text in your journal entries
          (gratitude, highlights, intentions, tags, and thoughts). More frequent words appear larger.
        </p>
      </div>
    </div>
  );
};

export default WordCloud;

