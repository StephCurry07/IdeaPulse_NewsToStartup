import React, { useState, useEffect } from 'react';
import { useData } from './hooks/useData';
import { StartupIdea, TrendReport, OnboardingData } from './types';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import EnhancedStartupIdeaCard from './components/EnhancedStartupIdeaCard';
import TrendReportCard from './components/TrendReportCard';
import StatsCard from './components/StatsCard';
import FilterTabs from './components/FilterTabs';
import LoadingSpinner from './components/LoadingSpinner';
import PricingModal from './components/PricingModal';
import OnboardingModal from './components/OnboardingModal';
import { 
  TrendingUp, 
  Lightbulb, 
  Heart, 
  Target,
  RefreshCw,
  Sparkles,
  Database,
  AlertCircle,
  FileText,
  Crown,
  Zap,
  Lock
} from 'lucide-react';

// Mock trend reports
const mockTrendReports: TrendReport[] = [
  {
    id: '1',
    title: 'AI Revolution in Healthcare: Q1 2025 Analysis',
    summary: 'Comprehensive analysis of AI adoption in healthcare, covering telemedicine, diagnostic tools, and patient management systems.',
    keyInsights: [
      'AI diagnostic tools show 94% accuracy in early disease detection',
      'Telemedicine adoption increased 340% among elderly patients',
      'Healthcare AI market expected to reach $45B by 2026'
    ],
    emergingTrends: ['AI-powered drug discovery', 'Virtual health assistants', 'Predictive patient analytics'],
    investmentOpportunities: [
      'Early-stage AI diagnostic startups',
      'Healthcare data analytics platforms',
      'Remote patient monitoring solutions'
    ],
    generatedAt: new Date().toISOString(),
    isPremium: true
  },
  {
    id: '2',
    title: 'Climate Tech Investment Surge',
    summary: 'Analysis of the recent $2.1B funding round in climate technology and its implications for the startup ecosystem.',
    keyInsights: [
      'Carbon capture technology receives 60% of climate tech funding',
      'Government incentives driving private investment',
      'European startups leading in renewable energy innovation'
    ],
    emergingTrends: ['Direct air capture', 'Green hydrogen', 'Climate fintech'],
    investmentOpportunities: [
      'Carbon credit marketplaces',
      'Sustainable agriculture tech',
      'Clean energy storage solutions'
    ],
    generatedAt: new Date().toISOString(),
    isPremium: false
  }
];

