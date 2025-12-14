import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  AlertCircle,
  CheckCircle,
  XCircle,
  DollarSign,
  Package,
  Gift,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import apiService from '../services/apiService';
import { toast } from 'react-toastify';

interface NotificationForm {
  title: string;
  message: string;
  type: string;
}

const NotificationManagement: React.FC = () => {
  const [form, setForm] = useState<NotificationForm>({
    title: '',
    message: '',
    type: 'ADMIN_MESSAGE'
  });
  const [loading, setLoading] = useState(false);

  const notificationTypes = [
    { value: 'ADMIN_MESSAGE', label: 'رسالة إدارية', icon: MessageSquare },
    { value: 'SYSTEM_MESSAGE', label: 'رسالة نظام', icon: AlertCircle },
    { value: 'DEPOSIT_APPROVED', label: 'تأكيد إيداع', icon: CheckCircle },
    { value: 'DEPOSIT_REJECTED', label: 'رفض إيداع', icon: XCircle },
    { value: 'WITHDRAWAL_APPROVED', label: 'تأكيد سحب', icon: CheckCircle },
    { value: 'WITHDRAWAL_REJECTED', label: 'رفض سحب', icon: XCircle },
    { value: 'PLAN_PURCHASED', label: 'شراء خطة', icon: Package },
    { value: 'REFERRAL_BONUS', label: 'مكافأة إحالة', icon: Gift },
    { value: 'DAILY_EARNINGS', label: 'أرباح يومية', icon: TrendingUp },
    { value: 'FIRST_DEPOSIT_BONUS', label: 'مكافأة أول إيداع', icon: Gift }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.message.trim()) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    try {
      await apiService.sendNotificationToAllUsers(form.title, form.message, form.type);
      toast.success('تم إرسال الإشعار إلى جميع المستخدمين بنجاح');
      
      // Reset form
      setForm({
        title: '',
        message: '',
        type: 'ADMIN_MESSAGE'
      });
    } catch (error: any) {
      toast.error(error.response?.data || 'فشل في إرسال الإشعار');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    const notificationType = notificationTypes.find(t => t.value === type);
    return notificationType ? notificationType.icon : MessageSquare;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الإشعارات</h1>
          <p className="text-gray-600 mt-2">إرسال إشعارات للمستخدمين</p>
        </div>
        <div className="flex items-center space-x-3">
          <Bell className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      {/* Notification Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">إرسال إشعار جديد</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Notification Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع الإشعار
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {notificationTypes.map(type => {
                const Icon = type.icon;
                return (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان الإشعار *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="أدخل عنوان الإشعار"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رسالة الإشعار *
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="أدخل رسالة الإشعار"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
            >
              <Send className="h-4 w-4 mr-2" />
              {loading ? 'جاري الإرسال...' : 'إرسال الإشعار'}
            </button>
          </div>
        </form>
      </div>

      {/* Quick Templates */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">قوالب سريعة</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setForm({
              ...form,
              title: 'صيانة النظام',
              message: 'سيتم إجراء صيانة للنظام غداً من الساعة 2:00 صباحاً حتى 4:00 صباحاً. نعتذر عن أي إزعاج.',
              type: 'SYSTEM_MESSAGE'
            })}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-right"
          >
            <AlertCircle className="h-6 w-6 text-orange-600 mb-2" />
            <h3 className="font-medium text-gray-900">إشعار صيانة</h3>
            <p className="text-sm text-gray-600">إشعار صيانة النظام</p>
          </button>

          <button
            onClick={() => setForm({
              ...form,
              title: 'عرض خاص',
              message: 'عرض خاص! احصل على خصم 20% على جميع الخطط لمدة محدودة.',
              type: 'ADMIN_MESSAGE'
            })}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-right"
          >
            <Gift className="h-6 w-6 text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900">عرض خاص</h3>
            <p className="text-sm text-gray-600">إشعار عروض خاصة</p>
          </button>

          <button
            onClick={() => setForm({
              ...form,
              title: 'تحديث النظام',
              message: 'تم تحديث النظام بنجاح. يمكنك الآن الاستمتاع بالميزات الجديدة.',
              type: 'SYSTEM_MESSAGE'
            })}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-right"
          >
            <CheckCircle className="h-6 w-6 text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900">تحديث النظام</h3>
            <p className="text-sm text-gray-600">إشعار تحديث النظام</p>
          </button>

          <button
            onClick={() => setForm({
              ...form,
              title: 'مكافأة الإحالة',
              message: 'احصل على مكافأة إضافية 5% لكل إحالة جديدة هذا الشهر!',
              type: 'REFERRAL_BONUS'
            })}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-right"
          >
            <TrendingUp className="h-6 w-6 text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900">مكافأة الإحالة</h3>
            <p className="text-sm text-gray-600">إشعار مكافآت الإحالة</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationManagement;
