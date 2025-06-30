import React from 'react';
import { Lightbulb, Calendar, Settings, Crown, Zap, Users } from 'lucide-react';

interface HeaderProps {
  onUpgrade: () => void;
  userPlan: 'free' | 'pro' | 'creator';
}

const Header: React.FC<HeaderProps> = ({ onUpgrade, userPlan }) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getPlanBadge = () => {
    switch (userPlan) {
      case 'pro':
        return (
          <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            <Zap className="w-3 h-3" />
            Pro
          </div>
        );
      case 'creator':
        return (
          <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
            <Users className="w-3 h-3" />
            Creator
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
            Starter
          </div>
        );
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">IdeaPulse</h1>
              <p className="text-sm text-gray-600">Personalized Startup Intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">{today}</span>
            </div>
            
            {getPlanBadge()}
            
            {userPlan === 'free' && (
              <button
                onClick={onUpgrade}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Upgrade
              </button>
            )}
            
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;