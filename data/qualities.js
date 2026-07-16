export const QUALITIES = [
  {
    value: 'Спокойствие',
    label: '🌿 Спокойствие',
    emoji: '🌿',
    title: 'спокойствие',
    invitation:
      'Сегодня я предлагаю добавить в день немного спокойствия. Не нужно ничего решать — просто иногда возвращайся к нему в течение дня.',
    action:
      'Поставь обе стопы на пол, сделай медленный выдох и на 20 секунд перестань торопиться.'
  },
  {
    value: 'Красота',
    aliases: ['Красоту'],
    label: '✨ Красота',
    emoji: '✨',
    title: 'красота',
    invitation:
      'Сегодня я предлагаю замечать красоту — в свете, звуках, людях, вещах и маленьких деталях.',
    action:
      'Найди вокруг одну красивую деталь: свет, цвет, линию, звук, жест или предмет. Просто заметь её.'
  },
  {
    value: 'Тепло',
    label: '❤️ Тепло',
    emoji: '❤️',
    title: 'тепло',
    invitation:
      'Сегодня я предлагаю добавить в день немного тепла — к себе, к людям и к тому, чем ты занимаешься.',
    action:
      'Скажи кому-то одну добрую фразу. Или скажи её себе.'
  },
  {
    value: 'Лёгкость',
    label: '🎈 Лёгкость',
    emoji: '🎈',
    title: 'лёгкость',
    invitation:
      'Сегодня я предлагаю оставить немного места для лёгкости. Не всё обязательно делать с усилием.',
    action:
      'Убери одну лишнюю вещь с поверхности рядом. Не весь дом — только одну вещь.'
  },
  {
    value: 'Смелость',
    label: '🔥 Смелость',
    emoji: '🔥',
    title: 'смелость',
    invitation:
      'Сегодня я предлагаю добавить немного смелости — возможно, в одном совсем небольшом действии.',
    action:
      'Сделай один маленький шаг, который давно откладывала. Совсем маленький.'
  },
  {
    value: 'Внимание',
    label: '🌱 Внимание',
    emoji: '🌱',
    title: 'внимание',
    invitation:
      'Сегодня я предлагаю быть чуть внимательнее к себе, людям и тому, что происходит вокруг.',
    action:
      'Посмотри на то, что делаешь сейчас, так, будто это важная сцена твоего дня.'
  }
];

export function getQualityByValue(value) {
  return (
    QUALITIES.find(
      (quality) =>
        quality.value === value ||
        quality.aliases?.includes(value)
    ) || null
  );
}

export function getRandomQuality(excludedValue = null) {
  const availableQualities = QUALITIES.filter(
    (quality) =>
      quality.value !== excludedValue &&
      !quality.aliases?.includes(excludedValue)
  );

  const randomIndex = Math.floor(
    Math.random() * availableQualities.length
  );

  return availableQualities[randomIndex];
}
