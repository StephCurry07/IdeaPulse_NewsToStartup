/*
  # Create news and startup ideas tables

  1. New Tables
    - `trending_news`
      - `id` (uuid, primary key)
      - `title` (text)
      - `source` (text)
      - `url` (text)
      - `category` (text)
      - `published_at` (timestamptz)
      - `summary` (text)
      - `trend_score` (integer)
      - `scraped_at` (timestamptz)
      - `created_at` (timestamptz)
    
    - `startup_ideas`
      - `id` (uuid, primary key)
      - `idea` (text)
      - `category` (text)
      - `based_on` (text array)
      - `confidence` (integer)
      - `market_size` (text)
      - `difficulty` (text)
      - `generated_at` (timestamptz)
      - `news_ids` (uuid array)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
*/

CREATE TABLE IF NOT EXISTS trending_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  source text NOT NULL,
  url text NOT NULL,
  category text NOT NULL,
  published_at timestamptz NOT NULL,
  summary text NOT NULL,
  trend_score integer DEFAULT 0,
  scraped_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS startup_ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea text NOT NULL,
  category text NOT NULL,
  based_on text[] DEFAULT '{}',
  confidence integer DEFAULT 0,
  market_size text DEFAULT 'Medium',
  difficulty text DEFAULT 'Medium',
  generated_at timestamptz DEFAULT now(),
  news_ids uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE trending_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_ideas ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to trending_news"
  ON trending_news
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to startup_ideas"
  ON startup_ideas
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trending_news_category ON trending_news(category);
CREATE INDEX IF NOT EXISTS idx_trending_news_published_at ON trending_news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_startup_ideas_generated_at ON startup_ideas(generated_at DESC);
CREATE INDEX IF NOT EXISTS idx_startup_ideas_category ON startup_ideas(category);