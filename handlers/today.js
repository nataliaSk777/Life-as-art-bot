import {
  getOrCreateUser
} from '../database/queries.js';

import {
  dailyQualityKeyboard
} from '../keyboards/main.js';

import {
  getOrCreateDailyQuality
} from '../services/dailyQuality.js';

export function registerTodayHandlers(bot) {
  bot.hears(
    '🎨 Сегодня',
    async (ctx) => {
      try {
        const user =
          await getOrCreateUser(ctx);

        const quality =
          await getOrCreateDailyQuality(
            user.id
          );

        await ctx.reply(
          `${quality.emoji} Сегодня — ${quality.title}.\n\n${quality.invitation}\n\nМаленькое действие:\n\n${quality.action}`,
          dailyQualityKeyboard()
        );
      } catch (error) {
        console.error(
          'Ошибка раздела «Сегодня»:',
          error
        );

        await ctx.reply(
          'Не получилось открыть сегодняшний день. Попробуй ещё раз.'
        );
      }
    }
  );
}
