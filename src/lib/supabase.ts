import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      trending_news: {
        Row: {
          id: string;
          title: string;
          source: string;
          url: string;
          category: string;
          published_at: string;
          summary: string;
          trend_score: number;
          scraped_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          source: string;
          url: string;
          category: string;
          published_at: string;
          summary: string;
          trend_score?: number;
          scraped_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          source?: string;
          url?: string;
          category?: string;
          published_at?: string;
          summary?: string;
          trend_score?: number;
          scraped_at?: string;
          created_at?: string;
        };
      };
      startup_ideas: {
        Row: {
          id: string;
          idea: string;
          category: string;
          based_on: string[];
          confidence: number;
          market_size: string;
          difficulty: string;
          generated_at: string;
          news_ids: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          idea: string;
          category: string;
          based_on?: string[];
          confidence?: number;
          market_size?: string;
          difficulty?: string;
          generated_at?: string;
          news_ids?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          idea?: string;
          category?: string;
          based_on?: string[];
          confidence?: number;
          market_size?: string;
          difficulty?: string;
          generated_at?: string;
          news_ids?: string[];
          created_at?: string;
        };
      };
    };
  };
};