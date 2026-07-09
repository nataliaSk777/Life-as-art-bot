import {
  getOrCreateUser,
  getLatestBeautifulMoments,
  getTopQualities
} from '../database/queries.js';

export function registerDiscoveryHandlers(bot) {
  bot.hears('💎 Мои открытия', async (ctx) => {
    const user = await getOrCreateUser(ctx);

    const qualities = await getTopQualities(user.id, 3);
    const moments = await getLatestBeautifulMoments(user.id, 3);

    if (qualities.length === 0 && moments.length === 0) {
      await ctx.reply(
        'Пока открытий мало. Выбери качество дня и сохрани несколько прекрасных моментов — и я начну замечать твои закономерности.'
      );

      return;
    }

    const qualityLines = qualities.length
      ? qualities.map((row) => `• ${row.chosen_quality}: ${row.count} раз`).join('\n')
      : 'Пока нет выбранных качеств дня.';

    const momentLines = moments.length
      ? moments.map((row) => `• ${row.text}`).join('\n')
      : 'Пока нет сохранённых моментов.';

    await ctx.reply(
      `Вот что я уже заметил:\n\nКачества дня:\n${qualityLines}\n\nПоследние прекрасные моменты:\n${momentLines}`
    );
  });
}
