import React from 'react';
import { Bell, Check, X, Gift, CheckCircle, XCircle, TrendingUp, MessageSquare, Package, Users, DollarSign, Info, Clock } from 'lucide-react';
import { useNotifications, Notification } from '../context/NotificationContext';
import { Link } from 'react-router-dom';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT_APPROVED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'DEPOSIT_REJECTED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'WITHDRAWAL_APPROVED':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'WITHDRAWAL_REJECTED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'SYSTEM_MESSAGE':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'PLAN_PURCHASED':
        return <Package className="h-4 w-4 text-purple-500" />;
      case 'REFERRAL_BONUS':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'DAILY_EARNINGS':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'ADMIN_MESSAGE':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'FIRST_DEPOSIT_BONUS':
        return <Gift className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'الآن';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} دقيقة`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ساعة`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} يوم`;
    return date.toLocaleDateString('ar-SA');
  };

  const unreadNotifications = notifications.filter(n => !n.isRead).slice(0, 10);
  const hasUnread = unreadNotifications.length > 0;

  const handleMarkAsRead = async (notificationId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await markAllAsRead();
  };

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">الإشعارات</h3>
          {hasUnread && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {unreadNotifications.length}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasUnread && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              تحديد الكل كمقروء
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto flex-1">
        {unreadNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">لا توجد إشعارات غير مقروءة</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {unreadNotifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer relative group"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                        className="ml-2 p-1 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="تحديد كمقروء"
                      >
                        <Check className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200">
          <Link
            to="/notifications"
            onClick={onClose}
            className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            عرض جميع الإشعارات
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

