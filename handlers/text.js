import {
  claimFeedbackPrompt,
  clearCurrentSaveMode,
  finishFeedbackInput,
  getOrCreateUser,
  saveBeautifulMoment,
  saveCheckin,
  saveFeedback,
  setAwaitingEveningAnswer
} from '../database/queries.js';

import {
  feedbackReactionKeyboard,
  mainMenu,
  MENU_BUTTONS
} from '../keyboards/main.js';

export function registerTextHandler(bot) {
  bot.on('text', async (ctx) => {
    try {
      const user =
        await getOrCreateUser(ctx);

      const text =
        ctx.message.text.trim();

      /*
        Кнопки главного меню и команды
        обрабатываются другими обработчиками.
      */
      if (
        MENU_BUTTONS.includes(text) ||
        text.startsWith('/')
      ) {
        return;
      }

      /*
        Если бот ждёт свободный отзыв,
        сохраняем текст как обратную связь.
      */
      if (user.awaiting_feedback) {
        await saveFeedback({
          userId: user.id,
          feedbackType: 'free_text',
          context:
            user.feedback_context ||
            'general_feedback',
          messageText: text
        });

        await finishFeedbackInput(
          user.id
        );

        await ctx.reply(
          'Спасибо. Я сохранил твою мысль — такие ответы действительно помогают делать бота лучше 🌿',
          mainMenu()
        );

        return;
      }

      /*
        Если бот ждёт ответ
        на вечерний вопрос.
      */
      if (
        user.awaiting_evening_answer
      ) {
        await saveCheckin(
          user.id,
          'evening',
          null,
          text
        );

        await setAwaitingEveningAnswer(
          user.id,
          false
        );

        await ctx.reply(
          'Сохранил вечерний момент.\n\nЭто уже часть твоего личного архива жизни.',
          mainMenu()
        );

        /*
          Просим обратную связь:
          не раньше третьего дня
          и не чаще одного раза в неделю.
        */
        const shouldAsk =
          await claimFeedbackPrompt(
            user.id,
            7
          );

        if (shouldAsk) {
          await ctx.reply(
            'Можно один маленький вопрос?\n\nКак тебе бот в последние дни?',
            feedbackReactionKeyboard(
              'weekly_experience'
            )
          );
        }

        return;
      }

      /*
        В остальных случаях сохраняем
        текст как прекрасный момент.
      */
      const type =
        user.current_save_mode ||
        'moment';

      await saveBeautifulMoment(
        user.id,
        type,
        text
      );

      await clearCurrentSaveMode(
        user.id
      );

      await ctx.reply(
        'Сохранил. Это уже часть твоей коллекции прекрасного.',
        mainMenu()
      );
    } catch (error) {
      console.error(
        'Ошибка обработки текста:',
        error
      );

      await ctx.reply(
        'Не получилось сохранить сообщение. Попробуй отправить его ещё раз.'
      );
    }
  });
}
