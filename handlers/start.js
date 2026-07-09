import { env } from '../config/env.js';
import { getOrCreateUser } from '../database/queries.js';
import { mainMenu, qualitiesKeyboard } from '../keyboards/main.js';

export function registerStartHandlers(bot) {
  bot.start(async (ctx) => {
    const user = await getOrCreateUser(ctx);

    await ctx.reply(
      `Привет, ${user.first_name}.\\n\\nЯ бот «Жизнь как искусство».\\n\\nЯ буду помогать тебе замечать жизнь, создавать маленькие красивые моменты и постепенно узнавать, что делает твои дни живыми.`,
      mainMenu()
    );

    await ctx.reply(
      'Начнём с простого.\\n\\nКакое качество ты хочешь добавить в сегодняшний день?',
      qualitiesKeyboard()
    );

    if (String(ctx.from.id) === String(env.ADMIN_ID)) {
      await ctx.reply('Наташа, бот запущен. Ты вошла как администратор проекта.');
    }
  });

  bot.command('ping', async (ctx) => {
    await ctx.reply('Бот живой 🌿');
  });
}
