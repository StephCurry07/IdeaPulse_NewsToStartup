import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface NewsItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  trend_score: number;
}

interface GeneratedIdea {
  idea: string;
  category: string;
  based_on: string[];
  confidence: number;
  market_size: string;
  difficulty: string;
  news_ids: string[];
}

async function generateStartupIdeas(newsItems: NewsItem[]): Promise<GeneratedIdea[]> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  
  if (!geminiApiKey) {
    throw new Error('Gemini API key not configured');
  }

  // Group news by category for better idea generation
  const newsByCategory = newsItems.reduce((acc, news) => {
    if (!acc[news.category]) acc[news.category] = [];
    acc[news.category].push(news);
    return acc;
  }, {} as Record<string, NewsItem[]>);

  const prompt = `You are an expert startup advisor and trend analyst. Based on the following trending tech news, generate 8-10 innovative startup ideas.

TRENDING NEWS BY CATEGORY:
${Object.entries(newsByCategory).map(([category, items]) => 
  `\n${category}:\n${items.map(item => `- ${item.title}: ${item.summary}`).join('\n')}`
).join('\n')}

REQUIREMENTS:
1. Each idea should be a concise one-liner (max 120 characters)
2. Ideas should combine trends from different categories when possible
3. Focus on practical, implementable solutions
4. Consider market size and difficulty realistically
5. Provide confidence scores based on trend strength and market opportunity

RESPONSE FORMAT (JSON only, no markdown):
{
  "ideas": [
    {
      "idea": "One-liner startup idea description",
      "category": "Primary category or combination (e.g., 'AI + Health')",
      "based_on": ["Trend 1", "Trend 2"],
      "confidence": 85,
      "market_size": "Small|Medium|Large",
      "difficulty": "Low|Medium|High",
      "news_ids": ["relevant_news_id1", "relevant_news_id2"]
    }
  ]
}

Generate innovative ideas that solve real problems highlighted by these trends. Return only valid JSON.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      throw new Error('No content received from Gemini API');
    }

    // Clean the response - remove markdown code blocks if present
    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse the JSON response
    const parsedResponse = JSON.parse(cleanContent);
    
    if (!parsedResponse.ideas || !Array.isArray(parsedResponse.ideas)) {
      throw new Error('Invalid response format from Gemini API');
    }
    
    return parsedResponse.ideas.map((idea: any) => ({
      ...idea,
      news_ids: idea.news_ids?.filter((id: string) => 
        newsItems.some(news => news.id === id)
      ) || []
    }));

  } catch (error) {
    console.error('Error generating ideas with Gemini:', error);
    
    // Fallback: Generate simple ideas based on categories
    return Object.entries(newsByCategory).slice(0, 5).map(([category, items], index) => ({
      idea: `AI-powered solution for ${category.toLowerCase()} industry automation and optimization`,
      category: `AI + ${category}`,
      based_on: items.slice(0, 2).map(item => item.title.substring(0, 50)),
      confidence: Math.floor(Math.random() * 20) + 70,
      market_size: ['Small', 'Medium', 'Large'][Math.floor(Math.random() * 3)],
      difficulty: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      news_ids: items.slice(0, 2).map(item => item.id)
    }));
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

    // Fetch latest trending news
    const { data: newsData, error: newsError } = await supabase
      .from('trending_news')
      .select('id, title, category, summary, trend_score')
      .order('trend_score', { ascending: false })
      .limit(15);

    if (newsError) {
      throw newsError;
    }

    if (!newsData || newsData.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No trending news found. Please scrape news first.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate startup ideas based on trending news
    const generatedIdeas = await generateStartupIdeas(newsData);

    // Clear old ideas (older than 24 hours)
    await supabase
      .from('startup_ideas')
      .delete()
      .lt('generated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    // Insert new ideas
    const { data: insertedIdeas, error: insertError } = await supabase
      .from('startup_ideas')
      .insert(generatedIdeas)
      .select();

    if (insertError) {
      throw insertError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        ideasGenerated: generatedIdeas.length,
        ideas: insertedIdeas,
        basedOnNews: newsData.length
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in generate-ideas function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});