import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useActivities } from '@/contexts/ActivityContext';
import { ActivityCategory } from '@/types/activity';
import { ACTIVITY_CATEGORIES } from '@/constants/categories';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';

const EMOJI_OPTIONS = ['🎯', '✨', '🌟', '💫', '🔥', '🚀', '💪', '🎨', '📚', '🧘', '🏃', '🎵', '🌱', '💡', '🎮'];

export default function AddActivityScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { addActivity } = useActivities();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory>('productivity');
  const [selectedEmoji, setSelectedEmoji] = useState('🎯');

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Oops!', 'Please enter an activity title');
      return;
    }

    await addActivity(title.trim(), selectedCategory, description.trim(), selectedEmoji);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const colors = Colors[colorScheme ?? 'light'];

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text }]}>Activity Title *</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
            value={title}
            onChangeText={setTitle}
            placeholder="What did you do?"
            placeholderTextColor={colors.tabIconDefault}
            maxLength={50}
          />

          <Text style={[styles.label, { color: colors.text }]}>Description (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Add some details..."
            placeholderTextColor={colors.tabIconDefault}
            multiline
            numberOfLines={3}
            maxLength={200}
          />

          <Text style={[styles.label, { color: colors.text }]}>Choose an Emoji</Text>
          <View style={styles.emojiContainer}>
            {EMOJI_OPTIONS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={[
                  styles.emojiButton,
                  selectedEmoji === emoji && styles.selectedEmoji,
                ]}
                onPress={() => {
                  setSelectedEmoji(emoji);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}>
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { color: colors.text }]}>Category</Text>
          <View style={styles.categoriesContainer}>
            {Object.values(ACTIVITY_CATEGORIES).map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  { borderColor: category.color },
                  selectedCategory === category.id && { backgroundColor: category.color + '20', borderWidth: 2 },
                ]}
                onPress={() => {
                  setSelectedCategory(category.id);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}>
                <IconSymbol name={category.icon} size={24} color={category.color} />
                <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
                <Text style={[styles.categoryPoints, { color: category.color }]}>+{category.basePoints} pts</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { backgroundColor: colors.card }]}
              onPress={() => router.back()}>
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton, { backgroundColor: ACTIVITY_CATEGORIES[selectedCategory].color }]}
              onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Add Activity</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  emojiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  emojiButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedEmoji: {
    backgroundColor: '#FFD93D',
    transform: [{ scale: 1.1 }],
  },
  emoji: {
    fontSize: 24,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  categoryCard: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
  categoryPoints: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#4ECDC4',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
