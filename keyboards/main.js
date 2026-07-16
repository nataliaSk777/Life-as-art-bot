import { Markup } from 'telegraf';

export const MOODS = [
  {
    label: '😊 Живо',
    value: 'Живо'
  },
  {
    label: '🙂 Нормально',
    value: 'Нормально'
  },
  {
    label: '😔 Грустно',
    value: 'Грустно'
  },
  {
    label: '😵 Устала',
    value: 'Устала'
  },
  {
    label: '🌫 Непонятно',
    value: 'Непонятно'
  }
];

export const HEAVY_STATES = [
  {
    label: 'Мне тревожно',
    value: 'тревожно'
  },
  {
    label: 'Мне одиноко',
    value: 'одиноко'
  },
  {
    label: 'Я устала',
    value: 'устала'
  },
  {
    label: 'Ничего не хочется',
    value: 'ничего не хочется'
  },
  {
    label: 'Я запуталась',
    value: 'запуталась'
  }
];

export const MENU_BUTTONS = [
  '🎨 Сегодня',
  '🌸 Сохранить прекрасное',
  '🌙 Вечерний вопрос',
  '💎 Мои открытия',
  '🆘 Если тяжело',
  '💭 Поделиться мыслью',
  '⚙️ Настройки'
];

export function mainMenu() {
  return Markup.keyboard([
    [
      '🎨 Сегодня',
      '🌸 Сохранить прекрасное'
    ],
    [
      '🌙 Вечерний вопрос',
      '💎 Мои открытия'
    ],
    [
      '🆘 Если тяжело',
      '💭 Поделиться мыслью'
    ],
    [
      '⚙️ Настройки'
    ]
  ]).resize();
}

export function dailyQualityKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        'Подходит 🌿',
        'accept_daily_quality'
      ),
      Markup.button.callback(
        'Предложить другое',
        'replace_daily_quality'
      )
    ]
  ]);
}

export function moodKeyboard(period) {
  return Markup.inlineKeyboard(
    MOODS.map((mood) => [
      Markup.button.callback(
        mood.label,
        `mood:${period}:${mood.value}`
      )
    ])
  );
}

export function heavyKeyboard() {
  return Markup.inlineKeyboard(
    HEAVY_STATES.map((state) => [
      Markup.button.callback(
        state.label,
        `heavy:${state.value}`
      )
    ])
  );
}

export function saveModeKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        '🌸 Красивую деталь',
        'save_mode:detail'
      )
    ],
    [
      Markup.button.callback(
        '💭 Мысль',
        'save_mode:thought'
      )
    ],
    [
      Markup.button.callback(
        '🎵 Песню / звук',
        'save_mode:sound'
      )
    ],
    [
      Markup.button.callback(
        '🍓 Вкус / запах',
        'save_mode:sense'
      )
    ],
    [
      Markup.button.callback(
        '📌 Просто момент',
        'save_mode:moment'
      )
    ]
  ]);
}

export function feedbackReactionKeyboard(
  context
) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        'Откликается ❤️',
        `feedback:useful:${context}`
      ),
      Markup.button.callback(
        'Не очень',
        `feedback:not_useful:${context}`
      )
    ]
  ]);
}

export function feedbackReasonKeyboard(
  context
) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        'Слишком много',
        `feedback_reason:too_much:${context}`
      ),
      Markup.button.callback(
        'Не вовремя',
        `feedback_reason:wrong_time:${context}`
      )
    ],
    [
      Markup.button.callback(
        'Неинтересно',
        `feedback_reason:not_interesting:${context}`
      ),
      Markup.button.callback(
        'Другое',
        `feedback_reason:other:${context}`
      )
    ]
  ]);
}
