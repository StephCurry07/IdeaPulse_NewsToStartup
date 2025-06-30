import React from 'react';
import { TrendingUp, Users, AlertTriangle, Target, DollarSign, BarChart3 } from 'lucide-react';
import { MarketAnalysis } from '../types';

interface MarketAnalysisCardProps {
  analysis: MarketAnalysis;
}

const MarketAnalysisCard: React.FC<MarketAnalysisCardProps> = ({ analysis }) => {
  const formatMarketSize = (size: number) => {
    if (size >= 1000000000) return `$${(size / 1000000000).toFixed(1)}B`;
    if (size >= 1000000) return `$${(size / 1000000).toFixed(1)}M`;
    if (size >= 1000) return `$${(size / 1000).toFixed(1)}K`;
    return `$${size}`;
  };

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Market Size</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{formatMarketSize(analysis.marketSize)}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Growth Rate</span>
          </div>
          <p className="text-2xl font-bold text-green-900">{analysis.growthRate}%</p>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Competitors</span>
          </div>
          <p className="text-2xl font-bold text-orange-900">{analysis.competitorCount}</p>
        </div>
      </div>

      {/* Opportunities & Threats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-gray-900">Opportunities</h4>
          </div>
          <ul className="space-y-2">
            {analysis.opportunities.map((opportunity, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">{opportunity}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h4 className="font-semibold text-gray-900">Threats</h4>
          </div>
          <ul className="space-y-2">
            {analysis.threats.map((threat, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">{threat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Barriers to Entry */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          <h4 className="font-semibold text-gray-900">Barriers to Entry</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {analysis.barriers.map((barrier, index) => (
            <span
              key={index}
              className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {barrier}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketAnalysisCard;