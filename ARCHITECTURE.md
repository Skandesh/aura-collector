# Aura Collector - Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         AURA COLLECTOR                          │
│                      (React Native + Expo)                       │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
            ┌───────▼────────┐       ┌───────▼────────┐
            │   UI LAYER     │       │  DATA LAYER    │
            │   (Screens)    │       │   (Context)    │
            └───────┬────────┘       └───────┬────────┘
                    │                         │
         ┌──────────┼──────────┐             │
         │          │          │             │
    ┌────▼───┐ ┌───▼────┐ ┌──▼───┐    ┌────▼────────┐
    │ Home   │ │ Tasks  │ │ Hist │    │ AuraContext │
    │ Screen │ │ Screen │ │ ory  │    │  (Global    │
    │        │ │        │ │      │    │   State)    │
    └────┬───┘ └───┬────┘ └──┬───┘    └────┬────────┘
         │         │         │              │
         │    ┌────▼─────────▼──────────────▼──┐
         │    │       COMPONENTS LAYER          │
         │    ├─────────────────────────────────┤
         └────►  TaskCard, AuraLevelBadge,      │
              │  AchievementBadge, StatsCard    │
              └─────────────┬───────────────────┘
                            │
              ┌─────────────▼───────────────┐
              │      BUSINESS LOGIC         │
              ├─────────────────────────────┤
              │  • Task completion          │
              │  • Aura calculation         │
              │  • Level progression        │
              │  • Achievement unlock       │
              │  • Streak tracking          │
              └─────────────┬───────────────┘
                            │
              ┌─────────────▼───────────────┐
              │     DATA PERSISTENCE        │
              ├─────────────────────────────┤
              │  AsyncStorage (Local)       │
              │  • AuraData                 │
              │  • CompletedTasks           │
              │  • Achievements             │
              │  • CustomTasks              │
              │  • Legacy HabitData         │
              └─────────────────────────────┘
```

---

## Data Flow Diagram

```
┌──────────────┐
│     USER     │
│   ACTIONS    │
└──────┬───────┘
       │
       │ 1. User completes a task
       │
       ▼
┌──────────────────┐
│  TaskCard.tsx    │  ← Component triggers action
│  onPress()       │
└──────┬───────────┘
       │
       │ 2. Calls context method
       │
       ▼
┌──────────────────────┐
│  AuraContext.tsx     │  ← Global state management
│  completeTask()      │
└──────┬───────────────┘
       │
       │ 3. Updates state
       │
       ├──────────────────────┬──────────────────┬─────────────────┐
       │                      │                  │                 │
       ▼                      ▼                  ▼                 ▼
┌─────────────┐    ┌────────────────┐   ┌─────────────┐  ┌──────────────┐
│ Add aura    │    │ Check level    │   │ Check       │  │ Update       │
│ points      │    │ progression    │   │ achievements│  │ statistics   │
└─────┬───────┘    └────────┬───────┘   └─────┬───────┘  └──────┬───────┘
      │                     │                  │                 │
      └─────────────────────┴──────────────────┴─────────────────┘
                                     │
                                     │ 4. Persist to storage
                                     │
                                     ▼
                          ┌──────────────────┐
                          │  AsyncStorage    │
                          │  saveAuraData()  │
                          └──────────────────┘
                                     │
                                     │ 5. Re-render UI
                                     │
                                     ▼
                          ┌──────────────────┐
                          │   Updated UI     │
                          │  • New aura pts  │
                          │  • Level up?     │
                          │  • Achievement!  │
                          └──────────────────┘
```

---

## File Structure & Relationships

```
aura-collector/
│
├── app/                          # Screens (UI Layer)
│   ├── (tabs)/
│   │   ├── index.tsx            # Home/Dashboard
│   │   ├── tasks.tsx            # Task browser (NEW)
│   │   ├── history.tsx          # Calendar + Stats
│   │   └── achievements.tsx     # Achievement gallery (NEW)
│   └── _layout.tsx
│
├── components/                   # Reusable UI Components
│   ├── TaskCard.tsx             # (NEW) Display a task
│   ├── AuraLevelBadge.tsx       # (NEW) Show current level
│   ├── AchievementBadge.tsx     # (NEW) Show achievement
│   ├── StatsCard.tsx            # (NEW) Statistics display
│   ├── themed-text.tsx          # Existing
│   └── themed-view.tsx          # Existing
│
├── contexts/                     # State Management
│   ├── HabitContext.tsx         # Existing (v1.0)
│   └── AuraContext.tsx          # (NEW) Aura system state
│
├── types/                        # TypeScript Definitions
│   ├── habit.ts                 # Existing (v1.0)
│   ├── task.ts                  # ✅ NEW - Task types
│   └── aura.ts                  # ✅ NEW - Aura types
│
├── constants/                    # Static Data
│   ├── theme.ts                 # Existing
│   ├── tasks.ts                 # ✅ NEW - Task library (50+ tasks)
│   ├── auraLevels.ts            # ✅ NEW - Level definitions
│   └── achievements.ts          # ✅ NEW - Achievement list
│
├── utils/                        # Helper Functions
│   ├── storage.ts               # Existing (extend for aura)
│   ├── dateHelpers.ts           # Existing
│   └── auraHelpers.ts           # (NEW) Aura calculations
│
└── assets/                       # Images & Resources
    └── images/
