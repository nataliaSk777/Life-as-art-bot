import {
  clearCurrentSaveMode,
  getOrCreateUser,
  saveBeautifulMoment,
  saveCheckin,
  setAwaitingEveningAnswer
} from '../database/queries.js';

import { mainMenu, MENU_BUTTONS } from '../keyboards/main.js';

export function registerTextHandler(bot) {
  bot.on('text', async (ctx) => {
    const user = await getOrCreateUser(ctx);
    const text = ctx.message.text.trim();

    if (MENU_BUTTONS.includes(text) || text.startsWith('/')) {
      return;
    }

    if (user.awaiting_evening_answer) {
      await saveCheckin(user.id, 'evening', null, text);
      await setAwaitingEveningAnswer(user.id, false);

      await ctx.reply(
        'Сохранил вечерний момент.\n\nЭто уже часть твоего личного архива жизни.',
        mainMenu()
      );

      return;
    }

    const type = user.current_save_mode || 'moment';

    await saveBeautifulMoment(user.id, type, text);
    await clearCurrentSaveMode(user.id);

    await ctx.reply(
      'Сохранил. Это уже часть твоей коллекции прекрасного.',
      mainMenu()
    );
  });
}
