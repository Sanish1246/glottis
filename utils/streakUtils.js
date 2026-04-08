/**
 * Computes updated streak data when user logs in.
 * @param {Object} streakData - Current streak { endDate, currentDuration, maxDuration, maxStartDate, maxEndDate, startDate }
 * @param {string} today - Today's date in DD-MM-YYYY format
 * @returns {Object|null} - Updated streak fields, or null if no change (e.g. already logged in today)
 */
export function computeStreakUpdate(streakData, today) {
  const parts = today.split("-");
  if (parts.length !== 3) return null;

  const [d, m, y] = parts.map(Number);
  // DD-MM-YYYY format
  const todayDate = new Date(y, m - 1, d);
  const yesterday = new Date(todayDate);
  yesterday.setDate(yesterday.getDate() - 1);

  const pad = (n) => String(n).padStart(2, "0");
  const format = (dt) =>
    `${pad(dt.getDate())}-${pad(dt.getMonth() + 1)}-${dt.getFullYear()}`;
  const yesterdayStr = format(yesterday);

  // Same calendar day as last activity — streak already updated, do nothing
  if (streakData?.endDate === today) {
    return null;
  }

  const result = {
    currentDuration: 1,
    startDate: today,
    endDate: today,
  };

  if (streakData?.endDate === yesterdayStr) {
    result.currentDuration = (streakData.currentDuration ?? 0) + 1;
    result.startDate = streakData.startDate ?? today;
  }

  const maxDuration = streakData?.maxDuration ?? 0;
  if (result.currentDuration > maxDuration) {
    result.maxDuration = result.currentDuration;
    result.maxStartDate = result.startDate;
    result.maxEndDate = result.endDate;
  }

  return result;
}
