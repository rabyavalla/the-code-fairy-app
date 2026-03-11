-- ═══════════════════════════════════════════════════════
-- The Code Fairy — Supabase Database Schema
-- ═══════════════════════════════════════════════════════
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- This creates all tables, Row Level Security policies,
-- and indexes needed for the app.
-- ═══════════════════════════════════════════════════════

-- ─── 1. PROFILES ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  birth_date DATE NOT NULL,
  birth_time_hour INTEGER CHECK (birth_time_hour >= 0 AND birth_time_hour <= 23),
  birth_time_minute INTEGER DEFAULT 0 CHECK (birth_time_minute >= 0 AND birth_time_minute <= 59),
  birth_time_period TEXT CHECK (birth_time_period IN ('AM', 'PM')),
  birth_city TEXT,
  birth_lat DOUBLE PRECISION,
  birth_lng DOUBLE PRECISION,
  notification_daily BOOLEAN DEFAULT true,
  notification_transits BOOLEAN DEFAULT true,
  notification_marketing BOOLEAN DEFAULT false,
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'expired', 'cancelled')),
  subscription_plan TEXT CHECK (subscription_plan IN ('monthly', 'annual')),
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ─── 2. BIRTH CHARTS (cached calculations) ─────────────
CREATE TABLE IF NOT EXISTS birth_charts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  system TEXT NOT NULL CHECK (system IN ('tropical', 'sidereal')),
  chart_data JSONB NOT NULL,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, system)
);

ALTER TABLE birth_charts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own charts" ON birth_charts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service can insert charts" ON birth_charts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service can update charts" ON birth_charts FOR UPDATE USING (auth.uid() = user_id);

-- ─── 3. DAILY READINGS ─────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reading_date DATE NOT NULL,
  sun_sign_tropical TEXT NOT NULL,
  sun_sign_sidereal TEXT NOT NULL,
  surface_reading TEXT NOT NULL,
  depths_reading TEXT NOT NULL,
  whole_story_reading TEXT NOT NULL,
  transits JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(reading_date, sun_sign_tropical, sun_sign_sidereal)
);

ALTER TABLE daily_readings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view daily readings" ON daily_readings FOR SELECT TO authenticated USING (true);

-- ─── 4. PLANET INTERPRETATIONS ──────────────────────────
CREATE TABLE IF NOT EXISTS planet_interpretations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  planet TEXT NOT NULL,
  sign TEXT NOT NULL,
  system TEXT NOT NULL CHECK (system IN ('tropical', 'sidereal', 'combined')),
  interpretation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(planet, sign, system)
);

ALTER TABLE planet_interpretations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view interpretations" ON planet_interpretations FOR SELECT TO authenticated USING (true);

-- ─── 5. HOUSE INTERPRETATIONS ───────────────────────────
CREATE TABLE IF NOT EXISTS house_interpretations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  house_number INTEGER NOT NULL CHECK (house_number >= 1 AND house_number <= 12),
  system TEXT NOT NULL CHECK (system IN ('tropical', 'sidereal', 'combined')),
  title TEXT NOT NULL,
  interpretation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(house_number, system)
);

ALTER TABLE house_interpretations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view house interpretations" ON house_interpretations FOR SELECT TO authenticated USING (true);

-- ─── 6. COURSES ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tag TEXT,
  cover_image_url TEXT,
  lesson_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view published courses" ON courses FOR SELECT TO authenticated USING (is_published = true);

-- ─── 7. COURSE LESSONS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view published lessons" ON course_lessons FOR SELECT TO authenticated USING (is_published = true);

-- ─── 8. USER COURSE PROGRESS ────────────────────────────
CREATE TABLE IF NOT EXISTS user_course_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON user_course_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_course_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── 9. INDEXES ─────────────────────────────────────────
CREATE INDEX idx_birth_charts_user ON birth_charts(user_id);
CREATE INDEX idx_daily_readings_date ON daily_readings(reading_date);
CREATE INDEX idx_planet_interp_lookup ON planet_interpretations(planet, sign, system);
CREATE INDEX idx_course_lessons_course ON course_lessons(course_id, sort_order);
CREATE INDEX idx_user_progress_user ON user_course_progress(user_id);

-- ─── 10. AUTO-UPDATE TIMESTAMPS ─────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER planet_interpretations_updated_at BEFORE UPDATE ON planet_interpretations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER house_interpretations_updated_at BEFORE UPDATE ON house_interpretations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER course_lessons_updated_at BEFORE UPDATE ON course_lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── 11. AUTO-CREATE PROFILE ON SIGNUP ──────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, trial_ends_at)
  VALUES (NEW.id, NEW.email, NOW() + INTERVAL '7 days');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
