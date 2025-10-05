# Aura Collector - Detailed Transition Plan

## Vision Statement

Transform from a single-habit tracker into a comprehensive self-improvement gamification platform where users collect "aura" by completing various discipline-building tasks.

## Core Concept: What is "Aura"?

Aura represents your personal energy, discipline, and self-improvement momentum. The more you invest in yourself through deliberate actions, the stronger your aura becomes.

---

## Phase 2 Implementation Guide (Next Steps)

### 1. Type Definitions (Week 1)

Create `types/task.ts`:

```typescript
export type TaskCategory =
  | 'physical'
  | 'mental'
  | 'social'
  | 'productivity'
  | 'habits';
export type TaskDifficulty = 'easy' | 'medium' | 'hard' | 'legendary';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  difficulty: TaskDifficulty;
  auraPoints: number;
  icon: string;
  isCustom: boolean;
  frequency?: 'daily' | 'weekly' | 'once';
}

export interface CompletedTask {
  taskId: string;
  completedAt: number; // timestamp
  auraEarned: number;
  streak?: number;
}

export interface AuraLevel {
  level: number;
  name: string;
  minAura: number;
  maxAura: number;
  color: string;
}
```

Create `types/aura.ts`:

```typescript
import { HabitData } from './habit';
import { Task, CompletedTask } from './task';

export interface AuraData extends HabitData {
  // New aura system fields
  totalAura: number;
  currentLevel: number;
  availableTasks: string[]; // Task IDs
  completedTasks: CompletedTask[];
  customTasks: Task[];
  achievements: Achievement[];

  // Legacy fields (preserved from habit tracker)
  // currentStreak, bestStreak, etc. remain
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: number | null;
  category: string;
}
```

### 2. Task Library (Week 1-2)

Create `constants/tasks.ts` with predefined tasks:

#### Physical Category 💪

- **Easy (10 aura)**
  - "Walk 10,000 steps"
  - "Do 20 push-ups"
  - "Stretch for 10 minutes"
  - "Take the stairs instead of elevator"
- **Medium (25 aura)**
  - "Complete a 30-minute workout"
  - "Run/jog for 2 miles"
  - "Take a cold shower"
  - "Do 100 burpees"
- **Hard (50 aura)**
  - "Complete a full gym session (1+ hour)"
  - "Run 5 miles"
  - "Attend a fitness class"
  - "Do a HIIT workout"
- **Legendary (100 aura)**
  - "Complete a marathon/half-marathon"
  - "Achieve a personal fitness record"
  - "Work out 7 days straight"

#### Mental Category 🧠

- **Easy (10 aura)**
  - "Meditate for 5 minutes"
  - "Read 10 pages of a book"
  - "Practice gratitude journaling"
  - "Learn 5 new vocabulary words"
- **Medium (25 aura)**
  - "Meditate for 20 minutes"
  - "Read for 30 minutes"
  - "Complete an online course lesson"
  - "Solve a complex problem/puzzle"
- **Hard (50 aura)**
  - "Meditate for 1 hour"
  - "Finish a book chapter"
  - "Learn a new skill"
  - "Practice a language for 1 hour"
- **Legendary (100 aura)**
  - "Complete a full course/certification"
  - "Finish an entire book"
  - "Master a new concept deeply"

#### Social Category 🤝

- **Easy (10 aura)**
  - "Call a friend or family member"
  - "Give someone a genuine compliment"
  - "Help someone with a small task"
- **Medium (25 aura)**
  - "Have a meaningful conversation (30+ min)"
  - "Network with someone new"
  - "Volunteer your time"
- **Hard (50 aura)**
  - "Organize a social gathering"
  - "Mentor someone"
  - "Public speaking engagement"
- **Legendary (100 aura)**
  - "Organize a community event"
  - "Make a significant impact on someone's life"

#### Productivity Category 📊

- **Easy (10 aura)**
  - "Make your bed"
  - "Plan your day"
  - "Clean your workspace"
  - "Inbox zero"
- **Medium (25 aura)**
  - "Complete 3 important tasks"
  - "Deep work session (2 hours, no distractions)"
  - "Organize your week"
