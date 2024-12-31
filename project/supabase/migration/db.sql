/*
  # Initial Database Schema

  1. Tables
    - users: Store user accounts and profiles
    - challenges: Coding challenges
    - test_cases: Test cases for challenges
    - submissions: User challenge submissions
    - competitions: Coding competitions
    - competition_challenges: Junction table for competition-challenge relationship
    - competition_participants: Junction table for competition-participant relationship

  2. Security
    - Enable RLS on all tables
    - Add policies for data access
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  rank INTEGER DEFAULT 0,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  points INTEGER NOT NULL,
  category TEXT NOT NULL,
  sample_input TEXT NOT NULL,
  sample_output TEXT NOT NULL,
  time_limit INTEGER NOT NULL, -- in milliseconds
  memory_limit INTEGER NOT NULL, -- in MB
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Test cases table
CREATE TABLE IF NOT EXISTS test_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  input TEXT NOT NULL,
  expected_output TEXT NOT NULL,
  is_hidden BOOLEAN DEFAULT false
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  challenge_id UUID REFERENCES challenges(id),
  competition_id UUID REFERENCES competitions(id),
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  status TEXT NOT NULL,
  runtime FLOAT,
  memory FLOAT,
  score INTEGER NOT NULL,
  test_case_results JSONB NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competitions table
CREATE TABLE IF NOT EXISTS competitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL, -- in hours
  created_by UUID REFERENCES users(id),
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'active', 'ended')),
  max_participants INTEGER,
  prizes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competition challenges junction table
CREATE TABLE IF NOT EXISTS competition_challenges (
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  "order" INTEGER DEFAULT 0,
  PRIMARY KEY (competition_id, challenge_id)
);

-- Competition participants junction table
CREATE TABLE IF NOT EXISTS competition_participants (
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (competition_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Challenges policies
CREATE POLICY "Challenges are readable by all"
  ON challenges
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage challenges"
  ON challenges
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

-- Test cases policies
CREATE POLICY "Test cases are readable by all"
  ON test_cases
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage test cases"
  ON test_cases
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

-- Submissions policies
CREATE POLICY "Users can read their own submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create submissions"
  ON submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Competitions policies
CREATE POLICY "Competitions are readable by all"
  ON competitions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage competitions"
  ON competitions
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS challenges_category_idx ON challenges(category);
CREATE INDEX IF NOT EXISTS challenges_difficulty_idx ON challenges(difficulty);
CREATE INDEX IF NOT EXISTS submissions_user_id_idx ON submissions(user_id);
CREATE INDEX IF NOT EXISTS submissions_challenge_id_idx ON submissions(challenge_id);
CREATE INDEX IF NOT EXISTS competitions_status_idx ON competitions(status);

-- Create admin user (password: admin123)
INSERT INTO users (email, username, name, password, role)
VALUES (
  'admin@codearena.com',
  'admin',
  'Admin User',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2NchAQW5V2',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Create sample data
INSERT INTO challenges (title, description, difficulty, points, category, sample_input, sample_output, time_limit, memory_limit, created_by)
SELECT
  'Two Sum',
  'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  'easy',
  100,
  'arrays',
  '[2,7,11,15]\n9',
  '[0,1]',
  1000,
  128,
  (SELECT id FROM users WHERE username = 'admin')
WHERE NOT EXISTS (SELECT 1 FROM challenges WHERE title = 'Two Sum');