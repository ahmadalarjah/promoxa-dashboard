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
  Activity,
  BarChart3,
  Shield,
  Settings,
  Bell,
  Eye,
  ArrowUpRight,
  ArrowDownRight
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

interface RecentActivity {
  id: string;
  action: string;
  user?: string;
  amount?: string;
  time: string;
  type: 'success' | 'warning' | 'info' | 'neutral' | 'error';
  icon: React.ComponentType<any>;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [systemAlerts, setSystemAlerts] = useState([
    { id: 1, type: 'info', message: 'System maintenance scheduled for tomorrow at 2 AM', time: '2 hours ago' },
    { id: 2, type: 'warning', message: 'High withdrawal volume detected', time: '4 hours ago' },
    { id: 3, type: 'success', message: 'Database backup completed successfully', time: '6 hours ago' }
  ]);

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

      {/* Quick Actions & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/users')}
              className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 cursor-pointer group"
            >
              <Users className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Manage Users</span>
            </button>
            <button 
              onClick={() => navigate('/finance')}
              className="flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200 cursor-pointer group"
            >
              <DollarSign className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Financial Overview</span>
            </button>
            <button 
              onClick={() => navigate('/finance?tab=deposits')}
              className="flex items-center justify-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors duration-200 cursor-pointer group"
            >
              <CheckCircle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Approve Deposits</span>
            </button>
            <button 
              onClick={() => navigate('/finance?tab=withdrawals')}
              className="flex items-center justify-center p-4 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors duration-200 cursor-pointer group"
            >
              <Clock className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Process Withdrawals</span>
            </button>
            <button 
              onClick={() => navigate('/plans')}
              className="flex items-center justify-center p-4 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors duration-200 cursor-pointer group"
            >
              <BarChart3 className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Manage Plans</span>
            </button>
            <button 
              onClick={() => navigate('/support')}
              className="flex items-center justify-center p-4 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-200 cursor-pointer group"
            >
              <Shield className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Support Tickets</span>
            </button>
          </div>
        </div>

        {/* System Status & Alerts */}
        <div className="space-y-6">
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

          {/* System Alerts */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className={`flex items-center justify-between p-3 rounded-lg ${
                  alert.type === 'warning' ? 'bg-yellow-50' :
                  alert.type === 'success' ? 'bg-green-50' :
                  alert.type === 'error' ? 'bg-red-50' : 'bg-blue-50'
                }`}>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      alert.type === 'warning' ? 'bg-yellow-500' :
                      alert.type === 'success' ? 'bg-green-500' :
                      alert.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900">{alert.message}</span>
                  </div>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              View All
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { action: 'New user registration', user: 'john_doe', time: '2 minutes ago', type: 'success', icon: Users },
              { action: 'Deposit confirmed', amount: '$500', time: '5 minutes ago', type: 'success', icon: CheckCircle },
              { action: 'Withdrawal pending', amount: '$250', time: '12 minutes ago', type: 'warning', icon: Clock },
              { action: 'Plan upgraded', user: 'sarah_smith', time: '25 minutes ago', type: 'info', icon: TrendingUp },
              { action: 'Support ticket created', user: 'mike_jones', time: '1 hour ago', type: 'neutral', icon: Bell }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-3 ${
                    activity.type === 'success' ? 'bg-green-100 text-green-600' :
                    activity.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    activity.type === 'info' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
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

        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <ArrowUpRight className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">User Growth</p>
                  <p className="text-xs text-gray-500">This month</p>
                </div>
              </div>
              <span className="text-lg font-bold text-blue-600">+12.5%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Revenue</p>
                  <p className="text-xs text-gray-500">This week</p>
                </div>
              </div>
              <span className="text-lg font-bold text-green-600">+8.2%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Conversion Rate</p>
                  <p className="text-xs text-gray-500">Overall</p>
                </div>
              </div>
              <span className="text-lg font-bold text-purple-600">3.2%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center">
                <ArrowDownRight className="h-5 w-5 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Churn Rate</p>
                  <p className="text-xs text-gray-500">This month</p>
                </div>
              </div>
              <span className="text-lg font-bold text-orange-600">-2.1%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
