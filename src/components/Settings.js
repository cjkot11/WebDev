import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import './Settings.css';

/**
 * Story 5: Settings Component (Caz - Feature 6)
 * Allows users to enable/disable mood reminder notifications
 */
const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [settings, setSettings] = useState({
    remindersEnabled: false,
    reminderMethod: 'email', // 'email', 'push'
    email: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        setError('Please log in to access settings');
        return;
      }

      // Load user settings from Parse User object
      const remindersEnabled = currentUser.get('remindersEnabled') || false;
      const reminderMethod = currentUser.get('reminderMethod') || 'email';
      const email = currentUser.get('email') || currentUser.get('username') || '';

      setSettings({
        remindersEnabled,
        reminderMethod,
        email,
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        setError('Please log in to save settings');
        return;
      }

      // Save settings to Parse User object
      currentUser.set('remindersEnabled', settings.remindersEnabled);
      currentUser.set('reminderMethod', settings.reminderMethod);
      
      if (settings.email && settings.reminderMethod === 'email') {
        currentUser.set('email', settings.email);
      }

      await currentUser.save();

      setSuccess('Settings saved successfully!');
      
      // Note: Actual reminder scheduling would be handled by Back4App Cloud Functions
      // This UI just stores the user preferences!
      console.log('Reminder settings saved:', settings);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings: ' + (error.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="header-section">
        <h1>Settings</h1>
        <p>Manage your mood journal preferences</p>
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
            <h3>Success</h3>
            <p>{success}</p>
            <button onClick={() => setSuccess(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Story 5: Mood Reminder Settings */}
      <div className="settings-section">
        <h2>Mood Reminders</h2>
        <p className="section-description">
          Get daily reminders to record your mood and maintain consistent journaling habits. 
          Reminders are sent at 1:00 AM UTC every day.
        </p>

        <div className="setting-item">
          <label className="setting-label">
            <input
              type="checkbox"
              checked={settings.remindersEnabled}
              onChange={(e) => handleSettingChange('remindersEnabled', e.target.checked)}
              style={{ marginRight: '0.5rem', width: '18px', height: '18px' }}
            />
            <span>Enable mood reminders</span>
          </label>
        </div>

        {settings.remindersEnabled && (
          <>
            <div className="setting-item">
              <label htmlFor="reminder-method" className="setting-label-text">
                Reminder Method:
              </label>
              <select
                id="reminder-method"
                value={settings.reminderMethod}
                onChange={(e) => handleSettingChange('reminderMethod', e.target.value)}
                className="setting-select"
              >
                <option value="email">Email</option>
                <option value="push">Push Notification</option>
              </select>
            </div>

            {settings.reminderMethod === 'email' && (
              <div className="setting-item">
                <label htmlFor="email" className="setting-label-text">
                  Email Address:
                </label>
                <input
                  type="email"
                  id="email"
                  value={settings.email}
                  onChange={(e) => handleSettingChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="setting-input"
                />
                <p className="setting-hint">
                  Reminders will include a link to your journaling page
                </p>
              </div>
            )}

            {settings.reminderMethod === 'push' && (
              <div className="setting-item">
                <p className="setting-hint">
                  Push notifications will be sent to your browser. Make sure notifications are enabled in your browser settings.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="settings-actions">
        <button
          onClick={handleSave}
          disabled={saving}
          className="save-settings-button"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default Settings;

