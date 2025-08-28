import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  UserPlus, 
  DollarSign, 
  Search, 
  ChevronDown, 
  ChevronRight,
  Crown,
  Star,
  Activity,
  Calendar,
  TreePine,
  Network,
  BarChart3,
  Target,
  Award,
  Eye
} from 'lucide-react';
import apiService from '../services/apiService';
import { toast } from 'react-toastify';

interface ReferralTreeDto {
  id: number;
  username: string;
  fullName: string;
  referralCode: string;
  phoneNumber: string;
  email: string;
  totalEarnings: number;
  referralEarnings: number;
  balance: number;
  currentPlanName: string;
  isAccountActivated: boolean;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string;
  directReferralsCount: number;
  totalReferralsCount: number;
  totalReferralEarnings: number;
  referrerUsername: string;
  referrerFullName: string;
  directReferrals: ReferralTreeDto[];
  indirectReferrals: ReferralTreeDto[];
  totalDeposits: number;
  totalDepositAmount: number;
  totalWithdrawals: number;
  totalWithdrawalAmount: number;
  totalTasksCompleted: number;
  totalTaskEarnings: number;
}

interface ReferralStatistics {
  totalUsers: number;
  usersWithReferrals: number;
  usersWhoRefer: number;
  totalReferralEarnings: number;
  avgReferralsPerUser: number;
  topReferrer: string;
  topReferrerCount: number;
}

const ReferralManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<ReferralTreeDto | null>(null);
  const [allReferralTrees, setAllReferralTrees] = useState<ReferralTreeDto[]>([]);
  const [topReferrers, setTopReferrers] = useState<ReferralTreeDto[]>([]);
  const [statistics, setStatistics] = useState<ReferralStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedUsers, setExpandedUsers] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allTreesRes, topReferrersRes, statsRes] = await Promise.all([
        apiService.getAllReferralTrees(),
        apiService.getTopReferrers(10),
        apiService.getReferralStatistics()
      ]);

      setAllReferralTrees(allTreesRes.data);
      setTopReferrers(topReferrersRes.data);
      setStatistics(statsRes.data);
    } catch (error) {
      toast.error('Failed to load referral data');
      console.error('Error loading referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await apiService.getReferralTreeByUsername(searchQuery);
      setSelectedUser(response.data);
      setActiveTab('user-tree');
    } catch (error) {
      toast.error('User not found');
      console.error('Error searching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserExpansion = (userId: number) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderUserCard = (user: ReferralTreeDto, level: number = 0) => {
    const isExpanded = expandedUsers.has(user.id);
    const hasChildren = user.directReferrals && user.directReferrals.length > 0;

    return (
      <div key={user.id} className="space-y-2">
        <div className={`bg-white p-6 rounded-lg shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
          level === 0 ? 'border-blue-500' : 
          level === 1 ? 'border-l-4 border-green-500' : 
          'border-l-4 border-orange-500'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {hasChildren && (
                  <button
                    onClick={() => toggleUserExpansion(user.id)}
                    className="p-1 h-6 w-6 hover:bg-gray-100 rounded"
                  >
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                )}
                <div className="flex items-center space-x-2">
                  {level === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                  {user.totalReferralsCount > 5 && <Star className="h-4 w-4 text-blue-500" />}
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-lg">{user.fullName}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {user.isAccountActivated && (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 border border-green-300">
                      Activated
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">@{user.username}</p>
                <p className="text-xs text-gray-500">Code: {user.referralCode}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Direct</p>
                  <p className="text-lg font-bold text-blue-600">{user.directReferralsCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-lg font-bold text-green-600">{user.totalReferralsCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Earnings</p>
                  <p className="text-lg font-bold text-purple-600">{formatCurrency(user.referralEarnings)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span>Balance: {formatCurrency(user.balance)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <span>Tasks: {user.totalTasksCompleted}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-orange-600" />
              <span>Joined: {formatDate(user.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-red-600" />
              <span>Plan: {user.currentPlanName || 'None'}</span>
            </div>
          </div>

          {user.referrerUsername && (
            <div className="mt-3 p-2 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Referred by: <span className="font-medium">{user.referrerFullName}</span> (@{user.referrerUsername})
              </p>
            </div>
          )}
        </div>

        {isExpanded && hasChildren && (
          <div className="ml-8 space-y-2">
            {user.directReferrals.map(child => renderUserCard(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderStatistics = () => {
    if (!statistics) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Users</p>
              <p className="text-3xl font-bold">{statistics.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Users with Referrals</p>
              <p className="text-3xl font-bold">{statistics.usersWithReferrals}</p>
            </div>
            <UserPlus className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Referral Earnings</p>
              <p className="text-3xl font-bold">{formatCurrency(statistics.totalReferralEarnings)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Avg Referrals/User</p>
              <p className="text-3xl font-bold">{statistics.avgReferralsPerUser.toFixed(1)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-200" />
          </div>
        </div>
      </div>
    );
  };

  const renderTopReferrers = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Award className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">Top Referrers</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topReferrers.map((user, index) => (
            <div key={user.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  {index === 0 && (
                    <Crown className="absolute -top-1 -right-1 h-5 w-5 text-yellow-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{user.fullName}</h3>
                  <p className="text-sm text-gray-600">@{user.username}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Referrals:</span>
                  <span className="font-semibold text-blue-600">{user.totalReferralsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Direct Referrals:</span>
                  <span className="font-semibold text-green-600">{user.directReferralsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Referral Earnings:</span>
                  <span className="font-semibold text-purple-600">{formatCurrency(user.referralEarnings)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Network className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Referral Management</h1>
            <p className="text-gray-600">Manage and monitor user referral networks</p>
          </div>
        </div>
        
        <button
          onClick={loadData}
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 flex items-center space-x-2"
        >
          <BarChart3 className="h-4 w-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('user-tree')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'user-tree'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <TreePine className="h-4 w-4" />
              <span>User Tree</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('top-referrers')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'top-referrers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>Top Referrers</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'search'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Search User</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <>
            {renderStatistics()}
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-5 w-5" />
                <h2 className="text-xl font-semibold">All Users Referral Overview</h2>
              </div>
              <div className="space-y-4">
                {allReferralTrees.slice(0, 10).map(user => renderUserCard(user))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'user-tree' && (
          <>
            {selectedUser ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Referral Tree for {selectedUser.fullName}</h2>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Clear Selection
                  </button>
                </div>
                {renderUserCard(selectedUser)}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <TreePine className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No User Selected</h3>
                <p className="text-gray-600">Search for a user to view their referral tree</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'top-referrers' && renderTopReferrers()}

        {activeTab === 'search' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Search User Referral Tree</h2>
            </div>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Enter username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUserSearch()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleUserSearch}
                disabled={loading || !searchQuery.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralManagement;
