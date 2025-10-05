# Aura Collector Development Checklist

Track your progress as you build Aura Collector v2.0!

---

## Phase 1: Foundation ✅ COMPLETE

- [x] Create type definitions (`types/task.ts`, `types/aura.ts`)
- [x] Define task library (`constants/tasks.ts`)
- [x] Create aura levels (`constants/auraLevels.ts`)
- [x] Define achievements (`constants/achievements.ts`)
- [x] Update project documentation
- [x] Update app.json and package.json

---

## Phase 2: Core Implementation (CURRENT)

### Week 1: Basic Components & Task Display

#### Day 1-2: Task Display Components

- [ ] Create `components/TaskCard.tsx`
  - [ ] Basic layout with icon, title, description
  - [ ] Aura points badge
  - [ ] Difficulty indicator
  - [ ] Category display
  - [ ] Press animation
- [ ] Create `components/TaskList.tsx`
  - [ ] FlatList implementation
  - [ ] Loading state
  - [ ] Empty state
- [ ] Update `app/(tabs)/explore.tsx` to show tasks
  - [ ] Import ALL_TASKS
  - [ ] Render task list
  - [ ] Test basic display

**Milestone**: Can view tasks on Explore tab ✓

#### Day 3-4: Filtering & Search

- [ ] Create `components/CategoryFilter.tsx`
  - [ ] Tab-based category selector
  - [ ] Active state styling
  - [ ] Icon for each category
- [ ] Create `components/DifficultyFilter.tsx`
  - [ ] Dropdown or button group
  - [ ] Color-coded difficulties
- [ ] Add filtering logic to Tasks screen
  - [ ] Filter by category
  - [ ] Filter by difficulty
  - [ ] Combine filters
- [ ] Add search functionality (optional)
  - [ ] Search input field
  - [ ] Filter by task title/description

**Milestone**: Can filter tasks by category and difficulty ✓

#### Day 5-7: State Management Setup

- [ ] Create `contexts/AuraContext.tsx`
  - [ ] Set up context structure
  - [ ] Initialize with DEFAULT_AURA_DATA
  - [ ] Add loading state
  - [ ] Add error handling
- [ ] Implement `loadAuraData()` function
  - [ ] Check for existing data
  - [ ] Load from AsyncStorage
  - [ ] Handle errors gracefully
- [ ] Implement `saveAuraData()` function
  - [ ] Validate data structure
  - [ ] Save to AsyncStorage
  - [ ] Handle errors
- [ ] Wrap app with AuraProvider
  - [ ] Update `app/_layout.tsx`
  - [ ] Test context access

**Milestone**: AuraContext provides data to all screens ✓

---

### Week 2: Task Completion Logic

#### Day 1-3: Core Task Completion

- [ ] Implement `completeTask()` in AuraContext
  - [ ] Validate task exists
  - [ ] Check if already completed (if daily)
  - [ ] Create CompletedTask record
  - [ ] Add to completedTasks array
  - [ ] Calculate aura earned
  - [ ] Add aura to totalAura
  - [ ] Update taskStats
  - [ ] Update categoryStats
  - [ ] Save to storage
- [ ] Add completion UI to TaskCard
  - [ ] Show "Completed" badge if done today
  - [ ] Disable if already completed
  - [ ] Show loading spinner during save
- [ ] Test task completion flow
  - [ ] Complete a task
  - [ ] Verify aura added
  - [ ] Check persistence (close/reopen app)

**Milestone**: Can complete tasks and earn aura ✓

#### Day 4-5: Aura Level System

- [ ] Implement `getAuraLevel()` helper
  - [ ] Import from auraLevels.ts
  - [ ] Calculate current level from totalAura
- [ ] Implement `getAuraProgress()` helper
  - [ ] Calculate progress to next level
  - [ ] Return progress percentage
- [ ] Create `components/AuraLevelBadge.tsx`
  - [ ] Show current level name
  - [ ] Display level number
  - [ ] Show progress bar to next level
  - [ ] Use level color
  - [ ] Animate on level up
- [ ] Implement level-up detection
  - [ ] Check in completeTask()
  - [ ] Trigger celebration animation
  - [ ] Show alert/modal

**Milestone**: Can see aura level and progress ✓

#### Day 6-7: UI Polish

- [ ] Add haptic feedback
  - [ ] On task completion
  - [ ] On level up
  - [ ] On achievement unlock
- [ ] Add animations
  - [ ] Aura points flying to counter
  - [ ] Task completion checkmark
  - [ ] Level-up celebration
