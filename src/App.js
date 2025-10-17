import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { initializeParse } from './services/parseConfig';
import Home from './components/Home';
import Entry from './components/Entry';
import History from './components/History';
import './App.css';

//overall app 
function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        console.log('Initializing Mood Journal App...');
        
        //initialize parse 
        const parseInitialized = initializeParse();
        
        if (parseInitialized) {
          console.log('Mood Journal App initialized with Parse/Back4App');
        } else {
          console.log('Mood Journal App initialized with localStorage fallback');
        }

        setIsInitialized(true);
        console.log('Mood Journal App initialized successfully');
      } catch (error) {
        console.error('Error initializing app:', error);
        setError(error.message);
      }
    };

    initApp();
  }, []);

  //error 
  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  //loader 
  if (!isInitialized) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  //html 
  return (
    <Router>
      <div className="app">
        {/* Navigation */}
        <nav className="nav-container">
          <div className="nav-content">
            <Link to="/" className="nav-link">
              <strong>Home</strong>
            </Link>
            <span className="nav-separator">|</span>
            <Link to="/entry" className="nav-link">
              Daily Entry
            </Link>
            <span className="nav-separator">|</span>
            <Link to="/history" className="nav-link">
              Mood History
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/entry" element={<Entry />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
