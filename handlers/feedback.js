import {
  finishFeedbackInput,
  getOrCreateUser,
  saveFeedback,
  startFeedbackInput
} from '../database/queries.js';

import {
  feedbackReasonKeyboard,
  mainMenu
} from '../keyboards/main.js';

const ALLOWED_REACTIONS = new Set([
  'useful',
  'not_useful'
]);

const ALLOWED_REASONS = new Set([
  'too_much',
  'wrong_time',
  'not_interesting',
  'other'
]);

export function registerFeedbackHandlers(bot) {
  bot.hears(
    '💭 Поделиться мыслью',
    async (ctx) => {
      try {
        const user = await getOrCreateUser(ctx);

        await startFeedbackInput(
          user.id,
          'general_suggestion'
        );

        await ctx.reply(
          'Что тебе нравится, мешает или чего не хватает в боте?\n\nНапиши так, как чувствуешь. Можно одним предложением.\n\nЧтобы отменить, отправь команду /cancel.'
        );
      } catch (error) {
        console.error(
          'Ошибка начала обратной связи:',
          error
        );

        await ctx.reply(
          'Не получилось открыть форму обратной связи. Попробуй ещё раз.'
        );
      }
    }
  );

  bot.action(
    /^feedback:(useful|not_useful):([a-z0-9_-]+)$/,
    async (ctx) => {
      try {
        const reaction = ctx.match[1];
        const context = ctx.match[2];

        if (!ALLOWED_REACTIONS.has(reaction)) {
          await ctx.answerCbQuery(
            'Не удалось распознать ответ.'
          );
          return;
        }

        const user = await getOrCreateUser(ctx);

        await saveFeedback({
          userId: user.id,
          feedbackType: 'reaction',
          context,
          value: reaction
        });

        if (reaction === 'useful') {
          await ctx.answerCbQuery('Спасибо ❤️');

          await ctx.editMessageReplyMarkup({
            inline_keyboard: []
          });

          return;
        }

        await ctx.answerCbQuery(
          'Спасибо за честность'
        );

        await ctx.editMessageReplyMarkup({
          inline_keyboard: []
        });

        await ctx.reply(
          'Что именно не подошло?',
          feedbackReasonKeyboard(context)
        );
      } catch (error) {
        console.error(
          'Ошибка сохранения реакции:',
          error
        );

        await ctx.answerCbQuery(
          'Не получилось сохранить ответ.'
        );
      }
    }
  );

  bot.action(
    /^feedback_reason:(too_much|wrong_time|not_interesting|other):([a-z0-9_-]+)$/,
    async (ctx) => {
      try {
        const reason = ctx.match[1];
        const context = ctx.match[2];

        if (!ALLOWED_REASONS.has(reason)) {
          await ctx.answerCbQuery(
            'Не удалось распознать ответ.'
          );
          return;
        }

        const user = await getOrCreateUser(ctx);

        await saveFeedback({
          userId: user.id,
          feedbackType: 'negative_reason',
          context,
          value: reason
        });

        await ctx.answerCbQuery('Спасибо');

        await ctx.editMessageReplyMarkup({
          inline_keyboard: []
        });

        if (reason === 'other') {
          await startFeedbackInput(
            user.id,
            `negative_${context}`
          );

          await ctx.reply(
            'Напиши, пожалуйста, своими словами. Можно совсем коротко.\n\nЧтобы отменить, отправь команду /cancel.'
          );

          return;
        }

        await ctx.reply(
          'Спасибо, что сказала честно. Я учту это при развитии бота 🌿',
          mainMenu()
        );
      } catch (error) {
        console.error(
          'Ошибка сохранения причины обратной связи:',
          error
        );

        await ctx.answerCbQuery(
          'Не получилось сохранить ответ.'
        );
      }
    }
  );

  bot.command('cancel', async (ctx) => {
    try {
      const user = await getOrCreateUser(ctx);

      if (!user.awaiting_feedback) {
        await ctx.reply(
          'Сейчас нет незавершённого отзыва.',
          mainMenu()
        );

        return;
      }

      await finishFeedbackInput(user.id);

      await ctx.reply(
        'Хорошо, не будем продолжать.',
        mainMenu()
      );
    } catch (error) {
      console.error(
        'Ошибка отмены обратной связи:',
        error
      );

      await ctx.reply(
        'Не получилось отменить действие. Попробуй ещё раз.'
      );
    }
  });
}
