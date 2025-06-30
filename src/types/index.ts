export interface TrendingNews {
  id: string;
  title: string;
  source: string;
  url: string;
  category: 'AI' | 'Fintech' | 'Health' | 'Climate' | 'Crypto' | 'SaaS' | 'Hardware';
  publishedAt: string;
  summary: string;
  trendScore: number;
}

export interface StartupIdea {
  id: string;
  idea: string;
  category: string;
  basedOn: string[];
  confidence: number;
  marketSize: 'Small' | 'Medium' | 'Large';
  difficulty: 'Low' | 'Medium' | 'High';
  generatedAt: string;
  saved: boolean;
  businessModel?: string;
  targetAudience?: string;
  competitorAnalysis?: string[];
  revenueProjection?: string;
  implementationSteps?: string[];
  riskFactors?: string[];
}

export interface DailyBatch {
  date: string;
  totalIdeas: number;
  topCategories: string[];
  avgConfidence: number;
}

export interface User {
  id: string;
  email: string;
  subscription: 'free' | 'pro' | 'creator';
  subscriptionExpiry?: string;
  creditsUsed: number;
  creditsLimit: number;
  preferences: UserPreferences;
}

export interface UserPreferences {
  interestedCategories: string[];
  industries: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  focusAreas: string[];
  notifications: {
    email: boolean;
    dailyDigest: boolean;
    trendingAlerts: boolean;
  };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  creditsLimit: number;
  popular?: boolean;
  badge?: string;
}

export interface MarketAnalysis {
  id: string;
  ideaId: string;
  marketSize: number;
  competitorCount: number;
  growthRate: number;
  barriers: string[];
  opportunities: string[];
  threats: string[];
  generatedAt: string;
}

export interface TrendReport {
  id: string;
  title: string;
  summary: string;
  keyInsights: string[];
  emergingTrends: string[];
  investmentOpportunities: string[];
  generatedAt: string;
  isPremium: boolean;
}

export interface OnboardingData {
  interestedCategories: string[];
  industries: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  focusAreas: string[];
  goals: string[];
}