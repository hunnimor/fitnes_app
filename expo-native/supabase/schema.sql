-- ============================================
-- ФитИИ — Supabase Database Schema
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- 1. PROFILES — extends auth.users with fitness data
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  email TEXT NOT NULL,
  goal TEXT DEFAULT 'general',          -- general, weight_loss, muscle_gain, endurance
  fitness_level TEXT DEFAULT 'beginner', -- beginner, intermediate, advanced
  equipment JSONB DEFAULT '[]',          -- ["dumbbells","barbell","pull_up_bar"]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. WORKOUT PLANS — user-created programs
CREATE TABLE IF NOT EXISTS workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT DEFAULT 'medium',      -- easy, medium, hard
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. WORKOUT SESSIONS — individual workout instances
CREATE TABLE IF NOT EXISTS workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES workout_plans(id) ON DELETE SET NULL,
  date DATE DEFAULT CURRENT_DATE,
  duration INT DEFAULT 0,                 -- seconds
  exercises_completed INT DEFAULT 0,
  calories_burned INT DEFAULT 0,
  avg_form_score NUMERIC(5,2) DEFAULT 0,  -- 0-100 from CV analysis
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EXERCISES — global catalog (seeded, read-only for users)
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  muscle_group TEXT,
  description TEXT,
  is_default BOOLEAN DEFAULT false
);

-- Seed default exercises
INSERT INTO exercises (name, muscle_group, description, is_default) VALUES
  ('Берпи', 'Всё тело', 'Бёрпи — упор присев, упор лёжа, отжимание, прыжок вверх', true),
  ('Приседания', 'Квадрицепс, Ягодицы', 'Глубокие приседания с прямой спиной', true),
  ('Отжимания', 'Грудь, Трицепс', 'Классические отжимания от пола', true),
  ('Скалолаз', 'Пресс, Кардио', 'Поочерёдное подтягивание колен к груди в планке', true),
  ('Планка', 'Кор', 'Статическое упражнение — упор на предплечьях', true),
  ('Выпады', 'Квадрицепс, Ягодицы', 'Поочерёдные выпады вперёд', true),
  ('Подтягивания', 'Спина, Бицепс', 'Подтягивания на перекладине', true),
  ('Прыжки на месте', 'Кардио', 'Прыжки с движением рук вверх-вниз', true)
ON CONFLICT DO NOTHING;

-- 5. WORKOUT EXERCISES — exercises within a session
CREATE TABLE IF NOT EXISTS workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  sets INT DEFAULT 1,
  reps INT DEFAULT 0,
  weight NUMERIC(6,2) DEFAULT 0,          -- kg (0 for bodyweight)
  best_form_score NUMERIC(5,2) DEFAULT 0  -- best CV score for this exercise
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see/edit their own
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Workout plans: user-scoped
CREATE POLICY "Users can view own workout plans"
  ON workout_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own workout plans"
  ON workout_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workout plans"
  ON workout_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workout plans"
  ON workout_plans FOR DELETE USING (auth.uid() = user_id);

-- Workout sessions: user-scoped
CREATE POLICY "Users can view own sessions"
  ON workout_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions"
  ON workout_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions"
  ON workout_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sessions"
  ON workout_sessions FOR DELETE USING (auth.uid() = user_id);

-- Exercises: globally readable, no writes
CREATE POLICY "Anyone can read exercises"
  ON exercises FOR SELECT USING (true);

-- Workout exercises: scoped through session ownership
CREATE POLICY "Users can view own workout exercises"
  ON workout_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = workout_exercises.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert own workout exercises"
  ON workout_exercises FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = workout_exercises.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can update own workout exercises"
  ON workout_exercises FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = workout_exercises.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can delete own workout exercises"
  ON workout_exercises FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = workout_exercises.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

-- ============================================
-- TRIGGER: auto-update profiles.updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