- [ ] Improve task card design
  - [ ] Better colors
  - [ ] Smoother shadows
  - [ ] Icon improvements

**Milestone**: Task completion feels satisfying ✓

---

### Week 3: Home Screen Update

#### Day 1-3: Dashboard Components

- [ ] Create `components/AuraCounter.tsx`
  - [ ] Large aura points display
  - [ ] Animated counter
  - [ ] Pulsing effect
- [ ] Create `components/StatsCard.tsx`
  - [ ] Reusable stat display
  - [ ] Icon + label + value
  - [ ] Card styling
- [ ] Update `app/(tabs)/index.tsx` (Home Screen)
  - [ ] Remove old habit tracking UI (or move lower)
  - [ ] Add AuraCounter at top
  - [ ] Add AuraLevelBadge below counter
  - [ ] Show today's completed tasks
  - [ ] Show quick stats (tasks today, weekly, etc.)
  - [ ] Add "Browse Tasks" button → Tasks tab

**Milestone**: Home screen shows aura progress ✓

#### Day 4-5: Today's Progress Section

- [ ] Create `components/TodayProgress.tsx`
  - [ ] List today's completed tasks
  - [ ] Show aura earned today
  - [ ] Show tasks completed count
  - [ ] Empty state for no tasks yet
- [ ] Add quick actions section
  - [ ] "Complete a Task" button
  - [ ] "View History" button
  - [ ] "See Achievements" button

**Milestone**: Home screen provides overview of progress ✓

#### Day 6-7: Integration & Testing

- [ ] Test navigation between screens
- [ ] Test data persistence
- [ ] Test edge cases (no tasks completed, etc.)
- [ ] Performance testing
- [ ] Bug fixes

**Milestone**: App feels cohesive and functional ✓

---

### Week 4: Statistics & History

#### Day 1-3: Enhanced History Screen

- [ ] Update `app/(tabs)/history.tsx`
  - [ ] Keep existing calendar
  - [ ] Add new stats section below
  - [ ] Show task completion by category
  - [ ] Show aura earned over time
- [ ] Create `components/CategoryStatsBar.tsx`
  - [ ] Horizontal bar chart
  - [ ] Color-coded by category
  - [ ] Show task counts or aura
- [ ] Create `components/StatsSummary.tsx`
  - [ ] Weekly summary
  - [ ] Monthly summary
  - [ ] All-time stats

**Milestone**: Can view detailed statistics ✓

#### Day 4-5: Achievements Screen (Basic)

- [ ] Create `app/(tabs)/achievements.tsx`
  - [ ] Tab structure setup
  - [ ] Import achievements from constants
- [ ] Create `components/AchievementBadge.tsx`
  - [ ] Show icon, title, description
  - [ ] Locked vs unlocked states
  - [ ] Grayscale filter for locked
  - [ ] Shine effect for unlocked
- [ ] Create `components/AchievementGrid.tsx`
  - [ ] Grid layout
  - [ ] Filter by category
  - [ ] Show progress for locked achievements
- [ ] Display achievements
  - [ ] Unlocked section
  - [ ] Locked section
  - [ ] Overall progress bar

**Milestone**: Can view achievements ✓

#### Day 6-7: Achievement Logic (Basic)

- [ ] Implement `checkAchievements()` in AuraContext
  - [ ] Check task_count achievements
  - [ ] Check aura_total achievements
  - [ ] Check level achievements
  - [ ] Mark as unlocked when conditions met
- [ ] Trigger achievement check
  - [ ] After task completion
  - [ ] After level up
- [ ] Show achievement unlock notification
  - [ ] Modal or toast
  - [ ] Animation
  - [ ] Haptic feedback

**Milestone**: Basic achievements work ✓

---

## Phase 3: Advanced Features (NEXT)

### Week 5: Custom Tasks

- [ ] Create `app/create-task.tsx` modal
  - [ ] Form inputs (title, description, etc.)
  - [ ] Category picker
  - [ ] Difficulty picker
  - [ ] Aura points input
  - [ ] Icon picker
  - [ ] Frequency selector
- [ ] Implement `createCustomTask()` in AuraContext
- [ ] Implement `deleteCustomTask()` in AuraContext
- [ ] Show custom tasks in task list
- [ ] Add edit functionality

**Milestone**: Users can create custom tasks ✓

### Week 6: Daily Challenges

- [ ] Implement `generateDailyChallenge()` function
  - [ ] Select 3-5 random tasks
  - [ ] Mix difficulties
  - [ ] Include different categories
  - [ ] Set bonus multiplier
