import React from 'react';
import { TrendingNews } from '../types';
import { Clock, TrendingUp, ExternalLink } from 'lucide-react';

interface NewsCardProps {
  news: TrendingNews;
}

const categoryColors = {
  AI: 'bg-blue-100 text-blue-800 border-blue-200',
  Fintech: 'bg-green-100 text-green-800 border-green-200',
  Health: 'bg-pink-100 text-pink-800 border-pink-200',
  Climate: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Crypto: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  SaaS: 'bg-purple-100 text-purple-800 border-purple-200',
  Hardware: 'bg-gray-100 text-gray-800 border-gray-200'
};

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    return `${diffInHours} hours ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[news.category]}`}>
            {news.category}
          </span>
          <div className="flex items-center gap-1 text-orange-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">{news.trendScore}</span>
          </div>
        </div>
        <a
          href={news.url}
          className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
        {news.title}
      </h3>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
        {news.summary}
      </p>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span className="font-medium">{news.source}</span>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{formatTime(news.publishedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;