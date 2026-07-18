import {
  getUserByTelegramId,
  setAwaitingEveningAnswer
} from '../database/queries.js';

import {
  dailyQualityKeyboard
} from '../keyboards/main.js';

import {
  getOrCreateDailyQuality
} from './dailyQuality.js';

export async function sendMorning(
  bot,
  chatId,
  userId
) {
  const quality =
    await getOrCreateDailyQuality(
      userId
    );

  await bot.telegram.sendMessage(
    chatId,
    `Доброе утро.\n\n${quality.emoji} Сегодня я предлагаю тебе ${quality.title}.\n\n${quality.invitation}`,
    dailyQualityKeyboard()
  );
}

export async function sendDay(
  bot,
  chatId,
  userId
) {
  const quality =
    await getOrCreateDailyQuality(
      userId
    );

  await bot.telegram.sendMessage(
    chatId,
    `${quality.emoji} Маленькое действие на ${quality.title}:\n\n${quality.action}`
  );
}

export async function sendEvening(
  bot,
  chatId
) {
  await bot.telegram.sendMessage(
    chatId,
    'Вечерний вопрос.\n\nКакой момент сегодняшнего дня захотелось бы прожить ещё раз?\n\nНапиши одним сообщением. Даже если это была совсем маленькая искра.'
  );

  const user =
    await getUserByTelegramId(
      chatId
    );

  if (user) {
    await setAwaitingEveningAnswer(
      user.id,
      true
    );
  }
}
