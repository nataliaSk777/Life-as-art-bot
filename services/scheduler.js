import {
  getAllUsersForScheduler,
  markDelivered,
  wasDelivered
} from '../database/queries.js';

import {
  sendMorning,
  sendDay,
  sendEvening
} from './messages.js';

function moscowTimeParts() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Moscow',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(new Date());

  const hour = Number(parts.find((part) => part.type === 'hour').value);
  const minute = Number(parts.find((part) => part.type === 'minute').value);

  return { hour, minute };
}

function currentMoscowTime() {
  const { hour, minute } = moscowTimeParts();

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

async function dispatcherTick(bot) {
  const current = currentMoscowTime();
  const users = await getAllUsersForScheduler(current);

  for (const user of users) {
    try {
      if (user.morning_time === current && !(await wasDelivered(user.id, 'morning'))) {
        await sendMorning(bot, user.telegram_id);
        await markDelivered(user.id, 'morning');
      }

      if (user.day_time === current && !(await wasDelivered(user.id, 'day'))) {
        await sendDay(bot, user.telegram_id, user.id);
        await markDelivered(user.id, 'day');
      }

      if (user.evening_time === current && !(await wasDelivered(user.id, 'evening'))) {
        await sendEvening(bot, user.telegram_id);
        await markDelivered(user.id, 'evening');
      }
    } catch (error) {
      console.error(`Ошибка отправки пользователю ${user.telegram_id}:`, error.message);
    }
  }
}

export function startScheduler(bot) {
  dispatcherTick(bot).catch((error) => {
    console.error('Ошибка первого запуска планировщика:', error.message);
  });

  setInterval(() => {
    dispatcherTick(bot).catch((error) => {
      console.error('Ошибка планировщика:', error.message);
    });
  }, 60 * 1000);
}
