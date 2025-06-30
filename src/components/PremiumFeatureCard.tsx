import React from 'react';
import { Lock, Crown } from 'lucide-react';

interface PremiumFeatureCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  isPremium: boolean;
  onUpgrade: () => void;
}

const PremiumFeatureCard: React.FC<PremiumFeatureCardProps> = ({
  title,
  description,
  children,
  isPremium,
  onUpgrade
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-gray-600 text-sm mt-1">{description}</p>
          </div>
          {isPremium && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
              <Crown className="w-3 h-3" />
              Premium
            </div>
          )}
        </div>

        {isPremium ? (
          <div className="relative">
            <div className="filter blur-sm pointer-events-none">
              {children}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
              <div className="text-center">
                <Lock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Premium Feature</h4>
                <p className="text-gray-600 text-sm mb-4">Upgrade to unlock advanced insights</p>
                <button
                  onClick={onUpgrade}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default PremiumFeatureCard;