```

---

## Component Hierarchy

```
App Root
│
├── AuraProvider (NEW - Wraps entire app)
│   │
│   └── HabitProvider (Existing - Backwards compatible)
│       │
│       └── Navigation
│           │
│           ├── Home Screen (Dashboard)
│           │   ├── AuraLevelBadge (NEW)
│           │   ├── StatsCard (NEW)
│           │   ├── DailyChallenges (NEW)
│           │   └── QuickActions
│           │
│           ├── Tasks Screen (NEW)
│           │   ├── CategoryFilter (NEW)
│           │   ├── DifficultyFilter (NEW)
│           │   └── TaskList (NEW)
│           │       └── TaskCard × N (NEW)
│           │
│           ├── History Screen (Enhanced)
│           │   ├── Calendar (Existing)
│           │   ├── StreakDisplay (Existing)
│           │   └── StatsGraphs (NEW)
│           │
│           └── Achievements Screen (NEW)
│               ├── ProgressBar (NEW)
│               └── AchievementGrid (NEW)
│                   └── AchievementBadge × N (NEW)
```

---

## State Management Structure

```typescript
// AuraContext State Shape
{
  // Aura System (NEW)
  totalAura: number,
  currentLevel: number,
  completedTasks: CompletedTask[],
  achievements: Achievement[],
  customTasks: Task[],
  dailyChallenge: DailyChallenge | null,

  // Statistics (NEW)
  taskStats: Record<string, TaskStats>,
  categoryStats: Record<string, CategoryStats>,

  // Legacy Habit Data (Preserved from v1.0)
  currentStreak: number,
  bestStreak: number,
  streakStartDate: string | null,
  dailyRecords: DailyRecord[],
  streakHistory: StreakHistoryEntry[],

  // Settings
  preferences: AuraPreferences,
  settings: HabitSettings,

  // UI State
  loading: boolean,
  error: string | null,
}
```

---

## Key Functions in AuraContext

```typescript
interface AuraContextType {
  // === Data ===
  auraData: AuraData;
  loading: boolean;
  error: string | null;

  // === Task Actions ===
  completeTask(taskId: string): Promise<TaskCompletionResult>;
  createCustomTask(task: CreateTaskInput): Promise<void>;
  deleteCustomTask(taskId: string): Promise<void>;

  // === Queries ===
  getAvailableTasks(): Task[];
  getCompletedTasksToday(): CompletedTask[];
  getTaskStats(taskId: string): TaskStats | null;
  getCategoryStats(category: TaskCategory): CategoryStats;

  // === Progress ===
  getAuraProgress(): AuraLevelProgress;
  checkAchievements(): Achievement[];

  // === Challenges ===
  generateDailyChallenge(): DailyChallenge;
  completeDailyChallenge(): Promise<void>;

  // === Legacy Support (from v1.0) ===
  markDaySuccessful(date: Date): Promise<void>;
  markDayUnsuccessful(date: Date): Promise<void>;
  resetStreak(manual: boolean): Promise<void>;

  // === Utils ===
  refreshData(): Promise<void>;
  exportData(): Promise<string>;
  importData(jsonString: string): Promise<void>;
}
```

---

## Task Completion Flow (Detailed)

```
1. USER TAPS TASK CARD
   └─→ TaskCard.onPress()

2. TRIGGER COMPLETION
   └─→ AuraContext.completeTask(taskId)

3. VALIDATE TASK
   ├─→ Check if task exists
   ├─→ Check if already completed today (if daily)
   ├─→ Check level requirement
   └─→ Validation passed ✓

4. UPDATE STATE
   ├─→ Add to completedTasks[]
   ├─→ Add aura points to totalAura
   ├─→ Update taskStats[taskId]
   └─→ Update categoryStats[category]

5. CHECK PROGRESSION
   ├─→ Did user level up?
   │   └─→ Yes: Trigger level-up animation
   └─→ Check achievement conditions
       └─→ Any unlocked? Show achievement popup

6. PERSIST DATA
   └─→ AsyncStorage.saveAuraData()

7. UPDATE UI
   ├─→ Task card shows "Completed" checkmark
   ├─→ Aura counter animates (+25 pts)
   ├─→ Progress bar updates
   └─→ Achievement notification (if any)

