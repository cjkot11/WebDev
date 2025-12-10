# Mood Color Journal - React Version

A modern React-based mood tracking application with Back4App integration, allowing users to track their daily emotions through colors and visualize their emotional journey over time.

**By:** Caz Kotsen and Sophia Noonan

## Features

- **Daily Mood Tracking**: Complete mood questionnaires with color generation
- **Mood History**: View and filter past mood entries with visual timeline
- **Color Palette**: Visual representation of emotional patterns
- **Statistics Dashboard**: Comprehensive mood analytics and trends
- **Word Cloud Visualization**: Visual representation of mood-related keywords
- **Suggested Activities**: Personalized activity recommendations based on mood
- **User Authentication**: Secure login/signup with Parse/Back4App
- **Settings Management**: User preferences and account settings
- **Responsive Design**: Mobile-first design that works on all devices
- **Cloud Storage**: Back4App integration for data persistence
- **LocalStorage Fallback**: Works offline when Back4App is not configured

## Technologies Used

- **React 18.2.0**: Modern React with hooks
- **React Router 6.8.0**: Client-side routing
- **Parse SDK 3.4.0**: Back4App integration for cloud storage
- **Webpack 5.75.0**: Modern build system with hot reloading
- **Recharts 3.5.1**: Data visualization for mood trends
- **WordCloud**: Word cloud visualization library
- **Axios 1.6.0**: HTTP client for data loading

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd "Final Mood Journal"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Back4App (Optional):**
   - The application works with localStorage fallback if Back4App is not configured
   - To enable cloud storage, update `src/services/parseConfig.js` with your Back4App credentials:
     ```javascript
     const PARSE_CONFIG = {
       APPLICATION_ID: 'your-application-id',
       JAVASCRIPT_KEY: 'your-javascript-key',
       SERVER_URL: 'https://parseapi.back4app.com/',
     };
     ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will open at `http://localhost:3000`

5. **Build for production:**
   ```bash
   npm run build
   ```
   The production build will be in the `dist/` folder.

## Usage

### Getting Started

1. **Create an Account:**
   - Navigate to the Login page
   - Click "Sign Up" to create a new account
   - Enter your username and password

2. **Track Your Mood:**
   - Click "Daily Entry" in the navigation
   - Fill out the mood questionnaire:
     - Overall mood selection
     - Energy level
     - Stress level (1-10)
     - Additional notes
   - Submit to save your entry

3. **View Your History:**
   - Navigate to "Mood History" to see all past entries
   - Filter entries by date range or mood type
   - View color palette visualization of your emotional patterns

4. **Explore Statistics:**
   - The Home page displays:
     - Total entries
     - Average mood
     - Mood trends over time
     - Most common moods

5. **Additional Features:**
   - **Word Cloud**: Visualize keywords from your mood entries
   - **Suggested Activities**: Get personalized activity recommendations
   - **Settings**: Manage your account preferences

## Project Structure

```
Final Mood Journal/
├── src/
│   ├── components/          # React components
│   │   ├── App.js          # Root component with routing
│   │   ├── Home.js         # Landing page with statistics
│   │   ├── Entry.js        # Mood entry form
│   │   ├── History.js      # Mood history viewer
│   │   ├── Auth.js         # Authentication component
│   │   ├── Settings.js     # Settings page
│   │   ├── WordCloud.js    # Word cloud visualization
│   │   ├── SuggestedActivities.js  # Activity suggestions
│   │   ├── TrendGraph.js   # Mood trend graphs
│   │   └── ProtectedRoute.js # Route protection wrapper
│   ├── models/             # Parse data models
│   │   ├── MoodEntry.js    # Mood entry data model
│   │   ├── MoodOptions.js  # Configuration options
│   │   ├── MoodColors.js   # Color mappings
│   │   └── User.js         # User model
│   ├── services/           # Service layer
│   │   ├── parseConfig.js  # Parse/Back4App configuration
│   │   ├── authService.js  # Authentication service
│   │   └── localStorageService.js  # LocalStorage fallback
│   ├── utils/              # Utility functions
│   │   ├── colorDecisionLogic.js  # Color generation logic
│   │   ├── activitySuggestions.js # Activity recommendation logic
│   │   └── initializeBack4App.js  # Back4App initialization
│   ├── App.css             # Main application styles
│   └── index.js            # Application entry point
├── public/                 # Static assets
│   ├── data/               # JSON data files
│   ├── images/             # Image assets
│   └── index.html          # HTML template
├── dist/                   # Production build output
├── webpack.config.js       # Webpack configuration
├── package.json            # Project dependencies
├── README.md               # This file
├── CHANGELOG.md            # Version history
└── DEPLOYMENT.md           # Deployment guide
```

## Architecture

### React Components
- **App**: Root component with routing and Parse initialization
- **Home**: Landing page with statistics and navigation
- **Entry**: Mood entry form with validation and color generation
- **History**: Mood history with filtering and color palette visualization
- **Auth**: User authentication (login/signup)
- **Settings**: User settings and preferences
- **WordCloud**: Word cloud visualization of mood keywords
- **SuggestedActivities**: Activity recommendations based on mood
- **TrendGraph**: Mood trend visualization
- **ProtectedRoute**: Route protection for authenticated pages

### Parse Models
- **MoodEntry**: Stores individual mood tracking data with user relationships
- **MoodOptions**: Configuration data for form options
- **MoodColors**: Color mappings for different moods
- **User**: User management extending Parse.User

### Key Design Patterns
- **Model-View-Controller**: Clear separation between data, presentation, and logic
- **Repository Pattern**: All Parse queries encapsulated in models
- **Component Composition**: Reusable and composable React components
- **Rule of 10**: Proper data relationships between models
- **Service Layer**: Authentication and data access abstracted into services

## Development

### Available Scripts

- `npm start`: Start development server
- `npm run dev`: Start development server with auto-open browser
- `npm run build`: Build production bundle
- `npm run serve`: Serve production build locally

### Testing

Run the test script to verify setup:
```bash
./test-app.sh
```

## Deployment

See `DEPLOYMENT.md` for detailed deployment instructions, including:
- Local testing
- GitHub Pages deployment
- Production build process

## Contributing

This is a course project. For questions or issues, please contact the project authors.

## License

MIT License

## Version

Current version: **0.3.0**

See `CHANGELOG.md` for version history and detailed changes.

