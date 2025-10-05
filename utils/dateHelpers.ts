import { isToday, isYesterday, startOfDay, differenceInHours, parseISO } from 'date-fns';

export interface DateValidationResult {
  isValid: boolean;
  reason?: string;
}

/**
 * Validates if a date can be marked (today or yesterday within grace period)
 */
export const canMarkDate = (
  date: Date,
  gracePeriodHours: number = 24
): DateValidationResult => {
  const now = new Date();

  // Can always mark today
  if (isToday(date)) {
    return { isValid: true };
  }

  // Check if it's yesterday and within grace period
  if (isYesterday(date)) {
    const hoursSinceYesterday = differenceInHours(now, startOfDay(date));
    if (hoursSinceYesterday <= gracePeriodHours) {
      return { isValid: true };
    }
    return {
      isValid: false,
      reason: `Grace period of ${gracePeriodHours} hours has passed`,
    };
  }

  // Future dates
  if (date > now) {
    return {
      isValid: false,
      reason: 'Cannot mark future dates',
    };
  }

  // Dates older than yesterday
  return {
    isValid: false,
    reason: 'Can only mark today or yesterday',
  };
};

/**
 * Normalizes a date to ISO date string (YYYY-MM-DD)
 */
export const toISODateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Parses an ISO date string to Date object at start of day
 */
export const fromISODateString = (dateString: string): Date => {
  return startOfDay(parseISO(dateString));
};

/**
 * Gets today's date as ISO string
 */
export const getTodayISO = (): string => {
  return toISODateString(new Date());
};

/**
 * Gets yesterday's date as ISO string
 */
export const getYesterdayISO = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return toISODateString(yesterday);
};

/**
 * Checks if a date string represents today
 */
export const isDateToday = (dateString: string): boolean => {
  return dateString === getTodayISO();
};

/**
 * Checks if a date string represents yesterday
 */
export const isDateYesterday = (dateString: string): boolean => {
  return dateString === getYesterdayISO();
};
