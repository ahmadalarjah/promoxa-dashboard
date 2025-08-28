import React, { useState } from 'react';
import {
  Filter,
  X,
  Search,
  Calendar,
  DollarSign,
  User,
  Hash,
  Wallet,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface FilterOptions {
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: string;
  maxAmount?: string;
  transactionHash?: string;
  walletAddress?: string;
  username?: string;
}

interface AdvancedFilterProps {
  type: 'deposits' | 'withdrawals';
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  type,
  onFilterChange,
  onClearFilters,
  isExpanded = false,
  onToggleExpanded
}) => {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [localFilters, setLocalFilters] = useState<FilterOptions>({});

  const statusOptions = type === 'deposits' 
    ? [
        { value: '', label: 'All Statuses' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'CONFIRMED', label: 'Confirmed' },
        { value: 'REJECTED', label: 'Rejected' }
      ]
    : [
        { value: '', label: 'All Statuses' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'APPROVED', label: 'Approved' },
        { value: 'REJECTED', label: 'Rejected' },
        { value: 'COMPLETED', label: 'Completed' }
      ];

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    setFilters(localFilters);
    onFilterChange(localFilters);
  };

  const handleClearFilters = () => {
    const emptyFilters: FilterOptions = {};
    setLocalFilters(emptyFilters);
    setFilters(emptyFilters);
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value.trim() !== '');

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Filter Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Advanced Filters</h3>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Active
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {onToggleExpanded && (
              <button
                onClick={onToggleExpanded}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            )}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center px-2 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              >
                <X className="h-3 w-3 mr-1" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={localFilters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Start Date
              </label>
              <input
                type="datetime-local"
                value={localFilters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                End Date
              </label>
              <input
                type="datetime-local"
                value={localFilters.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Amount Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Min Amount
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={localFilters.minAmount || ''}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Max Amount
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={localFilters.maxAmount || ''}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Username Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Username
            </label>
            <input
              type="text"
              placeholder="Search by username..."
              value={localFilters.username || ''}
              onChange={(e) => handleFilterChange('username', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Transaction Hash / Wallet Address Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {type === 'deposits' ? (
                <>
                  <Hash className="h-4 w-4 inline mr-1" />
                  Transaction Hash
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 inline mr-1" />
                  Wallet Address
                </>
              )}
            </label>
            <input
              type="text"
              placeholder={type === 'deposits' ? 'Search by transaction hash...' : 'Search by wallet address...'}
              value={type === 'deposits' ? (localFilters.transactionHash || '') : (localFilters.walletAddress || '')}
              onChange={(e) => handleFilterChange(
                type === 'deposits' ? 'transactionHash' : 'walletAddress', 
                e.target.value
              )}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <Search className="h-4 w-4 inline mr-1" />
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilter;
