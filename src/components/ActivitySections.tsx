
import React from 'react';
import ActiveSecretariesSection from './ActiveSecretariesSection';
import RecentActivitySection from './RecentActivitySection';

const ActivitySections: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ActiveSecretariesSection />
      <RecentActivitySection />
    </div>
  );
};

export default ActivitySections;
