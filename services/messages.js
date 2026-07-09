import { qualitiesKeyboard } from '../keyboards/main.js';
import { getTodayQuality, getUserByTelegramId, setAwaitingEveningAnswer } from '../database/queries.js';

export async function sendMorning(bot, chatId) {
  await bot.telegram.sendMessage(
    chatId,
    'Доброе утро.\\n\\nКакое качество ты хочешь добавить в сегодняшний день?\\n\\nНе для идеальности. Для ощущения, что день принадлежит тебе.',
    qualitiesKeyboard()
  );
}

export async function sendDay(bot, chatId, userId) {
  const quality = await getTodayQuality(userId);

  if (!quality) {
    await bot.telegram.sendMessage(
      chatId,
      'Маленькая пауза дня.\\n\\nСпроси себя: что сейчас сделает этот день чуть более живым?\\n\\nМожно выбрать качество дня.',
      qualitiesKeyboard()
    );

    return;
  }

  const textByQuality = {
    'Спокойствие': 'Маленькое действие на спокойствие:\\n\\nположи одну ладонь на грудь, сделай медленный выдох и на 20 секунд перестань торопиться.',
    'Красоту': 'Маленькое действие на красоту:\\n\\nнайди одну красивую деталь вокруг. Свет, цвет, линию, звук, жест, предмет. Просто заметь.',
    'Тепло': 'Маленькое действие на тепло:\\n\\nскажи кому-то одну добрую фразу. Или скажи её себе.',
    'Лёгкость': 'Маленькое действие на лёгкость:\\n\\nубери одну лишнюю вещь с поверхности рядом. Не весь дом. Только одну вещь.',
    'Смелость': 'Маленькое действие на смелость:\\n\\nсделай один маленький шаг, который давно откладывала. Совсем маленький.',
    'Внимание': 'Маленькое действие на внимание:\\n\\nпосмотри на то, что делаешь сейчас, так, будто это важная сцена твоего дня.'
  };

  await bot.telegram.sendMessage(
    chatId,
    textByQuality[quality] || 'Маленькое действие дня:\\n\\nостановись на 20 секунд и найди, что делает этот момент живым.'
  );
}

export async function sendEvening(bot, chatId) {
  const user = await getUserByTelegramId(chatId);

  if (user) {
    await setAwaitingEveningAnswer(user.id, true);
  }

  await bot.telegram.sendMessage(
    chatId,
    'Вечерний вопрос.\\n\\nКакой момент сегодняшнего дня захотелось бы прожить ещё раз?\\n\\nНапиши одним сообщением. Даже если это была совсем маленькая искра.'
  );
}
