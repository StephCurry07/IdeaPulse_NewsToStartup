import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
      <p className="text-gray-600 font-medium">Loading data...</p>
      <p className="text-gray-500 text-sm mt-1">Fetching trending news and startup ideas</p>
    </div>
  );
};

export default LoadingSpinner;