const required = ['BOT_TOKEN', 'DATABASE_URL'];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`Ошибка: не задана переменная ${key}.`);
    process.exit(1);
  }
}

export const env = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  DATABASE_URL: process.env.DATABASE_URL,
  ADMIN_ID: process.env.ADMIN_ID || '481877773',
  DEFAULT_TIMEZONE: 'Europe/Moscow'
};
