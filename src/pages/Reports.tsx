import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  Activity
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import apiService from '../services/apiService';
import { toast } from 'react-toastify';

interface ReportData {
  totalUsers: number;
  newUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  netFlow: number;
  period: string;
}

const Reports: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(7);

  useEffect(() => {
    fetchReports();
  }, [selectedPeriod]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDetailedReports(selectedPeriod);
      
      // The API service returns AxiosResponse, so we need to access response.data
      if (response && response.data) {
        setReportData(response.data);
      } else {
        console.error('Invalid response format:', response);
        toast.error('Invalid response format from server');
      }
    } catch (error: any) {
      console.error('Failed to fetch reports:', error);
      toast.error(error.response?.data || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value || '0') : value;
    return `$${numValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const exportReport = () => {
    if (!reportData) return;

    const csvContent = `
Period,Total Users,New Users,Total Deposits,Total Withdrawals,Net Flow
${reportData.period},${reportData.totalUsers},${reportData.newUsers},${reportData.totalDeposits},${reportData.totalWithdrawals},${reportData.netFlow}
    `.trim();

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proxoma-report-${selectedPeriod}days-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Report exported successfully');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Comprehensive platform analytics and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
          <button
            onClick={exportReport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={fetchReports}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Period Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Report Period</h3>
            <p className="text-gray-600 mt-1">
              Showing data for the {reportData?.period || `last ${selectedPeriod} days`}
            </p>
          </div>
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      {reportData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={reportData.totalUsers.toLocaleString()}
            change="All time total"
            changeType="neutral"
            icon={Users}
            iconColor="text-blue-600"
          />

          <StatCard
            title="New Users"
            value={reportData.newUsers.toLocaleString()}
            change={`In ${selectedPeriod} days`}
            changeType="increase"
            icon={Activity}
            iconColor="text-green-600"
          />

          <StatCard
            title="Total Deposits"
            value={formatCurrency(reportData.totalDeposits)}
            change={`Period total`}
            changeType="increase"
            icon={TrendingUp}
            iconColor="text-emerald-600"
          />

          <StatCard
            title="Total Withdrawals"
            value={formatCurrency(reportData.totalWithdrawals)}
            change={`Period total`}
            changeType="neutral"
            icon={DollarSign}
            iconColor="text-purple-600"
          />
        </div>
      )}

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Growth Analysis</h3>
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          
          {reportData && (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">User Growth Rate</span>
                <span className="text-sm font-bold text-blue-600">
                  {reportData.totalUsers > 0 ? 
                    ((reportData.newUsers / reportData.totalUsers) * 100).toFixed(1) : 0}%
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Net Financial Flow</span>
                <span className="text-sm font-bold text-green-600">
                  {formatCurrency(reportData.netFlow)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Avg Deposit per User</span>
                <span className="text-sm font-bold text-purple-600">
                  {reportData.totalUsers > 0 ? 
                    formatCurrency(reportData.totalDeposits / reportData.totalUsers) : '$0'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
            <Activity className="h-5 w-5 text-green-600" />
          </div>
          
          <div className="space-y-4">
            {reportData && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Daily Avg New Users</span>
                  <span className="text-sm font-medium text-gray-900">
                    {(reportData.newUsers / selectedPeriod).toFixed(1)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Deposit/Withdrawal Ratio</span>
                  <span className="text-sm font-medium text-gray-900">
                    {reportData.totalWithdrawals > 0 ? 
                      (reportData.totalDeposits / reportData.totalWithdrawals).toFixed(2) : '∞'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Platform Activity Score</span>
                  <span className="text-sm font-medium text-green-600">
                    {Math.min(100, Math.round(((reportData.newUsers + reportData.totalDeposits / 1000) / selectedPeriod) * 10))}%
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Statistics</h3>
          <div className="flex space-x-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {selectedPeriod} Day Period
            </span>
          </div>
        </div>
        
        {reportData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{reportData.totalUsers}</div>
              <div className="text-sm text-gray-600 mt-1">Total Platform Users</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{reportData.newUsers}</div>
              <div className="text-sm text-gray-600 mt-1">New Registrations</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(reportData.totalDeposits)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Deposits</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(reportData.totalWithdrawals)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Withdrawals</div>
            </div>
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={exportReport}
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Download className="h-5 w-5 mr-2 text-green-600" />
            <span>Export CSV</span>
          </button>
          
          <button
            onClick={() => toast.info('PDF export coming soon')}
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Download className="h-5 w-5 mr-2 text-red-600" />
            <span>Export PDF</span>
          </button>
          
          <button
            onClick={() => toast.info('Advanced reports coming soon')}
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            <span>Advanced Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;