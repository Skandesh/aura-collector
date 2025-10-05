# Quick Start Guide - Building Your First Aura Feature

This guide will help you implement your first feature in the Aura Collector transition.

## Recommended First Feature: Task Viewing

Let's start by creating a simple task browser that displays the available tasks. This will give you a feel for the new system without being overwhelming.

---

## Step-by-Step Implementation

### 1. Create a Task Card Component (15 minutes)

Create `components/TaskCard.tsx`:

```typescript
import { StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
}

export const TaskCard = ({ task, onPress }: TaskCardProps) => {
  const getDifficultyColor = () => {
    switch (task.difficulty) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'hard':
        return '#F44336';
      case 'legendary':
        return '#9C27B0';
      default:
        return '#808080';
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <ThemedView style={styles.cardContent}>
        {/* Icon */}
        <ThemedText style={styles.icon}>{task.icon}</ThemedText>

        {/* Content */}
        <ThemedView style={styles.textContent}>
          <ThemedText type="defaultSemiBold" style={styles.title}>
            {task.title}
          </ThemedText>
          <ThemedText style={styles.description} numberOfLines={2}>
            {task.description}
          </ThemedText>
        </ThemedView>

        {/* Aura Points */}
        <ThemedView
          style={[styles.auraBadge, { backgroundColor: getDifficultyColor() }]}
        >
          <ThemedText style={styles.auraText}>+{task.auraPoints}</ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Difficulty Badge */}
      <ThemedView style={styles.footer}>
        <ThemedText
          style={[styles.difficulty, { color: getDifficultyColor() }]}
        >
          {task.difficulty.toUpperCase()}
        </ThemedText>
        <ThemedText style={styles.category}>{task.category}</ThemedText>
      </ThemedView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.7,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(100, 200, 255, 0.05)',
  },
  icon: {
    fontSize: 40,
    marginRight: 12,
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
  },
  auraBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  auraText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(100, 200, 255, 0.05)',
  },
  difficulty: {
    fontSize: 12,
    fontWeight: '600',
  },
  category: {
    fontSize: 12,
    opacity: 0.6,
  },
});
```

### 2. Update the Explore Tab to Show Tasks (20 minutes)

Modify `app/(tabs)/explore.tsx`:

```typescript
import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TaskCard } from '@/components/TaskCard';
import { ALL_TASKS } from '@/constants/tasks';
import { useState } from 'react';

export default function ExploreScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTasks =
    selectedCategory === 'all'
      ? ALL_TASKS.slice(0, 10) // Show first 10 for demo
      : ALL_TASKS.filter((t) => t.category === selectedCategory).slice(0, 10);

  const handleTaskPress = (taskId: string) => {
    console.log('Task pressed:', taskId);
    // TODO: Implement task completion logic
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Available Tasks</ThemedText>
          <ThemedText style={styles.subtitle}>
            Complete tasks to earn aura points
          </ThemedText>
        </ThemedView>

        {/* Task List */}
        <ThemedView style={styles.taskList}>
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => handleTaskPress(task.id)}
            />
          ))}
        </ThemedView>

        <ThemedText style={styles.comingSoon}>
          🚧 More features coming soon! This is just a preview.
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  taskList: {
    gap: 0,
  },
  comingSoon: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    opacity: 0.6,
  },
});
```

### 3. Test It! (5 minutes)

Run your app:

```bash
npm start
```

Navigate to the "Explore" tab and you should see a list of tasks displayed beautifully!

---

## Next Steps After This Works

Once you have the basic task display working, you can:

### Phase A: Add Interactivity (Next Session)

1. **Task Completion Alert**: Show confirmation when pressing a task
2. **Filter by Category**: Add category tabs/buttons
3. **Filter by Difficulty**: Add difficulty filter

### Phase B: Add Persistence (Following Session)

1. **Create AuraContext**: Similar to HabitContext but with task completion
2. **Implement completeTask()**: Function to mark tasks as complete
3. **Track Completed Tasks**: Store in AsyncStorage
4. **Calculate Aura Points**: Sum up completed tasks

### Phase C: Update Home Screen (After Phase B)

1. **Show Total Aura**: Display total aura points earned
2. **Show Current Level**: Display aura level with progress bar
3. **Show Today's Tasks**: List of completed tasks today
4. **Keep Streak Display**: Preserve the existing streak functionality

---

## Tips for Success

### 1. Work in Small Chunks

Don't try to implement everything at once. Get one feature working, commit it, then move to the next.

### 2. Preserve Existing Functionality

Keep the current habit tracking working while you build new features. You can test the migration later.

### 3. Use Console Logs

Add `console.log()` statements to debug and understand data flow:

```typescript
console.log('Task pressed:', task.id);
console.log('Total aura:', totalAura);
```

### 4. Test on Real Device

The app will feel more real when tested on a physical device or emulator.

### 5. Iterate on UI/UX

Don't worry about making it perfect initially. Get it working, then refine the design.

---

## Common Issues & Solutions

### Issue: Tasks not showing

**Solution**: Check that the import path is correct:

```typescript
import { ALL_TASKS } from '@/constants/tasks';
```

### Issue: TypeScript errors

**Solution**: Make sure all new type files are imported:

```typescript
import { Task } from '@/types/task';
```

### Issue: Styles not applying

**Solution**: Verify ThemedView and ThemedText are being used for proper theme support

---

## File Checklist

Before you start, make sure these files exist:

- ✅ `types/task.ts`
- ✅ `types/aura.ts`
- ✅ `constants/tasks.ts`
- ✅ `constants/auraLevels.ts`
- ✅ `constants/achievements.ts`

To create:

- ⬜ `components/TaskCard.tsx`
- ⬜ Update `app/(tabs)/explore.tsx`

---

## Estimated Time

- **Total**: ~40 minutes for basic task viewing
- **Component creation**: 15 min
- **Screen update**: 20 min
- **Testing**: 5 min

---

## Questions to Ask Yourself

As you build:

1. Does the UI feel intuitive?
2. Are the aura point values fair for each task difficulty?
3. What information is most important to show on the task card?
4. Should tasks show if they've been completed today?
5. How should we handle repeatable vs one-time tasks?

---

## Resources

- **Expo Docs**: https://docs.expo.dev/
- **React Native Components**: https://reactnative.dev/docs/components-and-apis
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

---

## Celebrate Small Wins! 🎉

When you see your first task card render with the emoji icon and aura points, that's a huge milestone! Take a screenshot, commit your code, and be proud of the progress.

Remember: Every great app starts with a single component. You've got this! 💪✨

---

**Next Guide**: Once this is working, refer to `TRANSITION_PLAN.md` for Phase 2.1 implementation details.
