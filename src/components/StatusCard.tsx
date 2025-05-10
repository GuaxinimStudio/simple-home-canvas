
import React from 'react';

type StatusCardProps = {
  icon: React.ReactNode;
  title: string;
  count: string | number;
  children: React.ReactNode;
  badge?: {
    text: string;
    color: string;
  };
};

const StatusCard: React.FC<StatusCardProps> = ({ icon, title, count, children, badge }) => {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          {icon}
          <h3 className="font-medium text-lg">{title}</h3>
        </div>
        
        {badge && (
          <div className={`px-2.5 py-1 text-xs rounded-full ${badge.color}`}>
            {badge.text}
          </div>
        )}
      </div>
      
      <div className="flex justify-center">
        {children}
      </div>
    </div>
  );
};

export default StatusCard;
