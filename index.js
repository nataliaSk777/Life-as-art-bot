import 'dotenv/config';
import { Telegraf } from 'telegraf';

import { env } from './config/env.js';
import { initDb } from './database/init.js';
import { startScheduler } from './services/scheduler.js';

import { registerStartHandlers } from './handlers/start.js';
import { registerTodayHandlers } from './handlers/today.js';
import { registerQualityHandlers } from './handlers/qualities.js';
import { registerBeautifulHandlers } from './handlers/beautiful.js';
import { registerEveningHandlers } from './handlers/evening.js';
import { registerDiscoveryHandlers } from './handlers/discoveries.js';
import { registerSupportHandlers } from './handlers/support.js';
import { registerSettingsHandlers } from './handlers/settings.js';
import { registerFeedbackHandlers } from './handlers/feedback.js';
import { registerAdminHandlers } from './handlers/admin.js';
import { registerTextHandler } from './handlers/text.js';

const bot = new Telegraf(env.BOT_TOKEN);

registerStartHandlers(bot);
registerTodayHandlers(bot);
registerQualityHandlers(bot);
registerBeautifulHandlers(bot);
registerEveningHandlers(bot);
registerDiscoveryHandlers(bot);
registerSupportHandlers(bot);
registerSettingsHandlers(bot);
registerFeedbackHandlers(bot);
registerAdminHandlers(bot);

/*
  Общий обработчик текста обязательно подключается последним,
  чтобы сначала срабатывали кнопки и команды.
*/
registerTextHandler(bot);

bot.catch((error, ctx) => {
  console.error(
    'Ошибка в обработчике бота:',
    error
  );

  if (ctx) {
    ctx.reply(
      'Что-то пошло не так. Попробуй ещё раз через минуту.'
    ).catch(() => {});
  }
});

async function bootstrap() {
  await initDb();

  await bot.launch({
    dropPendingUpdates: true
  });

  startScheduler(bot);

  console.log(
    'Бот «Жизнь как искусство» запущен.'
  );
}

bootstrap().catch((error) => {
  console.error(
    'Критическая ошибка запуска:',
    error
  );

  process.exit(1);
});

process.once(
  'SIGINT',
  () => bot.stop('SIGINT')
);

process.once(
  'SIGTERM',
  () => bot.stop('SIGTERM')
);