- **Hard (50 aura)**
  - "Complete a major project milestone"
  - "Deep work session (4+ hours)"
  - "Achieve a significant goal"
- **Legendary (100 aura)**
  - "Launch a project"
  - "Complete a major life goal"
  - "Week of perfect productivity"

#### Habits Category 🌱

- **Easy (10 aura)**
  - "Wake up before 7 AM"
  - "No phone for first hour of day"
  - "Drink 8 glasses of water"
  - "Go to bed before 11 PM"
- **Medium (25 aura)**
  - "Complete morning routine"
  - "No social media for a day"
  - "Track all meals/nutrition"
- **Hard (50 aura)**
  - "Perfect day (all habits)"
  - "Digital detox (weekend)"
  - "Week of consistent routines"

### 3. Aura Level System (Week 2)

```typescript
// constants/auraLevels.ts
export const AURA_LEVELS = [
  { level: 1, name: 'Dormant', minAura: 0, maxAura: 99, color: '#808080' },
  { level: 2, name: 'Awakening', minAura: 100, maxAura: 299, color: '#90EE90' },
  { level: 3, name: 'Kindling', minAura: 300, maxAura: 599, color: '#87CEEB' },
  {
    level: 4,
    name: 'Flickering',
    minAura: 600,
    maxAura: 999,
    color: '#4169E1',
  },
  { level: 5, name: 'Steady', minAura: 1000, maxAura: 1499, color: '#9370DB' },
  { level: 6, name: 'Radiant', minAura: 1500, maxAura: 2499, color: '#FFD700' },
  { level: 7, name: 'Blazing', minAura: 2500, maxAura: 3999, color: '#FF8C00' },
  {
    level: 8,
    name: 'Brilliant',
    minAura: 4000,
    maxAura: 5999,
    color: '#FF4500',
  },
  {
    level: 9,
    name: 'Transcendent',
    minAura: 6000,
    maxAura: 9999,
    color: '#FF1493',
  },
  {
    level: 10,
    name: 'Legendary',
    minAura: 10000,
    maxAura: Infinity,
    color: '#8B00FF',
  },
];
```

### 4. UI/UX Updates (Week 3-4)

#### Home Screen → Dashboard

- Large aura points display with level progress bar
- Current aura level badge with glow effect
- "Today's Challenges" section (3-5 quick tasks)
- Quick stats (streak, tasks completed today, weekly progress)

#### New Tasks Screen

- Filter by category (Physical, Mental, Social, Productivity, Habits)
- Filter by difficulty
- Search functionality
- Card-based UI showing:
  - Task title & description
  - Category icon
  - Aura points reward
  - Difficulty indicator
  - "Complete" button
- Custom task creation button

#### Enhanced History → Progress Screen

- Keep calendar view
- Add statistics:
  - Total aura earned
  - Tasks completed by category
  - Most productive day
  - Current streaks by category
  - Graphs and charts

### 5. Achievement System (Week 5)

```typescript
// constants/achievements.ts
export const ACHIEVEMENTS = [
  {
    id: 'first_task',
    title: 'First Step',
    description: 'Complete your first task',
    icon: '🌟',
    category: 'beginner',
  },
  {
    id: 'week_streak',
    title: 'Week Warrior',
    description: 'Complete tasks 7 days in a row',
    icon: '🔥',
    category: 'streaks',
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Wake up before 6 AM for 7 days',
    icon: '🌅',
    category: 'habits',
  },
  {
    id: 'gym_rat',
    title: 'Gym Rat',
    description: 'Complete 30 physical tasks',
    icon: '💪',
    category: 'physical',
  },
  {
    id: 'scholar',
    title: 'Scholar',
    description: 'Complete 30 mental tasks',
    icon: '📚',
    category: 'mental',
  },
  {
    id: 'social_butterfly',
    title: 'Social Butterfly',
    description: 'Complete 20 social tasks',
    icon: '🦋',
    category: 'social',
  },
  {
    id: 'productivity_master',
    title: 'Productivity Master',
    description: 'Complete 50 productivity tasks',
    icon: '⚡',
    category: 'productivity',
  },
  {
    id: 'level_5',
    title: 'Steady Aura',
    description: 'Reach Aura Level 5',
    icon: '✨',
    category: 'levels',
  },
  {
    id: 'legend',
    title: 'Living Legend',
    description: 'Reach Legendary status',
    icon: '👑',
    category: 'levels',
  },
  // Add more achievements...
];
```

