import React from 'react';
import { Route } from 'lucide-react';

const TripStopCreator: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-white/20">
      <div className="bg-white/5 p-6 rounded-3xl mb-4">
        <Route size={48} />
      </div>
      <h2 className="text-xl font-bold text-white/40">Trip Planning Coming Soon</h2>
      <p className="text-sm">Use the "Stops" section to manage your transit network.</p>
    </div>
  );
};

export default TripStopCreator;
