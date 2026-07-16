import { env } from '../config/env.js';

import {
  getAdminStats,
  getLatestFeedback
} from '../database/queries.js';

function isAdmin(ctx) {
  return (
    String(ctx.from.id) ===
    String(env.ADMIN_ID)
  );
}

function splitText(
  text,
  maxLength = 3900
) {
  const chunks = [];
  let remaining = text;

  while (
    remaining.length > maxLength
  ) {
    let splitIndex =
      remaining.lastIndexOf(
        '\n\n',
        maxLength
      );

    if (splitIndex <= 0) {
      splitIndex = maxLength;
    }

    chunks.push(
      remaining.slice(
        0,
        splitIndex
      )
    );

    remaining = remaining
      .slice(splitIndex)
      .trimStart();
  }

  if (remaining) {
    chunks.push(remaining);
  }

  return chunks;
}

function feedbackValue(item) {
  if (item.message_text) {
    return item.message_text;
  }

  const values = {
    useful: 'Откликается',
    not_useful: 'Не очень',
    too_much: 'Слишком много',
    wrong_time: 'Не вовремя',
    not_interesting:
      'Неинтересно',
    other: 'Другое'
  };

  return (
    values[item.value] ||
    item.value ||
    'Без текста'
  );
}

export function registerAdminHandlers(
  bot
) {
  bot.command(
    'stats',
    async (ctx) => {
      try {
        if (!isAdmin(ctx)) {
          await ctx.reply(
            'Эта команда доступна только администратору.'
          );

          return;
        }

        const stats =
          await getAdminStats();

        await ctx.reply(
          `Статистика бота:\n\nПользователей: ${stats.users}\nКачеств дня: ${stats.intentions}\nПрекрасных моментов: ${stats.moments}\nВечерних ответов: ${stats.checkins}\nОтветов обратной связи: ${stats.feedback}`
        );
      } catch (error) {
        console.error(
          'Ошибка получения статистики:',
          error
        );

        await ctx.reply(
          'Не получилось загрузить статистику.'
        );
      }
    }
  );

  bot.command(
    'feedback',
    async (ctx) => {
      try {
        if (!isAdmin(ctx)) {
          await ctx.reply(
            'Эта команда доступна только администратору.'
          );

          return;
        }

        const items =
          await getLatestFeedback(20);

        if (items.length === 0) {
          await ctx.reply(
            'Пока обратной связи нет.'
          );

          return;
        }

        const text = items
          .map((item, index) => {
            const author =
              item.username
                ? `@${item.username}`
                : item.first_name ||
                  'Пользователь';

            const date = new Date(
              item.created_at
            ).toLocaleString(
              'ru-RU',
              {
                timeZone:
                  'Europe/Moscow'
              }
            );

            return [
              `${index + 1}. ${author}`,
              `Тип: ${item.feedback_type}`,
              `Контекст: ${
                item.context ||
                'не указан'
              }`,
              `Ответ: ${feedbackValue(
                item
              )}`,
              `Дата: ${date}`
            ].join('\n');
          })
          .join('\n\n');

        const chunks =
          splitText(text);

        for (const chunk of chunks) {
          await ctx.reply(chunk);
        }
      } catch (error) {
        console.error(
          'Ошибка получения обратной связи:',
          error
        );

        await ctx.reply(
          'Не получилось загрузить обратную связь.'
        );
      }
    }
  );
}
