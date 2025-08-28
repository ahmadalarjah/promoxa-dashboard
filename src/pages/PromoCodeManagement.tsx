import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Users,
  DollarSign,
  Calendar,
  Loader2,
  AlertCircle
} from 'lucide-react';
import apiService from '../services/apiService';
import { toast } from 'react-toastify';

interface PromoCode {
  id: number;
  code: string;
  type: 'ACCOUNT_ACTIVATION' | 'BONUS_MONEY' | 'SPECIAL_OFFER';
  bonusAmount?: number;
  activatesAccount: boolean;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
}

interface CreatePromoCodeRequest {
  code: string;
  type: string;
  bonusAmount?: number;
  activatesAccount: boolean;
  usageLimit: number;
  expiresAt?: string;
}

const PromoCodeManagement: React.FC = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form states
  const [formData, setFormData] = useState<CreatePromoCodeRequest>({
    code: '',
    type: 'BONUS_MONEY',
    bonusAmount: 0,
    activatesAccount: false,
    usageLimit: 1,
    expiresAt: ''
  });

  useEffect(() => {
    loadPromoCodes();
  }, []);

  const loadPromoCodes = async () => {
    try {
      const response = await apiService.getAllPromoCodes();
      if (response.data) {
        setPromoCodes(response.data);
      } else {
        toast.error('فشل في تحميل الأكواد الترويجية');
      }
    } catch (error: any) {
      console.error('Error loading promo codes:', error);
      toast.error(error.response?.data?.message || 'فشل في تحميل الأكواد الترويجية');
    } finally {
      setLoading(false);
    }
  };

  const createPromoCode = async () => {
    try {
      const response = await apiService.createPromoCode(formData);
      if (response.data) {
        setPromoCodes(prev => [response.data, ...prev]);
        setShowCreateModal(false);
        resetForm();
        toast.success('تم إنشاء الكود الترويجي بنجاح');
      } else {
        toast.error('فشل في إنشاء الكود الترويجي');
      }
    } catch (error: any) {
      console.error('Error creating promo code:', error);
      toast.error(error.response?.data?.message || 'فشل في إنشاء الكود الترويجي');
    }
  };

  const updatePromoCode = async () => {
    if (!selectedPromoCode) return;
    
    try {
      const response = await apiService.updatePromoCode(selectedPromoCode.id, formData);
      if (response.data) {
        setPromoCodes(prev => prev.map(promo => 
          promo.id === selectedPromoCode.id ? response.data : promo
        ));
        setShowEditModal(false);
        resetForm();
        toast.success('تم تحديث الكود الترويجي بنجاح');
      } else {
        toast.error('فشل في تحديث الكود الترويجي');
      }
    } catch (error: any) {
      console.error('Error updating promo code:', error);
      toast.error(error.response?.data?.message || 'فشل في تحديث الكود الترويجي');
    }
  };

  const togglePromoCodeStatus = async (promoCodeId: number, isActive: boolean) => {
    try {
      const response = await apiService.togglePromoCodeStatus(promoCodeId, isActive);
      if (response.data) {
        setPromoCodes(prev => prev.map(promo => 
          promo.id === promoCodeId ? response.data : promo
        ));
        toast.success(isActive ? 'تم تفعيل الكود الترويجي' : 'تم إلغاء تفعيل الكود الترويجي');
      } else {
        toast.error('فشل في تحديث حالة الكود الترويجي');
      }
    } catch (error: any) {
      console.error('Error toggling promo code status:', error);
      toast.error(error.response?.data?.message || 'فشل في تحديث حالة الكود الترويجي');
    }
  };

  const deletePromoCode = async (promoCodeId: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الكود الترويجي؟')) return;
    
    try {
      await apiService.deletePromoCode(promoCodeId);
      setPromoCodes(prev => prev.filter(promo => promo.id !== promoCodeId));
      toast.success('تم حذف الكود الترويجي بنجاح');
    } catch (error: any) {
      console.error('Error deleting promo code:', error);
      toast.error(error.response?.data?.message || 'فشل في حذف الكود الترويجي');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'BONUS_MONEY',
      bonusAmount: 0,
      activatesAccount: false,
      usageLimit: 1,
      expiresAt: ''
    });
  };

  const openEditModal = (promoCode: PromoCode) => {
    setSelectedPromoCode(promoCode);
    setFormData({
      code: promoCode.code,
      type: promoCode.type,
      bonusAmount: promoCode.bonusAmount || 0,
      activatesAccount: promoCode.activatesAccount,
      usageLimit: promoCode.usageLimit,
      expiresAt: promoCode.expiresAt ? promoCode.expiresAt.split('T')[0] : ''
    });
    setShowEditModal(true);
  };

  const openDetailsModal = (promoCode: PromoCode) => {
    setSelectedPromoCode(promoCode);
    setShowDetailsModal(true);
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BONUS_MONEY':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ACCOUNT_ACTIVATION':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'SPECIAL_OFFER':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredPromoCodes = promoCodes.filter(promo => 
    filterStatus === 'all' || 
    (filterStatus === 'active' && promo.isActive) ||
    (filterStatus === 'inactive' && !promo.isActive)
  );

  const stats = {
    total: promoCodes.length,
    active: promoCodes.filter(p => p.isActive).length,
    inactive: promoCodes.filter(p => !p.isActive).length,
    totalUsage: promoCodes.reduce((sum, p) => sum + p.usedCount, 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الأكواد الترويجية</h1>
          <p className="text-gray-600 mt-2">إنشاء وإدارة الأكواد الترويجية</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          إضافة كود ترويجي
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الأكواد</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Gift className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">مفعلة</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">غير مفعلة</p>
              <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الاستخدام</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalUsage}</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">تصفية حسب الحالة:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">جميع الأكواد</option>
            <option value="active">مفعلة</option>
            <option value="inactive">غير مفعلة</option>
          </select>
        </div>
      </div>

      {/* Promo Codes List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">الأكواد الترويجية</h2>
          
          {filteredPromoCodes.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد أكواد ترويجية</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPromoCodes.map((promoCode) => (
                <div key={promoCode.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 font-mono">{promoCode.code}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(promoCode.isActive)}`}>
                          {promoCode.isActive ? 'مفعل' : 'غير مفعل'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(promoCode.type)}`}>
                          {promoCode.type === 'BONUS_MONEY' && 'مكافأة مالية'}
                          {promoCode.type === 'ACCOUNT_ACTIVATION' && 'تفعيل الحساب'}
                          {promoCode.type === 'SPECIAL_OFFER' && 'عرض خاص'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        {promoCode.bonusAmount && (
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{promoCode.bonusAmount} USDT</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{promoCode.usedCount}/{promoCode.usageLimit} مستخدم</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(promoCode.createdAt)}</span>
                        </div>
                      </div>

                      {promoCode.expiresAt && (
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>ينتهي في: {formatDate(promoCode.expiresAt)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openDetailsModal(promoCode)}
                        className="flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        التفاصيل
                      </button>
                      
                      <button
                        onClick={() => openEditModal(promoCode)}
                        className="flex items-center px-3 py-1 text-sm text-yellow-600 hover:bg-yellow-50 rounded-md"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        تعديل
                      </button>
                      
                      <button
                        onClick={() => togglePromoCodeStatus(promoCode.id, !promoCode.isActive)}
                        className={`flex items-center px-3 py-1 text-sm rounded-md ${
                          promoCode.isActive 
                            ? 'text-red-600 hover:bg-red-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {promoCode.isActive ? (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            إلغاء التفعيل
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            تفعيل
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => deletePromoCode(promoCode.id)}
                        className="flex items-center px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">إضافة كود ترويجي جديد</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الكود</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="مثال: WELCOME2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="BONUS_MONEY">مكافأة مالية</option>
                    <option value="ACCOUNT_ACTIVATION">تفعيل الحساب</option>
                    <option value="SPECIAL_OFFER">عرض خاص</option>
                  </select>
                </div>

                {formData.type === 'BONUS_MONEY' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ (USDT)</label>
                    <input
                      type="number"
                      value={formData.bonusAmount}
                      onChange={(e) => setFormData({...formData, bonusAmount: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">حد الاستخدام</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({...formData, usageLimit: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الانتهاء (اختياري)</label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="activatesAccount"
                    checked={formData.activatesAccount}
                    onChange={(e) => setFormData({...formData, activatesAccount: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="activatesAccount" className="ml-2 block text-sm text-gray-900">
                    تفعيل الحساب
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  إلغاء
                </button>
                <button
                  onClick={createPromoCode}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  إنشاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedPromoCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">تعديل الكود الترويجي</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الكود</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="BONUS_MONEY">مكافأة مالية</option>
                    <option value="ACCOUNT_ACTIVATION">تفعيل الحساب</option>
                    <option value="SPECIAL_OFFER">عرض خاص</option>
                  </select>
                </div>

                {formData.type === 'BONUS_MONEY' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ (USDT)</label>
                    <input
                      type="number"
                      value={formData.bonusAmount}
                      onChange={(e) => setFormData({...formData, bonusAmount: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      step="0.01"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">حد الاستخدام</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({...formData, usageLimit: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الانتهاء (اختياري)</label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editActivatesAccount"
                    checked={formData.activatesAccount}
                    onChange={(e) => setFormData({...formData, activatesAccount: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="editActivatesAccount" className="ml-2 block text-sm text-gray-900">
                    تفعيل الحساب
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  إلغاء
                </button>
                <button
                  onClick={updatePromoCode}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  تحديث
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedPromoCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">تفاصيل الكود الترويجي</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">الكود:</span>
                    <p className="text-gray-600 font-mono">{selectedPromoCode.code}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">النوع:</span>
                    <p className="text-gray-600">
                      {selectedPromoCode.type === 'BONUS_MONEY' && 'مكافأة مالية'}
                      {selectedPromoCode.type === 'ACCOUNT_ACTIVATION' && 'تفعيل الحساب'}
                      {selectedPromoCode.type === 'SPECIAL_OFFER' && 'عرض خاص'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">الحالة:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedPromoCode.isActive)}`}>
                      {selectedPromoCode.isActive ? 'مفعل' : 'غير مفعل'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">الاستخدام:</span>
                    <p className="text-gray-600">{selectedPromoCode.usedCount}/{selectedPromoCode.usageLimit}</p>
                  </div>
                  {selectedPromoCode.bonusAmount && (
                    <div>
                      <span className="font-medium text-gray-700">المبلغ:</span>
                      <p className="text-gray-600">{selectedPromoCode.bonusAmount} USDT</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-700">تفعيل الحساب:</span>
                    <p className="text-gray-600">{selectedPromoCode.activatesAccount ? 'نعم' : 'لا'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">تاريخ الإنشاء:</span>
                    <p className="text-gray-600">{formatDate(selectedPromoCode.createdAt)}</p>
                  </div>
                  {selectedPromoCode.expiresAt && (
                    <div>
                      <span className="font-medium text-gray-700">تاريخ الانتهاء:</span>
                      <p className="text-gray-600">{formatDate(selectedPromoCode.expiresAt)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoCodeManagement;
