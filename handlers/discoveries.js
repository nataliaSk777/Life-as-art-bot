import {
  getLatestBeautifulMoments,
  getOrCreateUser,
  getTopQualities
} from '../database/queries.js';

import {
  getQualityByValue
} from '../data/qualities.js';

export function registerDiscoveryHandlers(
  bot
) {
  bot.hears(
    '💎 Мои открытия',
    async (ctx) => {
      try {
        const user =
          await getOrCreateUser(ctx);

        const qualities =
          await getTopQualities(
            user.id,
            3
          );

        const moments =
          await getLatestBeautifulMoments(
            user.id,
            3
          );

        if (
          qualities.length === 0 &&
          moments.length === 0
        ) {
          await ctx.reply(
            'Пока открытий мало. Проживи несколько дней вместе со мной и сохрани несколько прекрасных моментов — и я начну замечать твои закономерности.'
          );

          return;
        }

        const qualityLines =
          qualities.length > 0
            ? qualities
                .map((row) => {
                  const quality =
                    getQualityByValue(
                      row.chosen_quality
                    );

                  const title =
                    quality?.value ||
                    row.chosen_quality;

                  return `• ${title}: ${row.count} раз`;
                })
                .join('\n')
            : 'Пока нет качеств дня.';

        const momentLines =
          moments.length > 0
            ? moments
                .map(
                  (row) =>
                    `• ${row.text}`
                )
                .join('\n')
            : 'Пока нет сохранённых моментов.';

        await ctx.reply(
          `Вот что я уже заметил:\n\nКачества дня:\n${qualityLines}\n\nПоследние прекрасные моменты:\n${momentLines}`
        );
      } catch (error) {
        console.error(
          'Ошибка раздела «Мои открытия»:',
          error
        );

        await ctx.reply(
          'Не получилось загрузить открытия. Попробуй ещё раз.'
        );
      }
    }
  );
}
