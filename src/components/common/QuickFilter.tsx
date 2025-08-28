import React from 'react';
import { Clock, CheckCircle, XCircle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface QuickFilterProps {
  type: 'deposits' | 'withdrawals';
  onQuickFilter: (filter: any) => void;
  activeFilter?: string;
}

const QuickFilter: React.FC<QuickFilterProps> = ({ type, onQuickFilter, activeFilter }) => {
  const depositPresets = [
    {
      key: 'all',
      label: 'All Deposits',
      icon: TrendingUp,
      filter: {}
    },
    {
      key: 'pending',
      label: 'Pending',
      icon: Clock,
      filter: { status: 'PENDING' }
    },
    {
      key: 'confirmed',
      label: 'Confirmed',
      icon: CheckCircle,
      filter: { status: 'CONFIRMED' }
    },
    {
      key: 'rejected',
      label: 'Rejected',
      icon: XCircle,
      filter: { status: 'REJECTED' }
    },
    {
      key: 'high-value',
      label: 'High Value (>$1000)',
      icon: DollarSign,
      filter: { minAmount: '1000' }
    }
  ];

  const withdrawalPresets = [
    {
      key: 'all',
      label: 'All Withdrawals',
      icon: TrendingDown,
      filter: {}
    },
    {
      key: 'pending',
      label: 'Pending',
      icon: Clock,
      filter: { status: 'PENDING' }
    },
    {
      key: 'completed',
      label: 'Completed',
      icon: CheckCircle,
      filter: { status: 'COMPLETED' }
    },
    {
      key: 'rejected',
      label: 'Rejected',
      icon: XCircle,
      filter: { status: 'REJECTED' }
    },
    {
      key: 'high-value',
      label: 'High Value (>$500)',
      icon: DollarSign,
      filter: { minAmount: '500' }
    }
  ];

  const presets = type === 'deposits' ? depositPresets : withdrawalPresets;

  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => {
        const Icon = preset.icon;
        const isActive = activeFilter === preset.key;
        
        return (
          <button
            key={preset.key}
            onClick={() => onQuickFilter(preset.filter)}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg border transition-colors duration-200 ${
              isActive
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            <Icon className="h-4 w-4 mr-2" />
            {preset.label}
          </button>
        );
      })}
    </div>
  );
};

export default QuickFilter;
