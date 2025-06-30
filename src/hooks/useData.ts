import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TrendingNews, StartupIdea } from '../types';

export function useData() {
  const [news, setNews] = useState<TrendingNews[]>([]);
  const [ideas, setIdeas] = useState<StartupIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('trending_news')
        .select('*')
        .order('trend_score', { ascending: false });

      if (error) throw error;

      const formattedNews: TrendingNews[] = data?.map(item => ({
        id: item.id,
        title: item.title,
        source: item.source,
        url: item.url,
        category: item.category as TrendingNews['category'],
        publishedAt: item.published_at,
        summary: item.summary,
        trendScore: item.trend_score
      })) || [];

      setNews(formattedNews);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to fetch news');
    }
  };

  const fetchIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from('startup_ideas')
        .select('*')
        .order('generated_at', { ascending: false });

      if (error) throw error;

      const formattedIdeas: StartupIdea[] = data?.map(item => ({
        id: item.id,
        idea: item.idea,
        category: item.category,
        basedOn: item.based_on || [],
        confidence: item.confidence,
        marketSize: item.market_size as StartupIdea['marketSize'],
        difficulty: item.difficulty as StartupIdea['difficulty'],
        generatedAt: item.generated_at,
        saved: false // This would come from user preferences in a real app
      })) || [];

      setIdeas(formattedIdeas);
    } catch (err) {
      console.error('Error fetching ideas:', err);
      setError('Failed to fetch ideas');
    }
  };

  const scrapeNews = async (categories?: string[]) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scrape-news`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categories }),
      });

      if (!response.ok) {
        throw new Error('Failed to scrape news');
      }

      await fetchNews();
    } catch (err) {
      console.error('Error scraping news:', err);
      setError('Failed to scrape news');
    } finally {
      setLoading(false);
    }
  };

  const generateIdeas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-ideas`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate ideas');
      }

      await fetchIdeas();
    } catch (err) {
      console.error('Error generating ideas:', err);
      setError('Failed to generate ideas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchNews(), fetchIdeas()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    news,
    ideas,
    loading,
    error,
    scrapeNews,
    generateIdeas,
    refetch: () => Promise.all([fetchNews(), fetchIdeas()])
  };
}