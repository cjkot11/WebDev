# Component Tree Diagram - Mood Color Journal

## React Component Hierarchy

```
App (Root Component)
├── Router (BrowserRouter from react-router-dom)
│   ├── Navigation Bar
│   │   ├── Link to Home (/)
│   │   ├── Link to Entry (/entry)
│   │   └── Link to History (/history)
│   │
│   └── Routes Container
│       ├── Route: "/" → Home Component
│       │   ├── Header Section
│       │   │   ├── Title (h1)
│       │   │   ├── Subtitle (h2)
│       │   │   ├── Hero Image
│       │   │   └── Tagline
│       │   │
│       │   ├── Content Section
│       │   │   ├── Welcome Message (h3)
│       │   │   └── How It Works (ol)
│       │   │       ├── Step 1: Complete questionnaire
│       │   │       ├── Step 2: Receive mood color
│       │   │       ├── Step 3: View journey
│       │   │       └── Step 4: Reflect on patterns
│       │   │
│       │   ├── CTA Section
│       │   │   ├── Call to Action (h3)
│       │   │   ├── Create Entry Button
│       │   │   └── View History Link
│       │   │
│       │   └── Statistics Section (conditional)
│       │       ├── Section Title (h3)
│       │       └── Stats Grid
│       │           ├── Total Entries Stat
│       │           ├── Average Stress Stat
│       │           └── Most Common Mood Stat
│       │
│       ├── Route: "/entry" → Entry Component
│       │   ├── Header Section
│       │   │   ├── Title (h1)
│       │   │   └── Description (p)
│       │   │
│       │   ├── Error Message (conditional)
│       │   │   ├── Error Title (h3)
│       │   │   ├── Error Text (p)
│       │   │   └── Close Button
│       │   │
│       │   ├── Success Message (conditional)
│       │   │   ├── Success Title (h3)
│       │   │   ├── Success Text (p)
│       │   │   └── Close Button
│       │   │
│       │   ├── Mood Form
│       │   │   ├── Overall Mood Group
│       │   │   │   ├── Label
│       │   │   │   └── Select Dropdown
│       │   │   │
│       │   │   ├── Energy Level Group
│       │   │   │   ├── Label
│       │   │   │   └── Select Dropdown
│       │   │   │
│       │   │   ├── Social Interactions Group
│       │   │   │   ├── Label
│       │   │   │   └── Checkbox Group
│       │   │   │       ├── Family Checkbox
│       │   │   │       ├── Friends Checkbox
│       │   │   │       ├── Colleagues Checkbox
│       │   │   │       ├── Strangers Checkbox
│       │   │   │       └── None Checkbox
│       │   │   │
│       │   │   ├── Stress Level Group
│       │   │   │   ├── Label with Value Display
│       │   │   │   └── Range Slider
│       │   │   │
│       │   │   ├── Primary Thoughts Group
│       │   │   │   ├── Label
│       │   │   │   └── Select Dropdown
│       │   │   │
│       │   │   ├── Gratitude Group
│       │   │   │   ├── Label
│       │   │   │   └── Textarea
│       │   │   │
│       │   │   ├── Highlight Group
│       │   │   │   ├── Label
│       │   │   │   └── Textarea
│       │   │   │
│       │   │   ├── Intention Group
│       │   │   │   ├── Label
│       │   │   │   └── Textarea
│       │   │   │
│       │   │   └── Form Actions
│       │   │       ├── Submit Button
│       │   │       └── Reset Button
│       │   │
│       │   └── Result Section (conditional)
│       │       ├── Section Title (h3)
│       │       ├── Color Display
│       │       │   ├── Color Circle
│       │       │   └── Color Info
│       │       │       ├── Color Name (h4)
│       │       │       └── Color Description (p)
│       │       └── Result Actions
│       │           ├── Save Button
│       │           └── View History Link
│       │
│       └── Route: "/history" → History Component
│           ├── Header Section
│           │   ├── Title (h1)
│           │   └── Description (p)
│           │
│           ├── Filters Section
│           │   ├── Section Title (h3)
│           │   └── Filters Container
│           │       ├── Mood Filter Group
│           │       │   ├── Label
│           │       │   └── Select Dropdown
│           │       ├── Date Range Filter Group
│           │       │   ├── Label
│           │       │   └── Select Dropdown
│           │       └── Clear Filters Button
│           │
│           ├── Entries Section
│           │   ├── Section Title (h3)
│           │   └── Entries Container
│           │       ├── No Entries Message (conditional)
│           │       │   ├── Title (h4)
│           │       │   └── Description (p)
│           │       └── Entry Cards (conditional)
│           │           └── Entry Card (for each entry)
│           │               ├── Entry Header
│           │               │   ├── Entry Date
│           │               │   └── Mood Color Circle
│           │               └── Entry Content
│           │                   ├── Mood Display
│           │                   ├── Entry Details Grid
│           │                   │   ├── Energy Detail
│           │                   │   ├── Stress Detail
│           │                   │   └── Focus Detail
│           │                   ├── Social Interactions (conditional)
│           │                   ├── Gratitude (conditional)
│           │                   └── Highlight (conditional)
│           │
│           └── Palette Section
│               ├── Section Title (h3)
│               ├── Color Swatches Container
│               │   ├── Empty State (conditional)
│               │   └── Color Swatches (conditional)
│               │       └── Color Swatch (for each unique color)
│               │           └── Swatch Info
│               │               ├── Color Name
│               │               └── Entry Count
│               └── Palette Statistics
│                   ├── Total Entries Stat
│                   ├── Unique Colors Stat
│                   └── Average Stress Stat
```