---

## Technical Implementation Steps

### Step 1: Extend Storage

```typescript
// utils/storage.ts - Add new functions
export const loadAuraData = async (): Promise<AuraData> => { ... }
export const saveAuraData = async (data: AuraData): Promise<void> => { ... }
export const migrateHabitToAura = async (): Promise<void> => { ... }
```

### Step 2: Create AuraContext

```typescript
// contexts/AuraContext.tsx
// Similar to HabitContext but with:
// - completeTask(taskId)
// - calculateAuraLevel()
// - unlockAchievement(achievementId)
// - getAvailableTasks()
```

### Step 3: Build Task Components

```typescript
// components/TaskCard.tsx
// components/TaskList.tsx
// components/AuraLevelBadge.tsx
// components/AchievementBadge.tsx
// components/CategoryFilter.tsx
```

### Step 4: Update Navigation

```typescript
// app/(tabs)/_layout.tsx
// Add new tabs or reorganize existing ones
```

---

## Design Considerations

### Color Scheme (Aura Theme)

- Primary: Purple/Blue gradient (#8B00FF → #4169E1)
- Success: Gold (#FFD700)
- Energy: Orange (#FF8C00)
- Background: Dark mode with subtle glows
- Accents: Use aura level colors

### Animations

- Aura point collection: Particles flying to counter
- Level up: Screen flash with congratulatory message
- Task completion: Checkmark animation with haptic feedback
- Achievement unlock: Badge reveal animation

### Icons

Consider using:

- Expo Icons / Ionicons for consistency
- Category icons: 💪🧠🤝📊🌱
- Custom aura glow effects

---

## Migration Path for Existing Users

1. **Automatic migration on app update**
2. **Convert existing data:**
   - Current streak → Special "Legacy Streak" achievement
   - Best streak → "Peak Discipline" achievement
   - Daily records → Historical aura data
3. **Grant starting bonus:**
   - Give users aura points based on their best streak
   - Award "Veteran" achievement for existing users
4. **Show migration welcome screen explaining new features**

---

## Performance Considerations

- Implement pagination for task lists (10-20 at a time)
- Cache task library in AsyncStorage
- Optimize calendar rendering for large date ranges
- Use React.memo for task cards
- Lazy load achievement images/animations

---

## Testing Strategy

1. **Unit Tests**

   - Task completion logic
   - Aura calculation
   - Level progression
   - Achievement triggers

2. **Integration Tests**

   - Data migration from v1.0 to v2.0
   - Storage operations
   - Context state management

3. **User Testing**
   - Beta test with small group
   - Gather feedback on task difficulty/aura values
   - Adjust point values based on completion rates

---

## Next Immediate Steps (Start Here!)

1. ✅ Update README with vision (DONE)
2. ⬜ Create new type files (`types/task.ts`, `types/aura.ts`)
3. ⬜ Build task library (`constants/tasks.ts`)
4. ⬜ Create aura levels (`constants/auraLevels.ts`)
5. ⬜ Design new UI mockups/wireframes
6. ⬜ Implement AuraContext
7. ⬜ Build TaskCard component
8. ⬜ Update home screen to show aura dashboard
9. ⬜ Create tasks screen
10. ⬜ Test migration logic

---

## Questions to Consider

- Should tasks reset daily, or be available on-demand?
- Should there be weekly challenges?
- Should we limit how many tasks can be completed per day?
- Should aura decay over time if no tasks are completed?
- Should there be a social/competitive aspect?
- Should tasks have requirements (e.g., must reach level 3 to unlock)?

---

Good luck with the transition! This is going to be an awesome app! 🚀✨
