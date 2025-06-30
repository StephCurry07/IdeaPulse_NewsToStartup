import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, SkipForward } from 'lucide-react';
import { OnboardingData } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: OnboardingData) => void;
}

const CATEGORIES = [
  { id: 'AI', label: 'Artificial Intelligence', description: 'Machine learning, neural networks, automation' },
  { id: 'Fintech', label: 'Financial Technology', description: 'Payments, banking, cryptocurrency' },
  { id: 'Health', label: 'Healthcare & Biotech', description: 'Medical devices, telemedicine, wellness' },
  { id: 'Climate', label: 'Climate Tech', description: 'Renewable energy, sustainability, carbon capture' },
  { id: 'SaaS', label: 'Software as a Service', description: 'Cloud software, productivity tools' },
  { id: 'Hardware', label: 'Hardware & IoT', description: 'Devices, semiconductors, robotics' },
  { id: 'Crypto', label: 'Blockchain & Web3', description: 'DeFi, NFTs, decentralized apps' }
];

const INDUSTRIES = [
  'E-commerce', 'Education', 'Real Estate', 'Transportation', 'Food & Beverage',
  'Entertainment', 'Manufacturing', 'Agriculture', 'Energy', 'Retail'
];

const FOCUS_AREAS = [
  'B2B Solutions', 'Consumer Apps', 'Enterprise Software', 'Mobile-First',
  'AI-Powered Tools', 'Marketplace Platforms', 'Subscription Models', 'Hardware Products'
];

const GOALS = [
  'Find my next startup idea', 'Stay updated on trends', 'Research competitors',
  'Validate existing ideas', 'Content creation', 'Investment research'
];

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    interestedCategories: [],
    industries: [],
    experienceLevel: 'beginner',
    focusAreas: [],
    goals: []
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSkip = () => {
    // Set all options as selected when skipping
    const defaultData: OnboardingData = {
      interestedCategories: CATEGORIES.map(cat => cat.id),
      industries: INDUSTRIES,
      experienceLevel: 'intermediate',
      focusAreas: FOCUS_AREAS,
      goals: GOALS
    };
    onComplete(defaultData);
    onClose();
  };

  const handleComplete = () => {
    // If no selections made, use all options
    const finalData = {
      interestedCategories: data.interestedCategories.length > 0 ? data.interestedCategories : CATEGORIES.map(cat => cat.id),
      industries: data.industries.length > 0 ? data.industries : INDUSTRIES,
      experienceLevel: data.experienceLevel || 'intermediate',
      focusAreas: data.focusAreas.length > 0 ? data.focusAreas : FOCUS_AREAS,
      goals: data.goals.length > 0 ? data.goals : GOALS
    };
    onComplete(finalData);
    onClose();
  };

  const toggleSelection = (field: keyof OnboardingData, value: string) => {
    setData(prev => {
      const currentArray = prev[field] as string[];
      const isSelected = currentArray.includes(value);
      
      return {
        ...prev,
        [field]: isSelected 
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value]
      };
    });
  };

  const canProceed = () => {
    // Always allow proceeding - we'll use defaults if nothing selected
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome to TrendIdea!</h2>
              <p className="text-gray-600 mt-1">Let's personalize your experience</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSkip}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <SkipForward className="w-4 h-4" />
                <span className="text-sm">Skip for now</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>Step {step} of 5</span>
              <span>{Math.round((step / 5) * 100)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Categories */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">What areas interest you most?</h3>
              <p className="text-gray-600 mb-6">Select the categories you'd like to see trending news for (or skip to see all)</p>
              
              <div className="grid grid-cols-1 gap-3">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => toggleSelection('interestedCategories', category.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                      data.interestedCategories.includes(category.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{category.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{category.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Industries */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Which industries do you focus on?</h3>
              <p className="text-gray-600 mb-6">This helps us find relevant startup opportunities (or skip to see all)</p>
              
              <div className="grid grid-cols-2 gap-3">
                {INDUSTRIES.map((industry) => (
                  <button
                    key={industry}
                    onClick={() => toggleSelection('industries', industry)}
                    className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                      data.industries.includes(industry)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Experience Level */}
          {step === 3 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">What's your experience level?</h3>
              <p className="text-gray-600 mb-6">This helps us tailor the complexity of ideas and insights</p>
              
              <div className="space-y-3">
                {[
                  { id: 'beginner', label: 'Beginner', description: 'New to startups, looking to learn' },
                  { id: 'intermediate', label: 'Intermediate', description: 'Some experience, ready to dive deeper' },
                  { id: 'expert', label: 'Expert', description: 'Experienced entrepreneur or investor' }
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setData(prev => ({ ...prev, experienceLevel: level.id as any }))}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                      data.experienceLevel === level.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{level.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{level.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Focus Areas */}
          {step === 4 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">What type of solutions interest you?</h3>
              <p className="text-gray-600 mb-6">Select your preferred startup focus areas (or skip to see all)</p>
              
              <div className="grid grid-cols-2 gap-3">
                {FOCUS_AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() => toggleSelection('focusAreas', area)}
                    className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                      data.focusAreas.includes(area)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Goals */}
          {step === 5 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">What are your main goals?</h3>
              <p className="text-gray-600 mb-6">This helps us prioritize the most relevant content for you (or skip to see all)</p>
              
              <div className="space-y-3">
                {GOALS.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => toggleSelection('goals', goal)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                      data.goals.includes(goal)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Skip & Use All Options
              </button>
              
              {step < 5 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200"
                >
                  <Sparkles className="w-4 h-4" />
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;