import { env } from '../config/env.js';

import {
  getOrCreateUser
} from '../database/queries.js';

import {
  dailyQualityKeyboard,
  mainMenu
} from '../keyboards/main.js';

import {
  getOrCreateDailyQuality
} from '../services/dailyQuality.js';

function qualityMessage(quality) {
  return `${quality.emoji} Сегодня я предлагаю тебе ${quality.title}.\n\n${quality.invitation}\n\nМаленькое действие:\n\n${quality.action}`;
}

export function registerStartHandlers(bot) {
  bot.start(async (ctx) => {
    try {
      const user =
        await getOrCreateUser(ctx);

      const quality =
        await getOrCreateDailyQuality(
          user.id
        );

      await ctx.reply(
        `Привет, ${user.first_name}.\n\nЯ бот «Жизнь как искусство».\n\nЯ буду помогать тебе замечать жизнь, создавать маленькие красивые моменты и постепенно узнавать, что делает твои дни живыми.`,
        mainMenu()
      );

      await ctx.reply(
        qualityMessage(quality),
        dailyQualityKeyboard()
      );

      if (
        String(ctx.from.id) ===
        String(env.ADMIN_ID)
      ) {
        await ctx.reply(
          'Наташа, бот запущен. Ты вошла как администратор проекта.'
        );
      }
    } catch (error) {
      console.error(
        'Ошибка команды /start:',
        error
      );

      await ctx.reply(
        'Не получилось запустить бота. Попробуй ещё раз через минуту.'
      );
    }
  });

  bot.command('ping', async (ctx) => {
    await ctx.reply('Бот живой 🌿');
  });
}
