import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import apiService from '../services/apiService';
import { toast } from 'react-toastify';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  activatedAccounts: number;
  totalDeposits: string;
  totalWithdrawals: string;
  netBalance: string;
  pendingDeposits: number;
  pendingWithdrawals: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse] = await Promise.all([
        apiService.getAdminStats(),
        // You can add more API calls here for additional dashboard data
      ]);

      setStats(statsResponse.data);
    } catch (error: any) {
      console.error('Dashboard data fetch error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load dashboard data</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: string) => {
    return `$${parseFloat(value || '0').toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome to Proxoma Admin Dashboard</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-sm text-gray-600">
            <Activity className="h-4 w-4 mr-1 text-green-500" />
            System Online
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change="+12% from last month"
          changeType="increase"
          icon={Users}
          iconColor="text-blue-600"
          trend={[65, 78, 83, 92, 95, 88, 98]}
        />

        <StatCard
          title="Active Users"
          value={stats.activeUsers.toLocaleString()}
          change={`${((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of total`}
          changeType="neutral"
          icon={CheckCircle}
          iconColor="text-green-600"
          trend={[45, 52, 48, 61, 68, 71, 75]}
        />

        <StatCard
          title="Total Deposits"
          value={formatCurrency(stats.totalDeposits)}
          change="+8.2% this week"
          changeType="increase"
          icon={TrendingUp}
          iconColor="text-emerald-600"
          trend={[40, 42, 45, 47, 52, 55, 58]}
        />

        <StatCard
          title="Net Balance"
          value={formatCurrency(stats.netBalance)}
          change="Deposits - Withdrawals"
          changeType="neutral"
          icon={DollarSign}
          iconColor="text-purple-600"
          trend={[30, 35, 32, 38, 41, 43, 45]}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Activated Accounts"
          value={stats.activatedAccounts.toLocaleString()}
          change={`${((stats.activatedAccounts / stats.totalUsers) * 100).toFixed(1)}% activated`}
          changeType="increase"
          icon={CheckCircle}
          iconColor="text-green-600"
        />

        <StatCard
          title="Total Withdrawals"
          value={formatCurrency(stats.totalWithdrawals)}
          change="-5.3% this week"
          changeType="decrease"
          icon={TrendingDown}
          iconColor="text-red-600"
        />

        <StatCard
          title="Pending Deposits"
          value={stats.pendingDeposits.toLocaleString()}
          change="Requires attention"
          changeType={stats.pendingDeposits > 0 ? 'decrease' : 'neutral'}
          icon={Clock}
          iconColor="text-yellow-600"
        />

        <StatCard
          title="Pending Withdrawals"
          value={stats.pendingWithdrawals.toLocaleString()}
          change="Awaiting approval"
          changeType={stats.pendingWithdrawals > 0 ? 'decrease' : 'neutral'}
          icon={AlertCircle}
          iconColor="text-orange-600"
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/users')}
              className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 cursor-pointer"
            >
              <Users className="h-5 w-5 mr-2" />
              Manage Users
            </button>
            <button 
              onClick={() => navigate('/finance')}
              className="flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200 cursor-pointer"
            >
              <DollarSign className="h-5 w-5 mr-2" />
              Financial Overview
            </button>
            <button 
              onClick={() => navigate('/finance?tab=deposits')}
              className="flex items-center justify-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors duration-200 cursor-pointer"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Approve Deposits
            </button>
            <button 
              onClick={() => navigate('/finance?tab=withdrawals')}
              className="flex items-center justify-center p-4 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors duration-200 cursor-pointer"
            >
              <Clock className="h-5 w-5 mr-2" />
              Process Withdrawals
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-900">Database</span>
              </div>
              <span className="text-sm text-green-600">Online</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-900">API Services</span>
              </div>
              <span className="text-sm text-green-600">Operational</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-900">Background Jobs</span>
              </div>
              <span className="text-sm text-yellow-600">Processing</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-900">WebSocket</span>
              </div>
              <span className="text-sm text-blue-600">Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
        </div>
        <div className="space-y-3">
          {[
            { action: 'New user registration', user: 'john_doe', time: '2 minutes ago', type: 'success' },
            { action: 'Deposit confirmed', amount: '$500', time: '5 minutes ago', type: 'success' },
            { action: 'Withdrawal pending', amount: '$250', time: '12 minutes ago', type: 'warning' },
            { action: 'Plan upgraded', user: 'sarah_smith', time: '25 minutes ago', type: 'info' },
            { action: 'Support ticket created', user: 'mike_jones', time: '1 hour ago', type: 'neutral' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' :
                  activity.type === 'info' ? 'bg-blue-500' : 'bg-gray-400'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">
                    {activity.user && `User: ${activity.user}`}
                    {activity.amount && `Amount: ${activity.amount}`}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;