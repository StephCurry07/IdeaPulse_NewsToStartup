import React, { useState } from 'react';
import { StartupIdea, MarketAnalysis } from '../types';
import { 
  Heart, 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Zap, 
  ChevronDown, 
  ChevronUp,
  Target,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Download
} from 'lucide-react';
import MarketAnalysisCard from './MarketAnalysisCard';
import PremiumFeatureCard from './PremiumFeatureCard';

interface EnhancedStartupIdeaCardProps {
  idea: StartupIdea;
  onToggleSave: (id: string) => void;
  onUpgrade: () => void;
  isPremiumUser: boolean;
}

const difficultyColors = {
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-red-100 text-red-800'
};

const marketSizeIcons = {
  Small: Users,
  Medium: TrendingUp,
  Large: Zap
};

// Mock market analysis data
const mockMarketAnalysis: MarketAnalysis = {
  id: '1',
  ideaId: '1',
  marketSize: 2500000000,
  competitorCount: 15,
  growthRate: 23.5,
  barriers: ['High Capital Requirements', 'Regulatory Compliance', 'Technical Expertise'],
  opportunities: [
    'Growing demand for AI solutions',
    'Underserved SMB market',
    'Integration with existing tools'
  ],
  threats: [
    'Big tech competition',
    'Economic downturn impact',
    'Changing regulations'
  ],
  generatedAt: new Date().toISOString()
};

const EnhancedStartupIdeaCard: React.FC<EnhancedStartupIdeaCardProps> = ({ 
  idea, 
  onToggleSave, 
  onUpgrade,
  isPremiumUser 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MarketIcon = marketSizeIcons[idea.marketSize];
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const exportIdea = () => {
    const exportData = {
      idea: idea.idea,
      category: idea.category,
      marketSize: idea.marketSize,
      difficulty: idea.difficulty,
      confidence: idea.confidence,
      businessModel: idea.businessModel,
      targetAudience: idea.targetAudience,
      revenueProjection: idea.revenueProjection,
      implementationSteps: idea.implementationSteps,
      riskFactors: idea.riskFactors
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `startup-idea-${idea.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-200">
      {/* Main Card Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Lightbulb className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {idea.category}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isPremiumUser && (
              <button
                onClick={exportIdea}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Export idea"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onToggleSave(idea.id)}
              className={`p-2 rounded-full transition-all duration-200 ${
                idea.saved 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${idea.saved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
        
        <p className="text-gray-900 font-medium mb-4 leading-relaxed">
          {idea.idea}
        </p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Based on:</span>
            <div className="flex flex-wrap gap-2">
              {idea.basedOn.map((trend, index) => (
                <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                  {trend}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <MarketIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">{idea.marketSize}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyColors[idea.difficulty]}`}>
              {idea.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">{idea.confidence}%</span>
            </div>
            <span className="text-xs text-gray-500">{formatTime(idea.generatedAt)}</span>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-2 text-blue-600 hover:text-blue-700 transition-colors border-t border-gray-100"
        >
          <span className="text-sm font-medium">
            {isExpanded ? 'Show Less' : 'Show Premium Insights'}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Premium Content */}
      {isExpanded && (
        <div className="border-t border-gray-100 p-6 space-y-6 bg-gray-50">
          {/* Business Model */}
          <PremiumFeatureCard
            title="Business Model"
            description="Revenue streams and monetization strategy"
            isPremium={!isPremiumUser}
            onUpgrade={onUpgrade}
          >
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <p className="text-gray-700 text-sm">
                  {idea.businessModel || "Freemium SaaS model with tiered pricing. Start with free tier to build user base, then convert to paid plans with advanced features. Revenue from subscriptions, premium integrations, and enterprise licenses."}
                </p>
              </div>
            </div>
          </PremiumFeatureCard>

          {/* Target Audience */}
          <PremiumFeatureCard
            title="Target Audience"
            description="Primary customer segments and personas"
            isPremium={!isPremiumUser}
            onUpgrade={onUpgrade}
          >
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="text-gray-700 text-sm">
                  {idea.targetAudience || "Small to medium businesses (10-500 employees) in tech, healthcare, and finance sectors. Decision makers include CTOs, IT managers, and department heads looking for automation solutions."}
                </p>
              </div>
            </div>
          </PremiumFeatureCard>

          {/* Market Analysis */}
          <PremiumFeatureCard
            title="Market Analysis"
            description="Comprehensive market research and competitive landscape"
            isPremium={!isPremiumUser}
            onUpgrade={onUpgrade}
          >
            <MarketAnalysisCard analysis={mockMarketAnalysis} />
          </PremiumFeatureCard>

          {/* Implementation Steps */}
          <PremiumFeatureCard
            title="Implementation Roadmap"
            description="Step-by-step guide to bring this idea to life"
            isPremium={!isPremiumUser}
            onUpgrade={onUpgrade}
          >
            <div className="space-y-3">
              {(idea.implementationSteps || [
                "Conduct market research and validate problem",
                "Build MVP with core features",
                "Acquire first 100 beta users",
                "Iterate based on user feedback",
                "Launch paid version with premium features",
                "Scale marketing and sales efforts"
              ]).map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 text-sm">{step}</span>
                </div>
              ))}
            </div>
          </PremiumFeatureCard>

          {/* Risk Assessment */}
          <PremiumFeatureCard
            title="Risk Assessment"
            description="Potential challenges and mitigation strategies"
            isPremium={!isPremiumUser}
            onUpgrade={onUpgrade}
          >
            <div className="space-y-3">
              {(idea.riskFactors || [
                "High competition from established players",
                "Technical complexity may delay development",
                "Customer acquisition costs could be high",
                "Regulatory changes might impact business model"
              ]).map((risk, index) => (
                <div key={index} className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{risk}</span>
                </div>
              ))}
            </div>
          </PremiumFeatureCard>
        </div>
      )}
    </div>
  );
};

export default EnhancedStartupIdeaCard;