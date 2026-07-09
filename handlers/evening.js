import {
  getOrCreateUser,
  saveCheckin,
  setAwaitingEveningAnswer
} from '../database/queries.js';

export function registerEveningHandlers(bot) {
  bot.hears('🌙 Вечерний вопрос', async (ctx) => {
    const user = await getOrCreateUser(ctx);

    await setAwaitingEveningAnswer(user.id, true);

    await ctx.reply(
      'Какой момент сегодняшнего дня захотелось бы прожить ещё раз?\n\nНапиши одним сообщением.'
    );
  });

  bot.action(/^mood:(.+):(.+)$/, async (ctx) => {
    const user = await getOrCreateUser(ctx);
    const period = ctx.match[1];
    const mood = ctx.match[2];

    await saveCheckin(user.id, period, mood);
    await ctx.answerCbQuery();

    await ctx.reply(`Сохранил: ${mood}. Спасибо, что отметила своё состояние.`);
  });
}
