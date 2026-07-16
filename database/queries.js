import { pool } from '../config/database.js';

export async function getOrCreateUser(ctx) {
  const telegramId = ctx.from.id;
  const firstName =
    ctx.from.first_name || 'друг';
  const username =
    ctx.from.username || null;

  const result = await pool.query(
    `
    INSERT INTO users (
      telegram_id,
      first_name,
      username
    )
    VALUES ($1, $2, $3)
    ON CONFLICT (telegram_id)
    DO UPDATE SET
      first_name = EXCLUDED.first_name,
      username = EXCLUDED.username,
      updated_at = NOW()
    RETURNING *;
    `,
    [
      telegramId,
      firstName,
      username
    ]
  );

  return result.rows[0];
}

export async function getUserByTelegramId(
  telegramId
) {
  const result = await pool.query(
    `
    SELECT *
    FROM users
    WHERE telegram_id = $1;
    `,
    [telegramId]
  );

  return result.rows[0] || null;
}

export async function getAllUsersForScheduler(
  currentTime
) {
  const result = await pool.query(
    `
    SELECT *
    FROM users
    WHERE telegram_id IS NOT NULL
      AND (
        morning_time = $1
        OR day_time = $1
        OR evening_time = $1
      );
    `,
    [currentTime]
  );

  return result.rows;
}

export async function setTodayQuality(
  userId,
  quality
) {
  await pool.query(
    `
    INSERT INTO daily_intentions (
      user_id,
      date,
      chosen_quality
    )
    VALUES ($1, CURRENT_DATE, $2)
    ON CONFLICT (user_id, date)
    DO UPDATE SET
      chosen_quality = EXCLUDED.chosen_quality;
    `,
    [
      userId,
      quality
    ]
  );
}

export async function getTodayQuality(
  userId
) {
  const result = await pool.query(
    `
    SELECT chosen_quality
    FROM daily_intentions
    WHERE user_id = $1
      AND date = CURRENT_DATE
    LIMIT 1;
    `,
    [userId]
  );

  return (
    result.rows[0]?.chosen_quality ||
    null
  );
}

export async function saveCheckin(
  userId,
  period,
  mood,
  text = null
) {
  await pool.query(
    `
    INSERT INTO checkins (
      user_id,
      date,
      period,
      mood,
      text
    )
    VALUES (
      $1,
      CURRENT_DATE,
      $2,
      $3,
      $4
    );
    `,
    [
      userId,
      period,
      mood,
      text
    ]
  );
}

export async function saveBeautifulMoment(
  userId,
  type,
  text
) {
  await pool.query(
    `
    INSERT INTO beautiful_moments (
      user_id,
      date,
      type,
      text
    )
    VALUES (
      $1,
      CURRENT_DATE,
      $2,
      $3
    );
    `,
    [
      userId,
      type,
      text
    ]
  );
}

export async function setCurrentSaveMode(
  userId,
  mode
) {
  await pool.query(
    `
    UPDATE users
    SET
      current_save_mode = $1,
      updated_at = NOW()
    WHERE id = $2;
    `,
    [
      mode,
      userId
    ]
  );
}

export async function clearCurrentSaveMode(
  userId
) {
  await pool.query(
    `
    UPDATE users
    SET
      current_save_mode = NULL,
      updated_at = NOW()
    WHERE id = $1;
    `,
    [userId]
  );
}

export async function setAwaitingEveningAnswer(
  userId,
  value
) {
  await pool.query(
    `
    UPDATE users
    SET
      awaiting_evening_answer = $1,
      updated_at = NOW()
    WHERE id = $2;
    `,
    [
      value,
      userId
    ]
  );
}

export async function startFeedbackInput(
  userId,
  context
) {
  await pool.query(
    `
    UPDATE users
    SET
      awaiting_feedback = true,
      feedback_context = $2,
      updated_at = NOW()
    WHERE id = $1;
    `,
    [
      userId,
      context
    ]
  );
}

export async function finishFeedbackInput(
  userId
) {
  await pool.query(
    `
    UPDATE users
    SET
      awaiting_feedback = false,
      feedback_context = NULL,
      updated_at = NOW()
    WHERE id = $1;
    `,
    [userId]
  );
}

