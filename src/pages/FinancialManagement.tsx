import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  RefreshCw,
  Download,
  BarChart3,
  Settings,
  Copy,
  ExternalLink
} from 'lucide-react';
import DataTable from '../components/common/DataTable';
import StatCard from '../components/common/StatCard';
import AdvancedFilter from '../components/common/AdvancedFilter';
import QuickFilter from '../components/common/QuickFilter';
import DepositSettings from '../components/common/DepositSettings';
import WalletAddress from '../components/common/WalletAddress';
import apiService from '../services/apiService';
import { toast } from 'react-toastify';

interface Deposit {
  id: number;
  amount: string;
  transactionHash: string;
  status: string;
  createdAt: string;
  confirmedAt: string | null;
  adminNotes: string | null;
  username: string;
}

interface Withdrawal {
  id: number;
  requestedAmount: string;
  finalAmount: string;
  feeAmount: string;
  walletAddress: string;
  status: string;
  createdAt: string;
  processedAt: string | null;
  adminNotes: string | null;
  transactionHash: string | null;
  username: string;
}

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

const FinancialManagement: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals'>('deposits');
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({});
  const [activeQuickFilter, setActiveQuickFilter] = useState<string>('all');
  const [showDepositSettings, setShowDepositSettings] = useState(false);
  const [depositsPagination, setDepositsPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 20
  });
  const [withdrawalsPagination, setWithdrawalsPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 20
  });

  useEffect(() => {
    // Check URL parameters for tab selection
    const tabParam = searchParams.get('tab');
    if (tabParam === 'deposits' || tabParam === 'withdrawals') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === 'deposits') {
      fetchDeposits();
    } else {
      fetchWithdrawals();
    }
  }, [activeTab]);

  const fetchDeposits = async (page = 0, filters: FilterOptions = {}) => {
    try {
      setLoading(true);
      const response = await apiService.getFilteredDeposits({
        ...filters,
        page,
        size: 20
      });
      setDeposits(response.data.content);
      setDepositsPagination({
        currentPage: response.data.number,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
        size: response.data.size
      });
    } catch (error: any) {
      console.error('Failed to fetch deposits:', error);
      toast.error('Failed to load deposits');
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawals = async (page = 0, filters: FilterOptions = {}) => {
    try {
      setLoading(true);
      const response = await apiService.getFilteredWithdrawals({
        ...filters,
        page,
        size: 20
      });
      setWithdrawals(response.data.content);
      setWithdrawalsPagination({
        currentPage: response.data.number,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
        size: response.data.size
      });
    } catch (error: any) {
      console.error('Failed to fetch withdrawals:', error);
      toast.error('Failed to load withdrawals');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: FilterOptions) => {
    setCurrentFilters(filters);
    if (activeTab === 'deposits') {
      fetchDeposits(0, filters);
    } else {
      fetchWithdrawals(0, filters);
    }
  };

  const handleClearFilters = () => {
    setCurrentFilters({});
    if (activeTab === 'deposits') {
      fetchDeposits();
    } else {
      fetchWithdrawals();
    }
  };

  const handlePageChange = (page: number) => {
    if (activeTab === 'deposits') {
      fetchDeposits(page, currentFilters);
    } else {
      fetchWithdrawals(page, currentFilters);
    }
  };

  const handleConfirmDeposit = async (depositId: number) => {
    try {
      const response = await apiService.confirmDeposit(depositId, 'Confirmed by admin');
      toast.success('Deposit confirmed successfully');
      fetchDeposits(depositsPagination.currentPage, currentFilters);
    } catch (error: any) {
      console.error('Error confirming deposit:', error);
      console.error('Error response:', error.response);
      toast.error(error.response?.data || 'Failed to confirm deposit');
    }
  };

  const handleRejectDeposit = async (depositId: number) => {
    try {
      await apiService.rejectDeposit(depositId, 'Rejected by admin');
      toast.success('Deposit rejected');
      fetchDeposits(depositsPagination.currentPage, currentFilters);
    } catch (error: any) {
      toast.error(error.response?.data || 'Failed to reject deposit');
    }
  };

  const handleApproveWithdrawal = async (withdrawalId: number) => {
    try {
      await apiService.approveWithdrawal(withdrawalId, 'Approved by admin', 'TX_' + Date.now());
      toast.success('Withdrawal approved successfully');
      fetchWithdrawals(withdrawalsPagination.currentPage, currentFilters);
    } catch (error: any) {
      toast.error(error.response?.data || 'Failed to approve withdrawal');
    }
  };

  const handleRejectWithdrawal = async (withdrawalId: number) => {
    try {
      await apiService.rejectWithdrawal(withdrawalId, 'Rejected by admin');
      toast.success('Withdrawal rejected');
      fetchWithdrawals(withdrawalsPagination.currentPage, currentFilters);
    } catch (error: any) {
      toast.error(error.response?.data || 'Failed to reject withdrawal');
    }
  };



  const handleQuickFilter = (filters: FilterOptions) => {
    setCurrentFilters(filters);
    setActiveQuickFilter(Object.keys(filters).length === 0 ? 'all' : 
      filters.status === 'PENDING' ? 'pending' :
      filters.status === 'CONFIRMED' || filters.status === 'COMPLETED' ? 'confirmed' :
      filters.status === 'REJECTED' ? 'rejected' :
      filters.minAmount ? 'high-value' : 'all');
    
    if (activeTab === 'deposits') {
      fetchDeposits(0, filters);
    } else {
      fetchWithdrawals(0, filters);
    }
  };

  const formatCurrency = (value: string) => {
    return `$${parseFloat(value || '0').toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      'CONFIRMED': { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed' },
      'REJECTED': { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      'APPROVED': { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      'COMPLETED': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['PENDING'];
    
    return (
      <span className={`px-2 py-1 text-xs font-medium ${config.bg} ${config.text} rounded-full`}>
        {config.label}
      </span>
    );
  };

  const depositColumns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true
    },
    {
      key: 'username',
      label: 'Username',
      render: (value: string) => (
        <span className="font-medium text-gray-900">{value}</span>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value: string) => (
        <span className="font-medium text-green-600">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'transactionHash',
      label: 'Transaction Hash',
      render: (value: string) => (
        <div className="font-mono text-sm">
          {value.length > 20 ? `${value.substring(0, 20)}...` : value}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => getStatusBadge(value)
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value: string) => formatDate(value)
    }
  ];

  const withdrawalColumns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true
    },
    {
      key: 'username',
      label: 'Username',
      render: (value: string) => (
        <span className="font-medium text-gray-900">{value}</span>
      )
    },
    {
      key: 'requestedAmount',
      label: 'Requested',
      sortable: true,
      render: (value: string) => (
        <span className="font-medium text-blue-600">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'finalAmount',
      label: 'Final Amount',
      render: (value: string) => (
        <span className="font-medium text-green-600">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'feeAmount',
      label: 'Fee',
      render: (value: string) => (
        <span className="text-red-600">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'walletAddress',
      label: 'Wallet',
      render: (value: string) => (
        <WalletAddress address={value} />
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => getStatusBadge(value)
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value: string) => formatDate(value)
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
          <p className="text-gray-600 mt-2">Manage deposits, withdrawals, and transactions with advanced filtering</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowDepositSettings(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Settings className="h-4 w-4 mr-2" />
            Deposit Settings
          </button>
          <button
            onClick={() => setFilterExpanded(!filterExpanded)}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Filter className="h-4 w-4 mr-2" />
            {filterExpanded ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button
            onClick={() => activeTab === 'deposits' ? fetchDeposits(0, currentFilters) : fetchWithdrawals(0, currentFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Deposit Settings Modal */}
      {showDepositSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl">
            <DepositSettings onClose={() => setShowDepositSettings(false)} />
          </div>
        </div>
      )}

      {/* Advanced Filter */}
      {filterExpanded && (
        <AdvancedFilter
          type={activeTab}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          isExpanded={filterExpanded}
          onToggleExpanded={() => setFilterExpanded(!filterExpanded)}
        />
      )}

      {/* Quick Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Quick Filters</h3>
        <QuickFilter
          type={activeTab}
          onQuickFilter={handleQuickFilter}
          activeFilter={activeQuickFilter}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Deposits"
          value={deposits.length.toString()}
          icon={TrendingUp}
          iconColor="text-green-600"
          change={`${deposits.filter(d => d.status === 'CONFIRMED').length} confirmed`}
          changeType="increase"
        />
        <StatCard
          title="Total Withdrawals"
          value={withdrawals.length.toString()}
          icon={TrendingDown}
          iconColor="text-orange-600"
          change={`${withdrawals.filter(w => w.status === 'COMPLETED').length} completed`}
          changeType="neutral"
        />
        <StatCard
          title="Total Deposit Value"
          value={formatCurrency(
            deposits.reduce((sum, deposit) => sum + parseFloat(deposit.amount), 0).toString()
          )}
          icon={DollarSign}
          iconColor="text-green-600"
          change="Filtered amount"
          changeType="neutral"
        />
        <StatCard
          title="Total Withdrawal Value"
          value={formatCurrency(
            withdrawals.reduce((sum, withdrawal) => sum + parseFloat(withdrawal.requestedAmount), 0).toString()
          )}
          icon={BarChart3}
          iconColor="text-blue-600"
          change="Filtered amount"
          changeType="neutral"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => {
                setActiveTab('deposits');
                setSearchParams({ tab: 'deposits' });
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'deposits'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Deposits ({deposits.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('withdrawals');
                setSearchParams({ tab: 'withdrawals' });
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'withdrawals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Withdrawals ({withdrawals.length})
            </button>
          </div>
        </div>

        {/* Deposits Tab */}
        {activeTab === 'deposits' && (
          <div className="p-6">
            <DataTable
              data={deposits}
              columns={depositColumns}
              loading={loading}
              pagination={{
                currentPage: depositsPagination.currentPage,
                totalPages: depositsPagination.totalPages,
                totalElements: depositsPagination.totalElements,
                size: depositsPagination.size,
                onPageChange: handlePageChange
              }}
              actions={(deposit: Deposit) => (
                <div className="flex items-center space-x-2">
                  {deposit.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleConfirmDeposit(deposit.id)}
                        className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors duration-200"
                        title="Confirm Deposit"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Confirm
                      </button>
                      <button
                        onClick={() => handleRejectDeposit(deposit.id)}
                        className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors duration-200"
                        title="Reject Deposit"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              )}
            />
          </div>
        )}

        {/* Withdrawals Tab */}
        {activeTab === 'withdrawals' && (
          <div className="p-6">
            <DataTable
              data={withdrawals}
              columns={withdrawalColumns}
              loading={loading}
              pagination={{
                currentPage: withdrawalsPagination.currentPage,
                totalPages: withdrawalsPagination.totalPages,
                totalElements: withdrawalsPagination.totalElements,
                size: withdrawalsPagination.size,
                onPageChange: handlePageChange
              }}
              actions={(withdrawal: Withdrawal) => (
                <div className="flex items-center space-x-2">
                  {withdrawal.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleApproveWithdrawal(withdrawal.id)}
                        className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors duration-200"
                        title="Approve Withdrawal"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectWithdrawal(withdrawal.id)}
                        className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors duration-200"
                        title="Reject Withdrawal"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialManagement;
