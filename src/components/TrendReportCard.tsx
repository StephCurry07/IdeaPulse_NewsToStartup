import React from 'react';
import { TrendReport } from '../types';
import { FileText, TrendingUp, Lightbulb, DollarSign, Lock } from 'lucide-react';

interface TrendReportCardProps {
  report: TrendReport;
  onUpgrade: () => void;
  isPremiumUser: boolean;
}

const TrendReportCard: React.FC<TrendReportCardProps> = ({ report, onUpgrade, isPremiumUser }) => {
  const canAccess = !report.isPremium || isPremiumUser;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
            <p className="text-gray-600 text-sm">{new Date(report.generatedAt).toLocaleDateString()}</p>
          </div>
        </div>
        {report.isPremium && (
          <div className="flex items-center gap-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
            <Lock className="w-3 h-3" />
            Premium
          </div>
        )}
      </div>

      <p className="text-gray-700 mb-6 leading-relaxed">{report.summary}</p>

      {canAccess ? (
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-gray-900">Key Insights</h4>
            </div>
            <ul className="space-y-2">
              {report.keyInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm">{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-green-600" />
              <h4 className="font-medium text-gray-900">Emerging Trends</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {report.emergingTrends.map((trend, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {trend}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <h4 className="font-medium text-gray-900">Investment Opportunities</h4>
            </div>
            <ul className="space-y-2">
              {report.investmentOpportunities.map((opportunity, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm">{opportunity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Lock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Premium Report</h4>
          <p className="text-gray-600 text-sm mb-4">Upgrade to access detailed trend analysis and investment insights</p>
          <button
            onClick={onUpgrade}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            Upgrade Now
          </button>
        </div>
      )}
    </div>
  );
};

export default TrendReportCard;