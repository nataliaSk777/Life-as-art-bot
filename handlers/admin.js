import { env } from '../config/env.js';
import { getAdminStats } from '../database/queries.js';

export function registerAdminHandlers(bot) {
  bot.command('stats', async (ctx) => {
    if (String(ctx.from.id) !== String(env.ADMIN_ID)) {
      await ctx.reply('Эта команда доступна только администратору.');
      return;
    }

    const stats = await getAdminStats();

    await ctx.reply(
      `Статистика бота:\n\nПользователей: ${stats.users}\nКачеств дня: ${stats.intentions}\nПрекрасных моментов: ${stats.moments}\nВечерних ответов: ${stats.checkins}`
    );
  });
}
