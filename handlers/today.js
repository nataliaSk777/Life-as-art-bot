import { getOrCreateUser, setTodayQuality } from '../database/queries.js';
import { mainMenu, qualitiesKeyboard } from '../keyboards/main.js';

export function registerTodayHandlers(bot) {
  bot.hears('🎨 Сегодня', async (ctx) => {
    await getOrCreateUser(ctx);

    await ctx.reply(
      'Какое качество ты хочешь добавить в сегодняшний день?',
      qualitiesKeyboard()
    );
  });

  bot.action(/^quality:(.+)$/, async (ctx) => {
    const user = await getOrCreateUser(ctx);
    const quality = ctx.match[1];

    await setTodayQuality(user.id, quality);
    await ctx.answerCbQuery();

    await ctx.reply(
      `Хорошо. Сегодня я буду помогать тебе замечать ${quality.toLowerCase()}.\\n\\nМаленькое действие:\\n\\nостановись на 20 секунд и найди вокруг одну деталь, которая делает этот момент чуть живее.`,
      mainMenu()
    );
  });
}