export async function saveFeedback({
  userId,
  feedbackType,
  context = null,
  value = null,
  messageText = null
}) {
  const result = await pool.query(
    `
    INSERT INTO feedback (
      user_id,
      feedback_type,
      context,
      value,
      message_text
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5
    )
    RETURNING *;
    `,
    [
      userId,
      feedbackType,
      context,
      value,
      messageText
    ]
  );

  return result.rows[0];
}

export async function claimFeedbackPrompt(
  userId,
  minimumDaysBetween = 7
) {
  const result = await pool.query(
    `
    UPDATE users
    SET
      last_feedback_prompt_at = NOW(),
      updated_at = NOW()
    WHERE id = $1
      AND created_at <=
        NOW() - INTERVAL '3 days'
      AND (
        last_feedback_prompt_at IS NULL
        OR last_feedback_prompt_at <=
          NOW() - ($2 * INTERVAL '1 day')
      )
    RETURNING id;
    `,
    [
      userId,
      minimumDaysBetween
    ]
  );

  return result.rows.length > 0;
}

export async function getLatestFeedback(
  limit = 20
) {
  const numericLimit =
    Number(limit) || 20;

  const safeLimit = Math.min(
    Math.max(numericLimit, 1),
    100
  );

  const result = await pool.query(
    `
    SELECT
      feedback.id,
      feedback.feedback_type,
      feedback.context,
      feedback.value,
      feedback.message_text,
      feedback.created_at,
      users.first_name,
      users.username
    FROM feedback
    JOIN users
      ON users.id = feedback.user_id
    ORDER BY feedback.created_at DESC
    LIMIT $1;
    `,
    [safeLimit]
  );

  return result.rows;
}

export async function wasDelivered(
  userId,
  period
) {
  const result = await pool.query(
    `
    SELECT id
    FROM deliveries
    WHERE user_id = $1
      AND date = CURRENT_DATE
      AND period = $2
    LIMIT 1;
    `,
    [
      userId,
      period
    ]
  );

  return result.rows.length > 0;
}

export async function markDelivered(
  userId,
  period
) {
  await pool.query(
    `
    INSERT INTO deliveries (
      user_id,
      date,
      period
    )
    VALUES (
      $1,
      CURRENT_DATE,
      $2
    )
    ON CONFLICT (
      user_id,
      date,
      period
    )
    DO NOTHING;
    `,
    [
      userId,
      period
    ]
  );
}

export async function getTopQualities(
  userId,
  limit = 3
) {
  const result = await pool.query(
    `
    SELECT
      chosen_quality,
      COUNT(*)::int AS count
    FROM daily_intentions
    WHERE user_id = $1
    GROUP BY chosen_quality
    ORDER BY count DESC
    LIMIT $2;
    `,
    [
      userId,
      limit
    ]
  );

  return result.rows;
}

export async function getLatestBeautifulMoments(
  userId,
  limit = 3
) {
  const result = await pool.query(
    `
    SELECT
      text,
      type,
      created_at
    FROM beautiful_moments
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2;
    `,
    [
      userId,
      limit
    ]
  );

  return result.rows;
}

export async function getAdminStats() {
  const [
    users,
    intentions,
    moments,
    checkins,
    feedback
  ] = await Promise.all([
    pool.query(
      'SELECT COUNT(*)::int AS count FROM users;'
    ),
    pool.query(
      'SELECT COUNT(*)::int AS count FROM daily_intentions;'
    ),
    pool.query(
      'SELECT COUNT(*)::int AS count FROM beautiful_moments;'
    ),
    pool.query(
      'SELECT COUNT(*)::int AS count FROM checkins;'
    ),
    pool.query(
      'SELECT COUNT(*)::int AS count FROM feedback;'
    )
  ]);

  return {
    users: users.rows[0].count,
    intentions:
      intentions.rows[0].count,
    moments:
      moments.rows[0].count,
    checkins:
      checkins.rows[0].count,
    feedback:
      feedback.rows[0].count
  };
}
