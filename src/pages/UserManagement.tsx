import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Shield, 
  ShieldOff, 
  Ban, 
  CheckCircle,
  XCircle,
  Wallet,
  DollarSign
} from 'lucide-react';
import DataTable from '../components/common/DataTable';
import apiService from '../services/apiService';
import { toast } from 'react-toastify';

interface BanModalProps {
  user: User;
  onBan: (userId: number, reason: string, days?: number) => void;
  onCancel: () => void;
}

interface WalletModalProps {
  user: User;
  onUpdate: (userId: number, walletAddress: string, reason?: string) => void;
  onCancel: () => void;
}

interface BalanceModalProps {
  user: User;
  onUpdate: (userId: number, newBalance: number, reason?: string) => void;
  onCancel: () => void;
}

const BanModal: React.FC<BanModalProps> = ({ user, onBan, onCancel }) => {
  const [reason, setReason] = useState('');
  const [days, setDays] = useState<number | undefined>(undefined);
  const [isPermanent, setIsPermanent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error('Please provide a ban reason');
      return;
    }

    setLoading(true);
    try {
      await onBan(user.id, reason.trim(), isPermanent ? undefined : days);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ban Reason *
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter the reason for banning this user..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ban Duration
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              checked={isPermanent}
              onChange={() => setIsPermanent(true)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Permanent Ban</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={!isPermanent}
              onChange={() => setIsPermanent(false)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Temporary Ban</span>
          </label>
        </div>
      </div>

      {!isPermanent && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (days)
          </label>
          <input
            type="number"
            value={days || ''}
            onChange={(e) => setDays(e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Enter number of days"
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      )}

      <div className="flex items-center justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !reason.trim()}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Banning...' : 'Ban User'}
        </button>
      </div>
    </form>
  );
};

const WalletModal: React.FC<WalletModalProps> = ({ user, onUpdate, onCancel }) => {
  const [walletAddress, setWalletAddress] = useState(user.walletAddress || '');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress.trim()) {
      toast.error('Please provide a wallet address');
      return;
    }

    setLoading(true);
    try {
      await onUpdate(user.id, walletAddress.trim(), reason.trim() || undefined);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Wallet Address
        </label>
        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
          {user.walletAddress || 'No wallet address set'}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          New Wallet Address *
        </label>
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Enter new wallet address..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reason for Change (Optional)
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for wallet address change..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={2}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Wallet'}
        </button>
      </div>
    </form>
  );
};

const BalanceModal: React.FC<BalanceModalProps> = ({ user, onUpdate, onCancel }) => {
  const [newBalance, setNewBalance] = useState(parseFloat(user.balance || '0').toString());
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const balanceValue = parseFloat(newBalance);
    if (isNaN(balanceValue) || balanceValue < 0) {
      toast.error('Please provide a valid balance amount');
      return;
    }

    setLoading(true);
    try {
      await onUpdate(user.id, balanceValue, reason.trim() || undefined);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Balance
        </label>
        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
          ${parseFloat(user.balance || '0').toFixed(2)}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          New Balance *
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={newBalance}
          onChange={(e) => setNewBalance(e.target.value)}
          placeholder="Enter new balance amount..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reason for Change (Optional)
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for balance change..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          rows={2}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Balance'}
        </button>
      </div>
    </form>
  );
};

interface User {
  id: number;
  username: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  balance: string;
  totalEarnings: string;
  referralEarnings: string;
  withdrawableAmount: string;
  walletAddress: string;
  currentPlanName: string | null;
  isActive: boolean;
  isAccountActivated: boolean;
  isBanned: boolean;
  banExpiry: string | null;
  banReason: string | null;
  createdAt: string;
  lastLoginAt: string | null;
  directReferralsCount: number;
}

interface PaginationData {
  content: User[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 20
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllUsers(
        pagination.currentPage,
        pagination.size
      );

      const data: PaginationData = response.data;
      

      
      setUsers(data.content);
      setFilteredUsers(data.content);
      setPagination({
        currentPage: data.number,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        size: data.size
      });
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    const filtered = users.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.fullName.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredUsers(filtered);
  };



  const handleActivateUser = async (userId: number) => {
    try {
      await apiService.activateUser(userId);
      toast.success('User activated successfully');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data || 'Failed to activate user');
    }
  };

  const handleDeactivateUser = async (userId: number) => {
    try {
      await apiService.deactivateUser(userId);
      toast.success('User deactivated successfully');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data || 'Failed to deactivate user');
    }
  };

  const handleBanUser = async (userId: number, reason: string, days?: number) => {
    try {
      await apiService.banUser(userId, reason, days);
      toast.success('User banned successfully');
      setShowBanModal(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data || 'Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId: number) => {
    try {
      await apiService.unbanUser(userId);
      toast.success('User unbanned successfully');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data || 'Failed to unban user');
    }
  };

  const handleUpdateWallet = async (userId: number, walletAddress: string, reason?: string) => {
    try {
      await apiService.updateUserWallet(userId, walletAddress, reason);
      toast.success('Wallet address updated successfully');
      setShowWalletModal(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data || 'Failed to update wallet address');
    }
  };

  const handleUpdateBalance = async (userId: number, newBalance: number, reason?: string) => {
    try {
      await apiService.updateUserBalance(userId, newBalance);
      toast.success('User balance updated successfully');
      setShowBalanceModal(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data || 'Failed to update user balance');
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

  const getStatusBadge = (user: User) => {
    if (user.isBanned) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Banned</span>;
    }
    if (!user.isActive) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Inactive</span>;
    }
    if (!user.isAccountActivated) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Pending</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>;
  };

  const columns = [
    {
      key: 'username',
      label: 'User',
      sortable: true,
      render: (value: string, row: User) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.fullName}</div>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Contact',
      render: (value: string, row: User) => (
        <div>
          <div className="text-sm text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.phoneNumber}</div>
        </div>
      )
    },
    {
      key: 'balance',
      label: 'Balance',
      sortable: true,
      render: (value: string) => (
        <span className="font-medium text-green-600">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'totalEarnings',
      label: 'Total Earnings',
      render: (value: string) => formatCurrency(value)
    },
    {
      key: 'currentPlanName',
      label: 'Plan',
      render: (value: string) => value || 'No Plan'
    },
    {
      key: 'directReferralsCount',
      label: 'Referrals',
      render: (value: number) => value.toString()
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value: boolean, row: User) => getStatusBadge(row)
    },
    {
      key: 'banReason',
      label: 'Ban Info',
      render: (value: string, row: User) => {
        if (!row.isBanned) return <span className="text-gray-400">-</span>;
        return (
          <div className="text-xs">
            <div className="text-red-600 font-medium">{row.banReason}</div>
            {row.banExpiry && (
              <div className="text-gray-500">
                Expires: {formatDate(row.banExpiry)}
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: 'createdAt',
      label: 'Joined',
      sortable: true,
      render: (value: string) => formatDate(value)
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage users, accounts, and permissions</p>
          {searchQuery && (
            <p className="text-sm text-blue-600 mt-1">
              Showing {filteredUsers.length} of {users.length} users matching "{searchQuery}"
            </p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </button>
          <button
            onClick={fetchUsers}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Search className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.isActive && u.isAccountActivated).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Activation</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => !u.isAccountActivated).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Ban className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Banned Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.isBanned).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <DataTable
        data={filteredUsers}
        columns={columns}
        loading={loading}
        pagination={{
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          totalElements: pagination.totalElements,
          size: pagination.size,
          onPageChange: handlePageChange
        }}
        searchable
        onSearch={handleSearch}
        actions={(user: User) => {

          
          return (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setSelectedUser(user);
                  setShowBalanceModal(true);
                }}
                className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
                title="Update Balance"
              >
                <DollarSign className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setSelectedUser(user);
                  setShowWalletModal(true);
                }}
                className="p-1 text-gray-400 hover:text-purple-600 transition-colors duration-200"
                title="Update Wallet Address"
              >
                <Wallet className="h-4 w-4" />
              </button>
              {user.isBanned ? (
                <button
                  onClick={() => handleUnbanUser(user.id)}
                  className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
                  title="Unban User"
                >
                  <CheckCircle className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setShowBanModal(true);
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                  title="Ban User"
                >
                  <Ban className="h-4 w-4" />
                </button>
              )}
              {user.isActive ? (
                <button
                  onClick={() => handleDeactivateUser(user.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                  title="Deactivate User"
                >
                  <ShieldOff className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => handleActivateUser(user.id)}
                  className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
                  title="Activate User"
                >
                  <Shield className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        }}
      />

      {/* Modals will be implemented as needed */}
      {/* Edit Modal, Balance Modal, Ban Modal, etc. */}

      {/* Ban Modal */}
      {showBanModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Ban User</h3>
              <p className="text-sm text-gray-600 mt-1">
                Ban user: <span className="font-medium">{selectedUser.username}</span>
              </p>
            </div>
            
            <BanModal
              user={selectedUser}
              onBan={handleBanUser}
              onCancel={() => setShowBanModal(false)}
            />
          </div>
        </div>
      )}

      {/* Wallet Modal */}
      {showWalletModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Update Wallet Address</h3>
              <p className="text-sm text-gray-600 mt-1">
                Update wallet for: <span className="font-medium">{selectedUser.username}</span>
              </p>
            </div>
            
            <WalletModal
              user={selectedUser}
              onUpdate={handleUpdateWallet}
              onCancel={() => setShowWalletModal(false)}
            />
          </div>
        </div>
      )}

      {/* Balance Modal */}
      {showBalanceModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Update User Balance</h3>
              <p className="text-sm text-gray-600 mt-1">
                Update balance for: <span className="font-medium">{selectedUser.username}</span>
              </p>
            </div>
            
            <BalanceModal
              user={selectedUser}
              onUpdate={handleUpdateBalance}
              onCancel={() => setShowBalanceModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;