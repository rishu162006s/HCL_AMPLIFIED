import {
  findCompletedLearningDates,
} from "../repositories/streak.repository";

const toDateKey = (date: Date) => {
  return date.toISOString().split("T")[0];
};

const getPreviousDate = (date: Date) => {
  const previous = new Date(date);

  previous.setUTCDate(
    previous.getUTCDate() - 1
  );

  return previous;
};

export const getMyStreak = async (
  userId: string
) => {
  const history =
    await findCompletedLearningDates(userId);

  const uniqueDates = [
    ...new Set(
      history
        .filter(
          (item) => item.completedAt !== null
        )
        .map((item) =>
          toDateKey(item.completedAt!)
        )
    ),
  ];

  if (uniqueDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      activeDays: 0,
      lastActiveDate: null,
    };
  }

  const dates = uniqueDates
    .map(
      (date) =>
        new Date(`${date}T00:00:00.000Z`)
    )
    .sort(
      (a, b) =>
        b.getTime() - a.getTime()
    );

  let longestStreak = 1;
  let streak = 1;

  for (let i = 1; i < dates.length; i++) {
    const previousDate =
      getPreviousDate(dates[i - 1]);

    if (
      toDateKey(previousDate) ===
      toDateKey(dates[i])
    ) {
      streak++;

      longestStreak = Math.max(
        longestStreak,
        streak
      );
    } else {
      streak = 1;
    }
  }

  const today = new Date();

  const todayKey = toDateKey(today);

  const yesterdayKey = toDateKey(
    getPreviousDate(today)
  );

  let currentStreak = 0;

  if (
    uniqueDates[0] === todayKey ||
    uniqueDates[0] === yesterdayKey
  ) {
    currentStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      const previousDate =
        getPreviousDate(dates[i - 1]);

      if (
        toDateKey(previousDate) ===
        toDateKey(dates[i])
      ) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return {
    currentStreak,
    longestStreak,
    activeDays: uniqueDates.length,
    lastActiveDate: uniqueDates[0],
  };
};

export const getMyStreakHistory = async (
  userId: string
) => {
  const history =
    await findCompletedLearningDates(userId);

  const dates = [
    ...new Set(
      history
        .filter(
          (item) => item.completedAt !== null
        )
        .map((item) =>
          toDateKey(item.completedAt!)
        )
    ),
  ];

  return dates.sort();
};