import { getOrCreateUser } from '../database/queries.js';
import { replaceDailyQuality } from '../services/dailyQuality.js';
import { dailyQualityKeyboard } from '../keyboards/main.js';

function qualityMessage(
  quality,
  prefix = 'Сегодня'
) {
  return `${quality.emoji} ${prefix} — ${quality.title}.\n\n${quality.invitation}\n\nМаленькое действие:\n\n${quality.action}`;
}

export function registerQualityHandlers(bot) {
  bot.action(
    'accept_daily_quality',
    async (ctx) => {
      try {
        await ctx.answerCbQuery(
          'Пусть это качество побудет с тобой сегодня 🌿'
        );

        await ctx.editMessageReplyMarkup({
          inline_keyboard: []
        });
      } catch (error) {
        console.error(
          'Ошибка подтверждения качества дня:',
          error
        );
      }
    }
  );

  bot.action(
    'replace_daily_quality',
    async (ctx) => {
      try {
        const user = await getOrCreateUser(ctx);
        const quality = await replaceDailyQuality(
          user.id
        );

        await ctx.answerCbQuery(
          'Предлагаю другое качество'
        );

        await ctx.editMessageText(
          qualityMessage(
            quality,
            'Тогда сегодня'
          ),
          dailyQualityKeyboard()
        );
      } catch (error) {
        console.error(
          'Ошибка замены качества дня:',
          error
        );

        await ctx.answerCbQuery(
          'Не получилось заменить качество. Попробуй ещё раз.'
        );
      }
    }
  );
}
