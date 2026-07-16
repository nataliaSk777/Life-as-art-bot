import {
  getTodayQuality,
  setTodayQuality
} from '../database/queries.js';

import {
  getQualityByValue,
  getRandomQuality
} from '../data/qualities.js';

export async function getOrCreateDailyQuality(userId) {
  const storedValue = await getTodayQuality(userId);
  const existingQuality = getQualityByValue(storedValue);

  if (existingQuality) {
    return existingQuality;
  }

  const quality = getRandomQuality();

  await setTodayQuality(userId, quality.value);

  return quality;
}

export async function replaceDailyQuality(userId) {
  const storedValue = await getTodayQuality(userId);
  const currentQuality = getQualityByValue(storedValue);

  const quality = getRandomQuality(
    currentQuality?.value || null
  );

  await setTodayQuality(userId, quality.value);

  return quality;
}
