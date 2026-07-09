import { getOrCreateUser } from '../database/queries.js';

export function registerSettingsHandlers(bot) {
  bot.hears('⚙️ Настройки', async (ctx) => {
    const user = await getOrCreateUser(ctx);

    await ctx.reply(
      `Текущие настройки сообщений по Москве:\n\nУтро: ${user.morning_time}\nДень: ${user.day_time}\nВечер: ${user.evening_time}\n\nВ первой версии время уже задано. Позже добавим изменение кнопками.`
    );
  });
}
