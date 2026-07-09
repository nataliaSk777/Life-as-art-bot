import { Markup } from 'telegraf';

export const QUALITIES = [
  { label: '🌿 Спокойствие', value: 'Спокойствие' },
  { label: '✨ Красоту', value: 'Красоту' },
  { label: '❤️ Тепло', value: 'Тепло' },
  { label: '🎈 Лёгкость', value: 'Лёгкость' },
  { label: '🔥 Смелость', value: 'Смелость' },
  { label: '🌱 Внимание', value: 'Внимание' }
];

export const MOODS = [
  { label: '😊 Живо', value: 'Живо' },
  { label: '🙂 Нормально', value: 'Нормально' },
  { label: '😔 Грустно', value: 'Грустно' },
  { label: '😵 Устала', value: 'Устала' },
  { label: '🌫 Непонятно', value: 'Непонятно' }
];

export const HEAVY_STATES = [
  { label: 'Мне тревожно', value: 'тревожно' },
  { label: 'Мне одиноко', value: 'одиноко' },
  { label: 'Я устала', value: 'устала' },
  { label: 'Ничего не хочется', value: 'ничего не хочется' },
  { label: 'Я запуталась', value: 'запуталась' }
];

export const MENU_BUTTONS = [
  '🎨 Сегодня',
  '🌸 Сохранить прекрасное',
  '🌙 Вечерний вопрос',
  '💎 Мои открытия',
  '🆘 Если тяжело',
  '⚙️ Настройки'
];

export function mainMenu() {
  return Markup.keyboard([
    ['🎨 Сегодня', '🌸 Сохранить прекрасное'],
    ['🌙 Вечерний вопрос', '💎 Мои открытия'],
    ['🆘 Если тяжело', '⚙️ Настройки']
  ]).resize();
}

export function qualitiesKeyboard() {
  return Markup.inlineKeyboard(
    QUALITIES.map((quality) => [
      Markup.button.callback(quality.label, `quality:${quality.value}`)
    ])
  );
}

export function moodKeyboard(period) {
  return Markup.inlineKeyboard(
    MOODS.map((mood) => [
      Markup.button.callback(mood.label, `mood:${period}:${mood.value}`)
    ])
  );
}

export function heavyKeyboard() {
  return Markup.inlineKeyboard(
    HEAVY_STATES.map((state) => [
      Markup.button.callback(state.label, `heavy:${state.value}`)
    ])
  );
}

export function saveModeKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('🌸 Красивую деталь', 'save_mode:detail')],
    [Markup.button.callback('💭 Мысль', 'save_mode:thought')],
    [Markup.button.callback('🎵 Песню / звук', 'save_mode:sound')],
    [Markup.button.callback('🍓 Вкус / запах', 'save_mode:sense')],
    [Markup.button.callback('📌 Просто момент', 'save_mode:moment')]
  ]);
}
