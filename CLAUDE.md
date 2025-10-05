# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native/Expo habit tracking application called "Aura Collector" (formerly named "personal-tracker"). The app helps users track their daily habits with a clean, intuitive interface built using Expo Router for file-based navigation.

## Development Commands

```bash
# Install dependencies
npm install

# Start the development server
npm start
npx expo start

# Start on specific platforms
npm run android  # expo start --android
npm run ios      # expo start --ios
npm run web      # expo start --web

# Lint the codebase
npm run lint
```

## Architecture Overview

### State Management
The app uses React Context for state management with providers for:
- **Habits**: Managing habit data, CRUD operations, and persistence
- **Stats**: Handling statistics, streaks, and completion data
- **Settings**: Managing app preferences and theme

### Data Persistence
- **AsyncStorage**: Used for storing habits, completions, and settings locally
- Data is structured to support daily tracking with date-based completion records

### Navigation
- **Expo Router**: File-based routing system with `(tabs)` layout
- Tab-based navigation with multiple screens (Dashboard, Habits, Stats, Settings)

### Component Structure
- **Screens**: Located in `app/` directory with `_layout.tsx` defining tab navigation
- **UI Components**: Reusable components in `components/ui/` (Button, Card, Modal, etc.)
- **Feature Components**: In `components/` directory (HabitCard, HabitList, StatsChart, etc.)
- **Custom Hooks**: In `hooks/` directory for logic reuse (useHabits, useStats, etc.)

### Key Features
1. **Habit Management**: Create, read, update, delete habits with categories and icons
2. **Daily Tracking**: Mark habits as complete for specific dates
3. **Statistics**: View completion rates, streaks, and progress trends
4. **Categories**: Organize habits by custom categories with color coding
5. **Reminders**: Set daily reminders for habits
6. **Themes**: Light/dark mode support

### Data Flow
1. **Habit Creation**: User creates habit → stored in AsyncStorage → reflected in UI
2. **Daily Tracking**: User marks habit complete → updates completion history → triggers animations
3. **Statistics**: Aggregated from completion data → calculated for various time periods
4. **Persistence**: All data saved locally with automatic sync on app start/close

### Type Definitions
- Located in `types/` directory
- Interfaces for Habit, Completion, Category, Statistics
- TypeScript for type safety throughout the app

### Utility Functions
- Located in `utils/` directory
- Date handling functions
- Storage utilities
- Color and theme helpers
- Validation functions

## Development Patterns

- **Custom Hooks**: Encapsulate business logic and state management
- **Component Composition**: Reusable UI components with flexible props
- **Animated Components**: Uses React Native Reanimated for smooth animations
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Async Operations**: Proper async/await patterns for storage operations

## Testing
Currently no test framework is configured. Consider adding:
- Jest for unit tests
- React Native Testing Library for component tests

## Build and Deployment
- Uses Expo build system
- EAS (Expo Application Services) ready for deployment
- Configuration in `app.json` for app metadata