- [ ] Create `components/DailyChallenge.tsx`
  - [ ] Show challenge tasks
  - [ ] Show bonus multiplier
  - [ ] Progress indicator
  - [ ] Complete challenge button
- [ ] Add to Home screen
- [ ] Track challenge completion
- [ ] Award bonus aura

**Milestone**: Daily challenges generate and complete ✓

### Week 7-8: Streak System Integration

- [ ] Preserve existing streak functionality
- [ ] Tie streak to daily task completion
  - [ ] "Complete at least 1 task per day" streak
  - [ ] OR "Complete daily challenge" streak
- [ ] Show both legacy streak and new streak
- [ ] Grant legacy achievements to migrating users

**Milestone**: Streak system integrated ✓

---

## Phase 4: Polish & Refinements

### Week 9: Animations & Effects

- [ ] Add smooth transitions between screens
- [ ] Add aura collection animation
- [ ] Add level-up celebration
- [ ] Add achievement unlock animation
- [ ] Add particle effects (optional)
- [ ] Add sound effects (optional, toggleable)

### Week 10: Notifications & Reminders

- [ ] Request notification permissions
- [ ] Set up expo-notifications
- [ ] Daily reminder notification
- [ ] Streak reminder
- [ ] Challenge expiration reminder
- [ ] Achievement progress notifications

### Week 11: Data Management

- [ ] Implement data export
  - [ ] Export to JSON
  - [ ] Share functionality
- [ ] Implement data import
  - [ ] Load from JSON
  - [ ] Validate data
  - [ ] Merge or replace option
- [ ] Add data reset option (with confirmation)
- [ ] Add migration script for v1.0 users

### Week 12: Testing & Bug Fixes

- [ ] Unit tests for core functions
- [ ] Integration tests
- [ ] Test on multiple devices
- [ ] Test migration from v1.0
- [ ] Performance optimization
- [ ] Memory leak checks
- [ ] Bug fixing
- [ ] User testing feedback

---

## Phase 5: Launch Preparation

### Week 13: Final Polish

- [ ] App icon finalized
- [ ] Splash screen finalized
- [ ] Dark mode fully supported
- [ ] All strings reviewed
- [ ] Accessibility improvements
- [ ] Error messages user-friendly

### Week 14: Documentation & Marketing

- [ ] Update README with v2.0 info
- [ ] Create user guide
- [ ] Take screenshots for app stores
- [ ] Write app store descriptions
- [ ] Create promotional video (optional)
- [ ] Prepare release notes

### Week 15: Deployment

- [ ] Version bump to 2.0.0
- [ ] Build production APK/IPA
- [ ] Submit to Google Play
- [ ] Submit to Apple App Store
- [ ] Web deployment (if applicable)
- [ ] Monitor crash reports
- [ ] Gather user feedback

---

## Optional Enhancements (Future)

### Social Features

- [ ] Friend system
- [ ] Share achievements
- [ ] Challenge friends
- [ ] Leaderboards (optional)
- [ ] Social feed

### Cloud Sync

- [ ] User accounts
- [ ] Firebase/Supabase integration
- [ ] Sync across devices
- [ ] Backup to cloud

### Advanced Gamification

- [ ] Power-ups system
- [ ] Combo multipliers
- [ ] Time-based challenges
- [ ] Weekly quests
- [ ] Monthly themes

### Monetization (Optional)

- [ ] Premium task packs
- [ ] Custom themes
- [ ] Ad-free version
- [ ] Tip jar / donations

---

## Current Status

**Phase**: 2 - Core Implementation  
**Week**: 1  
**Focus**: Basic Components & Task Display

**Next Immediate Task**: Create TaskCard.tsx component

**Estimated Completion**: ~12-15 weeks for full v2.0

---

## Notes & Blockers

Use this space to track issues, questions, or things to remember:

- [ ]
- [ ]
- [ ]

---

## Celebration Milestones 🎉

Mark these special moments:

- [ ] First task displayed ✨
- [ ] First task completed 🎯
- [ ] First aura point earned 💫
- [ ] First level reached 📈
- [ ] First achievement unlocked 🏆
- [ ] First daily challenge completed 🔥
- [ ] First custom task created ✏️
- [ ] App runs smoothly 🚀
- [ ] Beta testing started 👥
- [ ] v2.0 launched! 🎊

---

**Keep this checklist updated as you progress. You've got this! 💪✨**