## Component Props and State

### App Component
- **State**: isInitialized, error
- **Props**: None (root component)

### Home Component
- **State**: stats, loading, error
- **Props**: None
- **Methods**: loadStatistics()

### Entry Component
- **State**: formData, moodOptions, currentMoodEntry, loading, error, success
- **Props**: None
- **Methods**: loadMoodOptions(), handleInputChange(), validateForm(), generateMoodEntry(), handleSubmit(), saveMoodEntry(), resetForm()

### History Component
- **State**: moodEntries, filteredEntries, moodOptions, filters, loading, error
- **Props**: None
- **Methods**: loadData(), applyFilters(), handleFilterChange(), clearFilters(), createEntryCard(), renderColorPalette(), renderPaletteStats()

## Data Flow

1. **App Initialization**
   - App component mounts
   - Parse is initialized
   - Router is set up
   - Navigation is rendered

2. **Home Component**
   - Component mounts
   - loadStatistics() is called
   - MoodEntry.getStatistics() queries Parse
   - Statistics are displayed

3. **Entry Component**
   - Component mounts
   - loadMoodOptions() is called
   - MoodOptions.getAllOptions() queries Parse
   - Form is rendered with options
   - User submits form
   - generateMoodEntry() creates mood data
   - saveMoodEntry() saves to Parse via MoodEntry.createEntry()

4. **History Component**
   - Component mounts
   - loadData() is called
   - MoodEntry.getAllEntries() and MoodOptions.getAllOptions() query Parse
   - Entries and filters are rendered
   - User applies filters
   - applyFilters() updates filteredEntries
   - UI updates with filtered results

## Key Features

1. **Conditional Rendering**: Components show different content based on state
2. **Form Handling**: Controlled components with validation
3. **Async Data Loading**: Components load data asynchronously from Parse
4. **Error Handling**: Error states are managed and displayed
5. **Loading States**: Loading indicators during async operations
6. **Responsive Design**: Components adapt to different screen sizes
7. **Navigation**: React Router handles client-side routing
8. **State Management**: Local state with React hooks
9. **Data Persistence**: Parse Models handle data storage
10. **Real-time Updates**: Components can refresh data when needed
