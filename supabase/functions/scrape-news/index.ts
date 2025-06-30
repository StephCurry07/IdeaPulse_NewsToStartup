import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface NewsArticle {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  description: string;
}

interface ProcessedNews {
  title: string;
  source: string;
  url: string;
  category: string;
  published_at: string;
  summary: string;
  trend_score: number;
}

const TECH_KEYWORDS = {
  'AI': ['artificial intelligence', 'machine learning', 'neural network', 'openai', 'chatgpt', 'llm', 'deep learning'],
  'Fintech': ['fintech', 'payment', 'banking', 'financial', 'cryptocurrency', 'blockchain', 'digital wallet'],
  'Health': ['health tech', 'medical', 'healthcare', 'telemedicine', 'biotech', 'pharmaceutical', 'wellness'],
  'Climate': ['climate tech', 'carbon', 'renewable energy', 'sustainability', 'green tech', 'solar', 'wind energy'],
  'Crypto': ['bitcoin', 'ethereum', 'defi', 'nft', 'cryptocurrency', 'blockchain', 'web3'],
  'SaaS': ['saas', 'software', 'cloud', 'enterprise', 'productivity', 'collaboration', 'automation'],
  'Hardware': ['hardware', 'semiconductor', 'chip', 'quantum', 'robotics', 'iot', 'device']
};

function categorizeNews(title: string, description: string): string {
  const text = (title + ' ' + description).toLowerCase();
  
  for (const [category, keywords] of Object.entries(TECH_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }
  
  return 'SaaS'; // Default category
}

function calculateTrendScore(title: string, description: string, publishedAt: string): number {
  const text = (title + ' ' + description).toLowerCase();
  const hoursAgo = (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60);
  
  let score = 50; // Base score
  
  // Recency bonus (newer = higher score)
  if (hoursAgo < 6) score += 30;
  else if (hoursAgo < 24) score += 20;
  else if (hoursAgo < 48) score += 10;
  
  // Trending keywords bonus
  const trendingWords = ['breakthrough', 'revolutionary', 'funding', 'raises', 'launches', 'announces', 'billion', 'million'];
  trendingWords.forEach(word => {
    if (text.includes(word)) score += 5;
  });
  
  return Math.min(100, Math.max(0, score));
}

async function fetchNewsFromAPI(): Promise<NewsArticle[]> {
  try {
    // Using NewsAPI.org for tech news
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=startup OR "artificial intelligence" OR fintech OR "climate tech" OR blockchain&language=en&sortBy=publishedAt&pageSize=50&apiKey=${Deno.env.get('NEWS_API_KEY')}`
    );
    
    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.articles?.map((article: any) => ({
      title: article.title,
      source: article.source?.name || 'Unknown',
      url: article.url,
      publishedAt: article.publishedAt,
      description: article.description || ''
    })) || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch latest news
    const articles = await fetchNewsFromAPI();
    
    if (articles.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No articles found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process and categorize news
    const processedNews: ProcessedNews[] = articles
      .filter(article => article.title && article.description)
      .map(article => ({
        title: article.title,
        source: article.source,
        url: article.url,
        category: categorizeNews(article.title, article.description),
        published_at: article.publishedAt,
        summary: article.description.substring(0, 200) + (article.description.length > 200 ? '...' : ''),
        trend_score: calculateTrendScore(article.title, article.description, article.publishedAt)
      }))
      .sort((a, b) => b.trend_score - a.trend_score)
      .slice(0, 20); // Keep top 20 articles

    // Clear old news (older than 24 hours)
    await supabase
      .from('trending_news')
      .delete()
      .lt('scraped_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    // Insert new news
    const { data: insertedNews, error: insertError } = await supabase
      .from('trending_news')
      .insert(processedNews)
      .select();

    if (insertError) {
      throw insertError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        articlesProcessed: processedNews.length,
        articles: insertedNews 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in scrape-news function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});