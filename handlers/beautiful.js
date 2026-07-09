import {
  getOrCreateUser,
  setCurrentSaveMode
} from '../database/queries.js';

import { saveModeKeyboard } from '../keyboards/main.js';

export function registerBeautifulHandlers(bot) {
  bot.hears('🌸 Сохранить прекрасное', async (ctx) => {
    const user = await getOrCreateUser(ctx);

    await setCurrentSaveMode(user.id, 'moment');

    await ctx.reply(
      'Что именно хочешь сохранить?',
      saveModeKeyboard()
    );
  });

  bot.action(/^save_mode:(.+)$/, async (ctx) => {
    const user = await getOrCreateUser(ctx);
    const mode = ctx.match[1];

    await setCurrentSaveMode(user.id, mode);
    await ctx.answerCbQuery();

    await ctx.reply(
      'Напиши одним сообщением, что прекрасного ты хочешь сохранить сегодня.\n\nНапример: свет на стене, запах кофе, разговор, песня, прогулка, смешной момент.'
    );
  });
}
