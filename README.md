# Aura Collector ✨

A gamified self-improvement and discipline-building app built with [Expo](https://expo.dev) and React Native. Complete daily tasks to collect aura points, level up your discipline, and transform yourself through consistent action.

> **🚧 Currently in Transition**: This app is evolving from a simple habit tracker into a full-featured aura collection and self-improvement platform.

## Current Features ✨

### Habit Tracking System (v1.0 - Current)

- **Daily Habit Tracking**: Mark each day as successful or unsuccessful
- **Streak Management**: Track current streak and personal best streak
- **Visual Calendar**: Monthly calendar view showing your progress with color-coded days
- **Streak History**: View past streaks and their end reasons
- **Persistent Storage**: All data is stored locally using AsyncStorage
- **Grace Period**: 24-hour grace period for marking days (configurable)
- **Manual Streak Reset**: Option to manually reset your current streak
- **Cross-Platform**: Works on iOS, Android, and Web

## Planned Features 🚀 (Aura Collector v2.0)

### Core Aura System

- **Aura Points**: Earn points by completing self-improvement tasks
- **Aura Levels**: Progress through ranks (Novice → Apprentice → Adept → Master → Legend)
- **Visual Aura Display**: Animated aura visualization showing your current level and progress
- **Aura Leaderboard**: Optional: Compete with friends (if multiplayer is added)

### Task System

- **Task Categories**:
  - 💪 **Physical**: Exercise, cold showers, morning routines
  - 🧠 **Mental**: Meditation, reading, learning
  - 🤝 **Social**: Helping others, networking, communication
  - 📊 **Productivity**: Deep work sessions, goal completion
  - 🌱 **Habits**: Daily disciplines and routines
- **Task Library**: Pre-built tasks with point values
- **Custom Tasks**: Create your own challenges
- **Daily Challenges**: Rotating daily quests for bonus aura
- **Difficulty Levels**: Tasks worth different aura points based on difficulty
- **Task Streaks**: Consecutive completion bonuses

### Gamification

- **Achievement System**: Unlock badges and milestones
- **Power-ups**: Temporary boosts for maintaining streaks
- **Combo System**: Complete multiple tasks in a day for multipliers
- **Daily/Weekly/Monthly Goals**: Set and track targets
- **Progress Insights**: Stats and analytics on your improvement journey

### Enhanced UI/UX

- **Dark Mode Optimization**: Full dark mode support
- **Animations**: Smooth transitions and celebratory effects
- **Notifications**: Smart reminders for tasks and challenges
- **Widgets**: Home screen widgets showing aura and streak
- **Sound Effects**: Optional audio feedback (toggle-able)

## App Structure

### Current Tabs (v1.0)

- **Home**: View current streak, mark today as successful/unsuccessful, and see key statistics
- **History**: Interactive calendar showing your daily progress with success/failure indicators
- **Explore**: Information about the app and its features

### Planned Tabs (v2.0)

- **Dashboard**: Aura level, daily challenges, and quick stats
- **Tasks**: Browse and complete available tasks from different categories
- **Progress**: Calendar view + detailed analytics and insights
- **Achievements**: Badges, milestones, and accomplishments
- **Profile**: Settings, customization, and account management

## Getting Started 🚀

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)

### Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npx expo start
   ```

4. Open the app on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan the QR code with the [Expo Go](https://expo.dev/go) app on your phone

## Project Structure 📁

```
personal-tracker/
├── app/                    # Main application screens (Expo Router)
│   ├── (tabs)/            # Tab-based navigation screens
│   │   ├── index.tsx      # Home screen - main habit tracker
│   │   ├── history.tsx    # Calendar view with daily records
│   │   └── explore.tsx    # Information and settings
│   ├── _layout.tsx        # Root layout
│   └── modal.tsx          # Modal screen
├── components/            # Reusable UI components
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   └── ui/               # UI components
├── contexts/             # React Context providers
│   └── HabitContext.tsx  # Global habit state management
├── types/                # TypeScript type definitions
│   └── habit.ts          # Habit data interfaces
├── utils/                # Utility functions
│   ├── dateHelpers.ts    # Date formatting and validation
│   └── storage.ts        # AsyncStorage wrapper
├── constants/            # App constants
│   └── theme.ts          # Theme configuration
└── assets/              # Images and static assets
```

## Key Technologies 🛠️

- **Expo SDK 54**: Cross-platform development framework
- **React Native**: Mobile app framework
- **TypeScript**: Type-safe JavaScript
- **Expo Router**: File-based routing system
- **AsyncStorage**: Local data persistence
- **date-fns**: Date manipulation and formatting
- **React Context**: Global state management

## How It Works 💡

### Habit Tracking

The app uses a `HabitContext` provider to manage global state. Each day can be marked as:

- ✅ **Successful**: Contributes to your streak
- ❌ **Unsuccessful**: Breaks your current streak
- ⚪ **Unmarked**: Not yet tracked

### Streak Calculation

- **Current Streak**: Consecutive successful days from today backward
- **Best Streak**: The longest streak you've ever achieved
- **Streak History**: Records of past streaks with start/end dates and reasons

### Data Storage

All habit data is stored locally on your device using AsyncStorage, including:

- Daily records (date, success status, timestamp)
- Current streak information
- Best streak
- Streak history
- User settings (grace period, retroactive marking)

## Configuration ⚙️

You can configure habit settings in the `HabitData` interface:

```typescript
settings: {
  allowRetroactive: true,    // Allow marking past dates
  gracePeriodHours: 24,      // Hours after midnight to mark previous day
}
```

## Scripts 📜

```bash
# Start development server
npm start

# Start for specific platforms
npm run android    # Android emulator
npm run ios        # iOS simulator
npm run web        # Web browser

# Code quality
npm run lint       # Run ESLint

# Reset project to blank template
npm run reset-project
```

## Development Roadmap 🗺️

### Phase 1: Foundation (v1.0) ✅ CURRENT

- [x] Basic habit tracking
- [x] Streak management
- [x] Calendar visualization
- [x] Local data persistence
- [x] TypeScript architecture

### Phase 2: Aura System Core (v2.0) 🔨 NEXT

- [ ] Create Task type definitions and data models
- [ ] Implement Aura Points system
- [ ] Build Task Library component
- [ ] Add task completion tracking
- [ ] Design and implement Aura Level system
- [ ] Create task categories (Physical, Mental, Social, Productivity)
- [ ] Migrate from single habit to multi-task tracking
- [ ] Update UI to reflect aura theme

### Phase 3: Gamification (v2.1)

- [ ] Achievement system
- [ ] Daily challenges with rotation
- [ ] Combo multipliers
- [ ] Progress analytics
- [ ] Custom task creation
- [ ] Visual aura animations

### Phase 4: Enhanced Experience (v2.2)

- [ ] Push notifications
- [ ] Reminder system
- [ ] Dark mode refinements
- [ ] Sound effects and haptic feedback
- [ ] Home screen widgets
- [ ] Data export/import

### Phase 5: Social & Cloud (v3.0)

- [ ] Cloud synchronization
- [ ] Account system
- [ ] Social features (optional)
- [ ] Friend challenges
- [ ] Global leaderboards

## Migration Strategy

### Data Migration

The transition from habit tracking to aura collection will preserve existing data:

```typescript
// Current structure
HabitData {
  currentStreak → Will become overall discipline streak
  dailyRecords → Will be preserved as historical data
  bestStreak → Will be kept as a legacy achievement
}

// New structure additions
AuraData {
  totalAura: number
  currentLevel: string
  tasks: Task[]
  completedTasks: CompletedTask[]
  achievements: Achievement[]
  // ... existing habit data preserved
}
```

Users won't lose their progress - existing streaks will be converted into special achievements!

## Contributing 🤝

Contributions are welcome! Feel free to submit issues and pull requests.

## Learn More 📚

To learn more about the technologies used in this project:

- [Expo Documentation](https://docs.expo.dev/): Learn about Expo development
- [React Native Documentation](https://reactnative.dev/): React Native fundamentals
- [Expo Router](https://docs.expo.dev/router/introduction/): File-based routing
- [TypeScript Handbook](https://www.typescriptlang.org/docs/): TypeScript guide

## License 📄

This project is private and for personal use.

---

Made with ❤️ using Expo and React Native