8. HAPTIC FEEDBACK
   └─→ Haptics.notificationAsync('success')
```

---

## Migration Strategy (v1.0 → v2.0)

```
OLD DATA (v1.0)          MIGRATION          NEW DATA (v2.0)
─────────────────        ─────────          ────────────────
HabitData                   │               AuraData
├─ currentStreak      ──────┼────────→      ├─ currentStreak (preserved)
├─ bestStreak         ──────┼────────→      ├─ bestStreak (preserved)
├─ dailyRecords       ──────┼────────→      ├─ dailyRecords (preserved)
├─ streakHistory      ──────┼────────→      ├─ streakHistory (preserved)
└─ settings           ──────┼────────→      ├─ settings (preserved)
                            │               │
                            │               ├─ totalAura (NEW - calculated from streak)
                            │               ├─ currentLevel (NEW - calculated)
                            │               ├─ completedTasks (NEW - empty array)
                            │               ├─ achievements (NEW - grant legacy badges)
                            │               ├─ customTasks (NEW - empty array)
                            │               ├─ taskStats (NEW - empty object)
                            │               ├─ categoryStats (NEW - initialized)
                            │               └─ preferences (NEW - defaults)
                            │
            BONUS AWARDS    │
         ──────────────────┼────────→      Grant achievements:
         If bestStreak > 7 │               • "Legacy Veteran"
         Grant aura points │               • "Legacy Streak"
         based on history  │               • "Peak Discipline"
                           │               Starting aura = bestStreak × 10
```

---

## Technology Stack

```
┌─────────────────────────────────────┐
│        PRESENTATION LAYER           │
├─────────────────────────────────────┤
│ • React Native 0.81                 │
│ • Expo SDK 54                       │
│ • TypeScript 5.9                    │
│ • Expo Router (file-based routing)  │
└─────────────────────────────────────┘
                 │
┌─────────────────────────────────────┐
│         STATE MANAGEMENT            │
├─────────────────────────────────────┤
│ • React Context API                 │
│ • React Hooks (useState, useEffect) │
└─────────────────────────────────────┘
                 │
┌─────────────────────────────────────┐
│          DATA LAYER                 │
├─────────────────────────────────────┤
│ • AsyncStorage (@react-native-*)    │
│ • JSON serialization                │
│ • Local device storage              │
└─────────────────────────────────────┘
                 │
┌─────────────────────────────────────┐
│          UTILITIES                  │
├─────────────────────────────────────┤
│ • date-fns (date manipulation)      │
│ • expo-haptics (feedback)           │
│ • expo-image (optimized images)     │
└─────────────────────────────────────┘
```

---

## Performance Considerations

### Optimization Strategies

1. **Component Memoization**

   ```typescript
   export const TaskCard = React.memo(({ task, onPress }) => {
     // Component code
   });
   ```

2. **Virtual Lists**

   ```typescript
   <FlatList
     data={tasks}
     renderItem={({ item }) => <TaskCard task={item} />}
     keyExtractor={(item) => item.id}
     maxToRenderPerBatch={10}
     windowSize={5}
   />
   ```

3. **Lazy Loading**

   - Load tasks in batches
   - Paginate achievement list
   - Lazy load calendar months

4. **State Updates**
   - Batch state updates
   - Debounce frequent operations
   - Use useCallback for handlers

---

## Security Considerations

1. **Data Validation**

   - Validate all user inputs
   - Type checking with TypeScript
   - Schema validation before storage

2. **Storage**

   - Data stored locally (no server exposure)
   - No sensitive personal data
   - Optional: Encrypt custom task content

3. **Error Handling**
   - Try-catch blocks around storage operations
   - Graceful degradation on errors
   - Error boundaries for UI crashes

---

## Testing Strategy

```
├── Unit Tests
│   ├── Aura calculation functions
│   ├── Level progression logic
│   ├── Achievement unlock conditions
│   └── Data validation

├── Integration Tests
│   ├── Task completion flow
│   ├── Data persistence
│   ├── Migration script
│   └── Context state updates

├── Component Tests
│   ├── TaskCard rendering
│   ├── AuraLevelBadge display
│   └── User interactions

└── E2E Tests
    ├── Complete user flows
    ├── Data migration
    └── Error scenarios
```

---

## Deployment Checklist

- [ ] All TypeScript errors resolved
- [ ] All tests passing
- [ ] Migration script tested
- [ ] Performance optimized
- [ ] Error handling comprehensive
- [ ] User data backed up
- [ ] Rollback plan ready
- [ ] Beta testing completed
- [ ] App store assets prepared
- [ ] Version number updated
- [ ] Release notes written

---

This architecture provides a solid foundation for building a scalable, maintainable, and performant aura collection system! 🚀✨