function App() {
  const { news, ideas, loading, error, scrapeNews, generateIdeas } = useData();
  const [startupIdeas, setStartupIdeas] = useState<StartupIdea[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'news' | 'ideas' | 'reports'>('news');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userPlan, setUserPlan] = useState<'free' | 'pro' | 'creator'>('free');
  const [userPreferences, setUserPreferences] = useState<OnboardingData | null>(null);
  const [freeIdeasGenerated, setFreeIdeasGenerated] = useState(0);
  const [freeNewsScraped, setFreeNewsScraped] = useState(0);

  // Use real data when available, fallback to local state
  const displayIdeas = ideas.length > 0 ? ideas : startupIdeas;
  const displayNews = news;
  const isPremiumUser = userPlan !== 'free';

  // Free plan limits
  const FREE_IDEAS_LIMIT = 5;
  const FREE_NEWS_SCRAPES_LIMIT = 3;

  // Check if user needs onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    } else {
      const savedPreferences = localStorage.getItem('user_preferences');
      if (savedPreferences) {
        setUserPreferences(JSON.parse(savedPreferences));
      }
    }

    // Load free plan usage
    const savedIdeasCount = localStorage.getItem('free_ideas_generated');
    const savedNewsCount = localStorage.getItem('free_news_scraped');
    if (savedIdeasCount) setFreeIdeasGenerated(parseInt(savedIdeasCount));
    if (savedNewsCount) setFreeNewsScraped(parseInt(savedNewsCount));
  }, []);

  const handleOnboardingComplete = (data: OnboardingData) => {
    setUserPreferences(data);
    localStorage.setItem('user_preferences', JSON.stringify(data));
    localStorage.setItem('onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  const handleToggleSave = (id: string) => {
    setStartupIdeas(prev => 
      prev.map(idea => 
        idea.id === id ? { ...idea, saved: !idea.saved } : idea
      )
    );
  };

  const handleScrapeNews = async () => {
    // Check free plan limits
    if (userPlan === 'free' && freeNewsScraped >= FREE_NEWS_SCRAPES_LIMIT) {
      setShowPricing(true);
      return;
    }

    setIsScraping(true);
    try {
      await scrapeNews(userPreferences?.interestedCategories);
      
      // Update free plan usage
      if (userPlan === 'free') {
        const newCount = freeNewsScraped + 1;
        setFreeNewsScraped(newCount);
        localStorage.setItem('free_news_scraped', newCount.toString());
      }
      
      // Switch to news tab after successful scraping
      setActiveTab('news');
    } finally {
      setIsScraping(false);
    }
  };

  const handleGenerateIdeas = async () => {
    // Check free plan limits
    if (userPlan === 'free' && freeIdeasGenerated >= FREE_IDEAS_LIMIT) {
      setShowPricing(true);
      return;
    }

    setIsGenerating(true);
    try {
      await generateIdeas();
      
      // Update free plan usage
      if (userPlan === 'free') {
        const newCount = freeIdeasGenerated + 1;
        setFreeIdeasGenerated(newCount);
        localStorage.setItem('free_ideas_generated', newCount.toString());
      }
      
      // Switch to ideas tab after successful generation
      setActiveTab('ideas');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectPlan = (planId: string) => {
    setUserPlan(planId as 'free' | 'pro' | 'creator');
    setShowPricing(false);
    
    // Reset limits for paid plans
    if (planId !== 'free') {
      setFreeIdeasGenerated(0);
      setFreeNewsScraped(0);
      localStorage.removeItem('free_ideas_generated');
      localStorage.removeItem('free_news_scraped');
    }
    
    // Here you would integrate with Stripe or your payment processor
    console.log('Selected plan:', planId);
  };

  // Filter news based on user preferences
  const getFilteredNewsCategories = () => {
    if (!userPreferences?.interestedCategories.length) {
      return ['All', ...Array.from(new Set(displayNews.map(newsItem => newsItem.category)))];
    }
    return ['All', ...userPreferences.interestedCategories];
  };

  const newsCategories = getFilteredNewsCategories();
  const filteredNews = activeFilter === 'All' 
    ? displayNews.filter(newsItem => 
        !userPreferences?.interestedCategories.length || 
        userPreferences.interestedCategories.includes(newsItem.category)
      )
    : displayNews.filter(newsItem => newsItem.category === activeFilter);

  const savedIdeasCount = displayIdeas.filter(idea => idea.saved).length;
  const avgConfidence = displayIdeas.length > 0 
    ? Math.round(displayIdeas.reduce((acc, idea) => acc + idea.confidence, 0) / displayIdeas.length)
    : 0;

  // Check if actions are disabled due to limits
  const isNewsScrapingDisabled = userPlan === 'free' && freeNewsScraped >= FREE_NEWS_SCRAPES_LIMIT;
  const isIdeaGenerationDisabled = userPlan === 'free' && freeIdeasGenerated >= FREE_IDEAS_LIMIT;

  if (loading && displayNews.length === 0 && displayIdeas.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onUpgrade={() => setShowPricing(true)} userPlan={userPlan} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Personalized Welcome */}
        {userPreferences && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Welcome back! Here's what's trending in your interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {userPreferences.interestedCategories.slice(0, 5).map(category => (
                    <span key={category} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {category}
                    </span>
                  ))}
                  {userPreferences.interestedCategories.length > 5 && (
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                      +{userPreferences.interestedCategories.length - 5} more
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowOnboarding(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Update Preferences
              </button>
            </div>
          </div>
        )}

        {/* Free Plan Usage Banner */}
        {userPlan === 'free' && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Free Plan Usage</h3>
                <div className="space-y-1 text-blue-100">
                  <p>News Scrapes: {freeNewsScraped}/{FREE_NEWS_SCRAPES_LIMIT} used</p>
                  <p>Ideas Generated: {freeIdeasGenerated}/{FREE_IDEAS_LIMIT} used</p>
                </div>
                <p className="text-blue-100 mt-2">Upgrade to get unlimited access and premium features</p>
              </div>
              <button
                onClick={() => setShowPricing(true)}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Upgrade to Pro
              </button>
            </div>
          </div>
        )}

        {/* Data Management Controls */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Management</h3>
              <p className="text-gray-600 text-sm">
                {userPreferences 
                  ? `Scrape news for your interests: ${userPreferences.interestedCategories.slice(0, 3).join(', ')}${userPreferences.interestedCategories.length > 3 ? '...' : ''}`
                  : 'Scrape latest tech news and generate AI-powered startup ideas'
                }
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleScrapeNews}
                disabled={isScraping || isNewsScrapingDisabled}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                {isNewsScrapingDisabled && (
                  <Lock className="w-4 h-4 absolute -top-1 -right-1 bg-orange-500 text-white rounded-full p-0.5" />
                )}
                {isScraping ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Database className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {isScraping ? 'Scraping...' : isNewsScrapingDisabled ? 'Limit Reached' : 'Scrape News'}
                </span>
              </button>
              <button
                onClick={handleGenerateIdeas}
                disabled={isGenerating || displayNews.length === 0 || isIdeaGenerationDisabled}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                {isIdeaGenerationDisabled && (
                  <Lock className="w-4 h-4 absolute -top-1 -right-1 bg-orange-500 text-white rounded-full p-0.5" />
                )}
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {isGenerating ? 'Generating...' : isIdeaGenerationDisabled ? 'Limit Reached' : 'Generate Ideas'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Trending Stories"
            value={filteredNews.length}
            change={filteredNews.length > 0 ? "Personalized" : "No data"}
            icon={TrendingUp}
            color="blue"
          />
          <StatsCard
            title="Ideas Generated"
            value={displayIdeas.length}
            change={displayIdeas.length > 0 ? "AI-powered" : "Generate ideas"}
            icon={Lightbulb}
            color="purple"
          />
          <StatsCard
            title="Saved Ideas"
            value={savedIdeasCount}
            icon={Heart}
            color="green"
          />
          <StatsCard
            title="Avg Confidence"
            value={avgConfidence > 0 ? `${avgConfidence}%` : "N/A"}
            change={avgConfidence > 0 ? "AI confidence" : ""}
            icon={Target}
            color="orange"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('news')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'news'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending News
              </div>
            </button>
            <button
              onClick={() => setActiveTab('ideas')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'ideas'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Startup Ideas
              </div>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'reports'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Trend Reports
                {!isPremiumUser && <Zap className="w-3 h-3 text-yellow-500" />}
              </div>
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'news' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Trending News</h2>
                <p className="text-gray-600 mt-1">
                  {filteredNews.length > 0 
                    ? `${filteredNews.length} stories matching your interests` 
                    : 'Click "Scrape News" to load trending stories'
                  }
                </p>
              </div>
              {filteredNews.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Personalized
                </div>
              )}
            </div>
            
            {filteredNews.length > 0 && (
              <FilterTabs
                categories={newsCategories}
                activeCategory={activeFilter}
                onCategoryChange={setActiveFilter}
              />
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredNews.length > 0 ? (
                filteredNews.map(newsItem => (
                  <NewsCard key={newsItem.id} news={newsItem} />
                ))
              ) : displayNews.length === 0 ? (
                <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-gray-100">
                  <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No News Data</h3>
                  <p className="text-gray-600 mb-4">
                    {isNewsScrapingDisabled 
                      ? 'Free plan limit reached. Upgrade to continue scraping news.'
                      : 'Scrape the latest tech news to get started'
                    }
                  </p>
                  {isNewsScrapingDisabled ? (
                    <button
                      onClick={() => setShowPricing(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                    >
                      <Zap className="w-4 h-4" />
                      Upgrade Now
                    </button>
                  ) : (
                    <button
                      onClick={handleScrapeNews}
                      disabled={isScraping}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {isScraping ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Database className="w-4 h-4" />
                      )}
                      {isScraping ? 'Scraping...' : 'Scrape News'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  No news found matching your interests. Try updating your preferences.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'ideas' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">AI-Generated Ideas</h2>
                <p className="text-gray-600 mt-1">
                  {displayIdeas.length > 0 ? 'Based on trending news with premium insights' : 'Generate ideas from news data'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayIdeas.length > 0 ? (
                displayIdeas.map(idea => (
                  <EnhancedStartupIdeaCard
                    key={idea.id}
                    idea={idea}
                    onToggleSave={handleToggleSave}
                    onUpgrade={() => setShowPricing(true)}
                    isPremiumUser={isPremiumUser}
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-gray-100">
                  <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Ideas Generated</h3>
                  <p className="text-gray-600 mb-4">
                    {displayNews.length === 0 
                      ? 'Scrape news first, then generate AI-powered startup ideas'
                      : isIdeaGenerationDisabled
                      ? 'Free plan limit reached. Upgrade to generate more ideas.'
                      : 'Generate startup ideas based on trending news'
                    }
                  </p>
                  {isIdeaGenerationDisabled ? (
                    <button
                      onClick={() => setShowPricing(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
                    >
                      <Zap className="w-4 h-4" />
                      Upgrade Now
                    </button>
                  ) : (
                    <button
                      onClick={handleGenerateIdeas}
                      disabled={isGenerating || displayNews.length === 0}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      {isGenerating ? 'Generating...' : 'Generate Ideas'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Trend Reports</h2>
                <p className="text-gray-600 mt-1">In-depth analysis of market trends and investment opportunities</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockTrendReports.map(report => (
                <TrendReportCard
                  key={report.id}
                  report={report}
                  onUpgrade={() => setShowPricing(true)}
                  isPremiumUser={isPremiumUser}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />
      
      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        onSelectPlan={handleSelectPlan}
      />
    </div>
  );
}

export default App;