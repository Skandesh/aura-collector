import * as Haptics from 'expo-haptics';

export class HapticService {
  // Success patterns
  static async activityComplete() {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  static async achievementUnlock() {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Add slight delay for emphasis
    await new Promise((resolve) => setTimeout(resolve, 100));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  static async levelUp() {
    // Custom celebration pattern
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  static async streakMilestone() {
    // Triple heavy impact for streak milestones
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise((resolve) => setTimeout(resolve, 150));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise((resolve) => setTimeout(resolve, 150));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }

  // Interaction feedback patterns
  static async buttonPress() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  static async toggleOn() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  static async toggleOff() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  static async error() {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }

  static async warning() {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }

  // Combo patterns
  static async comboIncrease(combo: number) {
    const intensity =
      combo <= 3
        ? Haptics.ImpactFeedbackStyle.Light
        : combo <= 6
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Heavy;

    await Haptics.impactAsync(intensity);
  }

  static async comboBreak() {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await new Promise((resolve) => setTimeout(resolve, 200));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }

  static async maxCombo() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }

  // Streak patterns
  static async streakAtRisk() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await new Promise((resolve) => setTimeout(resolve, 200));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  static async streakFreezeUsed() {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }

  // Challenge patterns
  static async challengeComplete() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  static async challengeProgress() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  // Special celebration patterns
  static async onFireMode() {
    // Pulsing pattern for "On Fire" mode
    for (let i = 0; i < 3; i++) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }

  static async dailyGoalComplete() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}
