import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import apiService from '../services/apiService';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'DEPOSIT_APPROVED' | 'DEPOSIT_REJECTED' | 'WITHDRAWAL_APPROVED' | 'WITHDRAWAL_REJECTED' | 'SYSTEM_MESSAGE' | 'PLAN_PURCHASED' | 'REFERRAL_BONUS' | 'DAILY_EARNINGS' | 'ADMIN_MESSAGE' | 'FIRST_DEPOSIT_BONUS';
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  relatedEntityType?: string;
  relatedEntityId?: number;
}

interface NotificationContextType {
  unreadCount: number;
  notifications: Notification[];
  loading: boolean;
  refreshNotifications: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadUnreadCount = async () => {
    try {
      const count = await apiService.getUnreadNotificationCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
      setUnreadCount(0);
    }
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAdminNotifications(0, 20);
      
      if (response && response.data) {
        let notificationsArray: Notification[] = [];
        
        // Handle paginated response
        if (response.data.content && Array.isArray(response.data.content)) {
          notificationsArray = response.data.content;
        } else if (Array.isArray(response.data)) {
          notificationsArray = response.data;
        }
        
        setNotifications(notificationsArray);
        
        // Update unread count
        const unread = notificationsArray.filter((n: Notification) => !n.isRead).length;
        setUnreadCount(unread);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const refreshNotifications = async () => {
    await loadNotifications();
  };

  const refreshUnreadCount = async () => {
    await loadUnreadCount();
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await apiService.markNotificationAsRead(notificationId);
      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsAsRead();
      // Update local state
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      // Update unread count
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Load unread count once when app initializes
  useEffect(() => {
    if (!hasInitialized) {
      loadUnreadCount();
      loadNotifications();
      setHasInitialized(true);
    }
  }, [hasInitialized]);

  // Set up polling for new notifications (every 20 seconds)
  useEffect(() => {
    if (hasInitialized) {
      pollingIntervalRef.current = setInterval(() => {
        loadNotifications();
        loadUnreadCount();
      }, 20000); // Poll every 20 seconds
      
      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      };
    }
  }, [hasInitialized]);

  const value: NotificationContextType = {
    unreadCount,
    notifications,
    loading,
    refreshNotifications,
    refreshUnreadCount,
    markAsRead,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

