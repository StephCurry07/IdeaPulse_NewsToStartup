import React from 'react';
import { X, Check, Star, Zap, Crown, Users } from 'lucide-react';
import { SubscriptionPlan } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (planId: string) => void;
}

const plans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Starter',
    price: 0,
    interval: 'month',
    creditsLimit: 5,
    features: [
      '5 AI-generated ideas per month',
      'Basic trend analysis',
      'Save up to 3 ideas',
      'Email notifications',
      'Community access'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 12,
    interval: 'month',
    creditsLimit: 50,
    popular: true,
    badge: 'Most Popular',
    features: [
      '50 AI-generated ideas per month',
      'Advanced market analysis',
      'Competitor research',
      'Revenue projections',
      'Implementation roadmaps',
      'Risk assessment',
      'Export to PDF/CSV',
      'Priority support',
      'Custom categories'
    ]
  },
  {
    id: 'creator',
    name: 'Creator',
    price: 29,
    interval: 'month',
    creditsLimit: 200,
    badge: 'For Creators',
    features: [
      '200 AI-generated ideas per month',
      'White-label reports',
      'Content creation tools',
      'Social media templates',
      'Bulk idea generation',
      'Advanced analytics',
      'API access (basic)',
      'Team collaboration (3 members)',
      'Custom branding',
      'Priority feature requests'
    ]
  }
];

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onSelectPlan }) => {
  if (!isOpen) return null;

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return <Star className="w-6 h-6" />;
      case 'pro': return <Zap className="w-6 h-6" />;
      case 'creator': return <Users className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'free': return 'border-gray-200 bg-white';
      case 'pro': return 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 ring-2 ring-blue-500';
      case 'creator': return 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
              <p className="text-gray-600 mt-1">Start free, upgrade as you grow your startup journey</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-xl border-2 p-6 ${getPlanColor(plan.id)} transition-all duration-300 hover:shadow-lg`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`inline-flex p-3 rounded-xl mb-4 ${
                    plan.id === 'free' ? 'bg-gray-100 text-gray-600' :
                    plan.id === 'pro' ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {getPlanIcon(plan.id)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">/{plan.interval}</span>
                  </div>
                  <p className="text-sm text-gray-600">{plan.creditsLimit} ideas per month</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onSelectPlan(plan.id)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    plan.id === 'free' 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : plan.id === 'pro'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg'
                  }`}
                >
                  {plan.id === 'free' ? 'Get Started Free' : 'Upgrade Now'}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center space-y-4">
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>No hidden fees</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm">
              All plans include personalized news based on your interests
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;