import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: LucideIcon;
  iconColor: string;
  trend?: number[];
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor,
  trend
}) => {
  const changeColor = {
    increase: 'text-green-600',
    decrease: 'text-red-600',
    neutral: 'text-gray-600'
  }[changeType];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${changeColor} mt-1`}>
              {changeType === 'increase' && '+'}
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${iconColor.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
      
      {/* Simple trend visualization */}
      {trend && (
        <div className="mt-4">
          <div className="flex items-end space-x-1 h-8">
            {trend.map((value, index) => (
              <div
                key={index}
                className="bg-blue-200 rounded-sm flex-1"
                style={{ height: `${(value / Math.max(...trend)) * 100}%` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;