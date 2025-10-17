# Mood Color Journal - React Version

A modern React-based mood tracking application with Back4App integration, allowing users to track their daily emotions through colors and visualize their emotional journey over time.

## 🚀 Features

- **Daily Mood Tracking**: Complete mood questionnaires with color generation
- **Mood History**: View and filter past mood entries with visual timeline
- **Color Palette**: Visual representation of emotional patterns
- **Statistics Dashboard**: Comprehensive mood analytics and trends
- **Responsive Design**: Mobile-first design that works on all devices
- **Cloud Storage**: Back4App integration for data persistence
- **Real-time Updates**: Live data synchronization across devices

## 🏗️ Architecture

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

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Back4App account (for cloud storage)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-webpack8
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Back4App**
   - Create a Back4App account at [back4app.com](https://back4app.com)
   - Create a new Parse app
   - Get your Application ID and JavaScript Key
   - Update `src/services/parseConfig.js` with your credentials:
   ```javascript
   const PARSE_CONFIG = {
     APPLICATION_ID: 'YOUR_APPLICATION_ID',
     JAVASCRIPT_KEY: 'YOUR_JAVASCRIPT_KEY',
     SERVER_URL: 'https://parseapi.back4app.com/',
   };
   ```

4. **Initialize Parse Models**
   - The app will automatically initialize default mood options and colors
   - You can also manually initialize them by calling:
   ```javascript
   await MoodOptions.initializeDefaultOptions();
   await MoodColors.initializeDefaultColors();
   ```

## 🚀 Development

### Start Development Server
```bash
npm run dev
```
This will start the webpack dev server with hot reloading at `http://localhost:3000`

### Build for Production
```bash
npm run build
```
This creates an optimized production build in the `dist` folder.

### Serve Production Build
```bash
npm run serve
```
This serves the production build locally for testing.

## 📁 Project Structure

```
react-webpack8/
├── public/
│   ├── index.html          # HTML template
│   └── images/            # Static images
├── src/
│   ├── components/        # React components
│   │   ├── App.js         # Root component
│   │   ├── Home.js        # Home page component
│   │   ├── Entry.js       # Entry form component
│   │   ├── History.js     # History component
│   │   └── *.css          # Component styles
│   ├── models/            # Parse models
│   │   ├── MoodEntry.js   # Mood entry model
│   │   ├── MoodOptions.js # Options model
│   │   ├── MoodColors.js  # Colors model
│   │   └── User.js        # User model
│   ├── services/          # Services
│   │   └── parseConfig.js # Parse configuration
│   ├── App.css           # Main app styles
│   ├── App.js            # App component
│   └── index.js          # Entry point
├── webpack.config.js      # Webpack configuration
├── .babelrc              # Babel configuration
├── package.json          # Dependencies and scripts
├── CHANGELOG.md          # Version history
├── UML_DIAGRAM.md        # Architecture documentation
└── COMPONENT_TREE.md     # Component hierarchy
```

## 🔧 Configuration

### Back4App Setup
1. Create a new Parse app in your Back4App dashboard
2. Go to App Settings > Security & Keys
3. Copy your Application ID and JavaScript Key
4. Update the configuration in `src/services/parseConfig.js`

### Environment Variables
For production deployment, consider using environment variables:
```javascript
const PARSE_CONFIG = {
  APPLICATION_ID: process.env.REACT_APP_PARSE_APP_ID,
  JAVASCRIPT_KEY: process.env.REACT_APP_PARSE_JS_KEY,
  SERVER_URL: 'https://parseapi.back4app.com/',
};
```

## 📊 Data Models

### MoodEntry
- `overallMood`: String - Primary mood state
- `energyLevel`: String - Energy level (high/medium/low)
- `socialInteractions`: Array - Social interaction types
- `stressLevel`: Number - Stress level (1-10)
- `primaryThoughts`: String - Dominant thought category
- `gratitude`: String - Gratitude note
- `highlight`: String - Day highlight
- `intention`: String - Tomorrow's intention
- `moodColor`: String - Generated hex color
- `colorName`: String - Color name
- `colorDescription`: String - Color description
- `date`: Date - Entry date
- `user`: Pointer to User - User relationship

### MoodOptions
- `category`: String - Option category
- `value`: String - Option value
- `label`: String - Display label
- `order`: Number - Display order

### MoodColors
- `mood`: String - Mood type
- `color`: String - Hex color code
- `name`: String - Color name
- `description`: String - Color description

## 🎨 Styling

The application uses modern CSS with:
- CSS Grid and Flexbox for layouts
- CSS Custom Properties for theming
- Responsive design patterns
- Smooth animations and transitions
- Mobile-first approach

## 🧪 Testing

### Manual Testing Checklist
- [ ] Parse initialization works without errors
- [ ] All components render correctly
- [ ] Form validation works properly
- [ ] Data saves to Back4App successfully
- [ ] Navigation between pages works
- [ ] Filters in history page work
- [ ] Responsive design works on mobile
- [ ] No console errors

### Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Deployment

### Back4App Hosting
1. Build the production version:
   ```bash
   npm run build
   ```

2. Upload the `dist` folder contents to Back4App's hosting service

3. Configure your Parse app settings for production

### Other Hosting Options
- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repository
- **AWS S3**: Upload the `dist` folder to an S3 bucket
- **GitHub Pages**: Use GitHub Actions to deploy

## 📚 Documentation

- [UML Diagram](UML_DIAGRAM.md) - Complete architecture overview
- [Component Tree](COMPONENT_TREE.md) - Component hierarchy and data flow
- [Changelog](CHANGELOG.md) - Version history and changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:
1. Check the [troubleshooting section](#troubleshooting)
2. Review the [documentation](#documentation)
3. Open an issue on GitHub

## 🔧 Troubleshooting

### Common Issues

**Parse initialization fails**
- Verify your Back4App credentials are correct
- Check that your Parse app is active
- Ensure the server URL is correct

**Build errors**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Verify all dependencies are installed

**Runtime errors**
- Check browser console for error messages
- Verify Parse models are properly registered
- Ensure all imports are correct

### Debug Mode
Enable debug logging by adding to your browser console:
```javascript
localStorage.setItem('debug', 'parse:*');
```

## 🎯 Roadmap

- [ ] User authentication and profiles
- [ ] Real-time data synchronization
- [ ] Advanced analytics and insights
- [ ] Export functionality
- [ ] Mobile app (React Native)
- [ ] Social features and sharing
- [ ] Offline support (PWA)

---

**Version**: 0.2.0  
**Last Updated**: January 20, 2024  
**React Version**: 18.2.0  
**Parse Version**: 3.4.0