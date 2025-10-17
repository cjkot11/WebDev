# Mood Color Journal - React Version

A modern React-based mood tracking application with Back4App integration, allowing users to track their daily emotions through colors and visualize their emotional journey over time.

By: Caz Kotsen and Sophia Noonan

##  Features

- **Daily Mood Tracking**: Complete mood questionnaires with color generation
- **Mood History**: View and filter past mood entries with visual timeline
- **Color Palette**: Visual representation of emotional patterns
- **Statistics Dashboard**: Comprehensive mood analytics and trends
- **Responsive Design**: Mobile-first design that works on all devices
- **Cloud Storage**: Back4App integration for data persistence
- **Real-time Updates**: Live data synchronization across devices

##  Architecture

### React Components
- **App**: Root component with routing and Parse initialization
- **Home**: Landing page with statistics and navigation
- **Entry**: Mood entry form with validation and color generation
- **History**: Mood history with filtering and color palette visualization

### Parse Models
- **MoodEntry**: Stores individual mood tracking data
- **MoodOptions**: Configuration data for form options
- **MoodColors**: Color mappings for different moods
- **User**: User management extending Parse.User

### Key Design Patterns
- **Model-View-Controller**: Clear separation between data, presentation, and logic
- **Repository Pattern**: All Parse queries encapsulated in models
- **Component Composition**: Reusable and composable React components
- **Rule of 10**: Proper data relationships between models

