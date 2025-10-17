# UML Diagram - Mood Color Journal React Application

## Class Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        MoodJournalApp                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    React Components                      │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │   │
│  │  │    App      │  │    Home     │  │   Entry     │      │   │
│  │  │             │  │            │  │             │      │   │
│  │  │ + useState  │  │ + useState │  │ + useState  │      │   │
│  │  │ + useEffect │  │ + useEffect│  │ + useEffect│      │   │
│  │  │ + Router    │  │ + loadStats│  │ + loadOpts │      │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │   │
│  │                                                         │   │
│  │  ┌─────────────┐  ┌─────────────┐                       │   │
│  │  │   History   │  │ Navigation │                       │   │
│  │  │             │  │             │                       │   │
│  │  │ + useState  │  │ + Link      │                       │   │
│  │  │ + useEffect │  │ + Routes    │                       │   │
│  │  │ + filters   │  │             │                       │   │
│  │  └─────────────┘  └─────────────┘                       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ uses
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Parse Models                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ MoodEntry   │  │MoodOptions  │  │ MoodColors  │              │
│  │             │  │             │  │             │              │
│  │ + createEntry│  │ + getAllOpts│  │ + getAllColors│            │
│  │ + getAllEntries│ │ + getByCat │  │ + getByMood │              │
│  │ + getById   │  │ + addOption │  │ + addColor  │              │
│  │ + getStats  │  │ + updateOpt │  │ + updateColor│             │
│  │ + deleteEntry│  │ + deleteOpt│  │ + deleteColor│             │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                │                                │
│  ┌─────────────┐                │                                │
│  │    User     │                │                                │
│  │             │                │                                │
│  │ + signUp    │                │                                │
│  │ + logIn     │                │                                │
│  │ + logOut    │                │                                │
│  │ + getCurrent│                │                                │
│  │ + getStats  │                │                                │
│  └─────────────┘                │                                │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ extends
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Parse.Object                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Parse.User  │  │ Parse.Query │  │ Parse.Config│              │
│  │             │  │             │  │             │              │
│  │ + current() │  │ + find()    │  │ + initialize│              │
│  │ + logIn()   │  │ + get()     │  │ + serverURL │              │
│  │ + signUp()   │  │ + save()    │  │             │              │
│  │ + logOut()   │  │ + destroy() │  │             │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

## Component Tree Diagram

```
App
├── Router (BrowserRouter)
│   ├── Navigation
│   │   ├── Link (Home)
│   │   ├── Link (Entry)
│   │   └── Link (History)
│   └── Routes
│       ├── Route (/) → Home Component
│       │   ├── Header Section
│       │   ├── Content Section
│       │   ├── CTA Section
│       │   └── Statistics Section
│       │       └── Stats Grid
│       ├── Route (/entry) → Entry Component
│       │   ├── Header Section
│       │   ├── Mood Form
│       │   │   ├── Overall Mood Select
│       │   │   ├── Energy Level Select
│       │   │   ├── Social Interactions Checkboxes
│       │   │   ├── Stress Level Slider
│       │   │   ├── Primary Thoughts Select
│       │   │   ├── Gratitude Textarea
│       │   │   ├── Highlight Textarea
│       │   │   └── Intention Textarea
│       │   ├── Form Actions
│       │   └── Result Section
│       │       ├── Color Display
│       │       └── Result Actions
│       └── Route (/history) → History Component
│           ├── Header Section
│           ├── Filters Section
│           │   ├── Mood Filter
│           │   ├── Date Range Filter
│           │   └── Clear Filters Button
│           ├── Entries Section
│           │   └── Entries Container
│           │       └── Entry Cards
│           └── Palette Section
│               ├── Color Swatches
│               └── Palette Statistics
```

## Data Flow Diagram

```
User Interaction
       │
       ▼
React Component
       │
       ▼
Parse Model Methods
       │
       ▼
Parse.Query Operations
       │
       ▼
Back4App Parse Server
       │
       ▼
Database (MongoDB)
       │
       ▼
Response Data
       │
       ▼
Parse Model
       │
       ▼
React Component State
       │
       ▼
UI Update
```

## Relationships (Rule of 10)

1. **User → MoodEntry**: One-to-Many (1:∞)
   - One user can have many mood entries
   - Each mood entry belongs to one user

2. **MoodEntry → MoodOptions**: Many-to-One (∞:1)
   - Many mood entries can reference the same mood options
   - Mood options are shared across all entries

3. **MoodEntry → MoodColors**: Many-to-One (∞:1)
   - Many mood entries can have the same color
   - Colors are predefined and shared

4. **User → Parse.User**: One-to-One (1:1)
   - Each user extends Parse.User
   - Direct inheritance relationship

## Key Design Patterns

1. **Model-View-Controller (MVC)**
   - Models: Parse Models (MoodEntry, MoodOptions, MoodColors, User)
   - Views: React Components (App, Home, Entry, History)
   - Controllers: Parse Model methods (queries outside components)

2. **Repository Pattern**
   - All Parse queries are encapsulated in Parse Models
   - Components don't directly interact with Parse.Query
   - Centralized data access layer

3. **Component Composition**
   - App component composes all other components
   - Router manages component lifecycle
   - Reusable UI components

4. **State Management**
   - React hooks (useState, useEffect) for local state
   - Parse Models for persistent data
   - No external state management library needed

## Architecture Benefits

1. **Separation of Concerns**: Queries are isolated in Parse Models
2. **Reusability**: Components can be easily reused and tested
3. **Scalability**: Easy to add new features and components
4. **Maintainability**: Clear separation between data and presentation layers
5. **Type Safety**: Parse provides schema validation
6. **Real-time Updates**: Parse supports real-time data synchronization
