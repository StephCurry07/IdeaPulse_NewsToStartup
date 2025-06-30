import React from 'react';
import { StartupIdea } from '../types';
import { Heart, Lightbulb, TrendingUp, Users, Zap } from 'lucide-react';

interface StartupIdeaCardProps {
  idea: StartupIdea;
  onToggleSave: (id: string) => void;
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

const StartupIdeaCard: React.FC<StartupIdeaCardProps> = ({ idea, onToggleSave }) => {
  const MarketIcon = marketSizeIcons[idea.marketSize];
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Lightbulb className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {idea.category}
          </span>
        </div>
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
      
      <div className="flex items-center justify-between">
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
    </div>
  );
};

export default StartupIdeaCard;