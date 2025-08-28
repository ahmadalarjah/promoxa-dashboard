import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:8080/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token'); // Changed from 'token' to 'auth_token' to match backend
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token'); // Changed from 'token' to 'auth_token'
          window.location.href = '/login';
        } else if (error.response?.status === 403 && error.response?.data?.error === 'USER_BANNED') {
          // Handle ban response for admin users
          localStorage.removeItem('auth_token');
          const banMessage = `تم حظر حسابك. السبب: ${error.response.data.banReason || 'غير محدد'}`;
          alert(banMessage);
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public setToken(token: string) {
    if (token) {
      this.api.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.Authorization;
    }
  }

  // Generic HTTP methods
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.get<T>(url, config);
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data, config);
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.put<T>(url, data, config);
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(url, config);
  }

  // Admin specific methods - Updated to match backend exactly
  public async getAdminStats() {
    return this.get('/admin/stats');
  }

  public async getAllUsers(page = 0, size = 20, sort = 'createdAt,desc') {
    return this.get(`/admin/users?page=${page}&size=${size}&sort=${sort}`);
  }

  public async updateUserBalance(userId: number, newBalance: number) {
    return this.put(`/admin/users/${userId}/balance`, { newBalance });
  }

  public async updateUserWallet(userId: number, walletAddress: string, reason?: string) {
    return this.put(`/admin/users/${userId}/wallet-address`, { walletAddress, reason });
  }

  public async activateUser(userId: number) {
    return this.put(`/admin/users/${userId}/activate`);
  }

  public async deactivateUser(userId: number) {
    return this.put(`/admin/users/${userId}/deactivate`);
  }

  public async banUser(userId: number, reason: string, days?: number) {
    const params = new URLSearchParams();
    params.append('reason', reason);
    if (days) params.append('days', days.toString());
    
    return this.post(`/admin/users/${userId}/ban?${params.toString()}`);
  }

  public async unbanUser(userId: number) {
    return this.post(`/admin/users/${userId}/unban`);
  }

  public async getPendingDeposits(page = 0, size = 20) {
    return this.get(`/admin/deposits/pending?page=${page}&size=${size}`);
  }

  public async getFilteredDeposits(filters: {
    status?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: string;
    maxAmount?: string;
    transactionHash?: string;
    username?: string;
    page?: number;
    size?: number;
    sort?: string;
  }) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    return this.get(`/admin/deposits/filtered?${params.toString()}`);
  }

  public async confirmDeposit(depositId: number, notes?: string) {
    const params = notes ? `?notes=${encodeURIComponent(notes)}` : '';
    return this.put(`/admin/deposits/${depositId}/confirm${params}`);
  }

  public async rejectDeposit(depositId: number, notes?: string) {
    const params = notes ? `?notes=${encodeURIComponent(notes)}` : '';
    return this.put(`/admin/deposits/${depositId}/reject${params}`);
  }

  public async getPendingWithdrawals(page = 0, size = 20) {
    return this.get(`/admin/withdrawals/pending?page=${page}&size=${size}`);
  }

  public async getFilteredWithdrawals(filters: {
    status?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: string;
    maxAmount?: string;
    walletAddress?: string;
    username?: string;
    page?: number;
    size?: number;
    sort?: string;
  }) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    return this.get(`/admin/withdrawals/filtered?${params.toString()}`);
  }

  public async approveWithdrawal(withdrawalId: number, notes?: string, transactionHash?: string) {
    const params = new URLSearchParams();
    if (notes) params.append('notes', notes);
    if (transactionHash) params.append('transactionHash', transactionHash);
    
    return this.put(`/admin/withdrawals/${withdrawalId}/approve?${params.toString()}`);
  }

  public async rejectWithdrawal(withdrawalId: number, notes?: string) {
    const params = notes ? `?notes=${encodeURIComponent(notes)}` : '';
    return this.put(`/admin/withdrawals/${withdrawalId}/reject${params}`);
  }

  public async getDetailedReports(days = 7) {
    return this.get(`/admin/reports/detailed?days=${days}`);
  }

  // Deposit wallet address management
  public async getDepositAddress() {
    return this.get('/admin/deposit/address');
  }

  public async updateDepositAddress(address: string) {
    return this.put('/admin/deposit/address', { address });
  }

  public async getMinDepositAmount() {
    return this.get('/admin/deposit/min-amount');
  }

  public async updateMinDepositAmount(minAmount: number) {
    return this.put('/admin/deposit/min-amount', { minAmount });
  }

  // Community methods - Updated to match backend exactly
  public async getCommunityMessages(page = 0, size = 50) {
    return this.get(`/community/messages?page=${page}&size=${size}`);
  }

  public async pinMessage(messageId: number) {
    return this.post(`/community/messages/${messageId}/pin`);
  }

  public async unpinMessage(messageId: number) {
    return this.delete(`/community/messages/${messageId}/pin`);
  }

  // Admin message deletion methods
  public async deleteMessage(messageId: number) {
    return this.delete(`/community/messages/${messageId}`);
  }

  public async deleteAllMessages() {
    return this.delete('/community/messages');
  }

  // Admin message sending
  public async sendChatMessage(content: string): Promise<any> {
    return this.post('/community/messages', { content });
  }

  public async editMessage(messageId: number, content: string) {
    return this.put(`/community/messages/${messageId}`, { content });
  }

  // News methods - Updated to match backend exactly
  public async getNews(page = 0, size = 20) {
    return this.get(`/news?page=${page}&size=${size}`);
  }

  public async getLatestNews() {
    return this.get('/news/latest');
  }

  public async getNewsById(id: number) {
    return this.get(`/news/${id}`);
  }

  // Plans methods - Updated to match backend exactly
  public async getPlans() {
    return this.get('/plans');
  }

  // Admin plan management methods
  public async getAllPlans() {
    return this.get('/admin/plans');
  }

  public async createPlan(planData: {
    name: string
    price: number
    minDailyEarning: number
    maxDailyEarning: number
  }) {
    return this.post('/admin/plans', planData);
  }

  public async updatePlan(planId: number, planData: {
    name: string
    price: number
    minDailyEarning: number
    maxDailyEarning: number
  }) {
    return this.put(`/admin/plans/${planId}`, planData);
  }

  public async deletePlan(planId: number) {
    return this.delete(`/admin/plans/${planId}`);
  }

  public async togglePlanStatus(planId: number) {
    return this.put(`/admin/plans/${planId}/toggle-status`);
  }

  // Referral Management
  public async getUserReferralTree(userId: number) {
    return this.get(`/admin/referrals/tree/${userId}`);
  }

  public async getReferralTreeByUsername(username: string) {
    return this.get(`/admin/referrals/tree/username/${username}`);
  }

  public async getAllReferralTrees() {
    return this.get('/admin/referrals/all');
  }

  public async getTopReferrers(limit: number = 10) {
    return this.get(`/admin/referrals/top?limit=${limit}`);
  }

  public async getReferralStatistics() {
    return this.get('/admin/referrals/statistics');
  }

  // Notification management methods
  public async sendNotificationToAllUsers(title: string, message: string, type: string = 'ADMIN_MESSAGE') {
    const params = new URLSearchParams();
    params.append('title', title);
    params.append('message', message);
    params.append('type', type);
    
    return this.post(`/admin/notifications/broadcast?${params.toString()}`);
  }

  public async sendNotificationToUser(userId: number, title: string, message: string, type: string = 'ADMIN_MESSAGE') {
    const params = new URLSearchParams();
    params.append('title', title);
    params.append('message', message);
    params.append('type', type);
    
    return this.post(`/admin/notifications/user/${userId}?${params.toString()}`);
  }

  public async getAllNotifications(page = 0, size = 20) {
    return this.get(`/admin/notifications?page=${page}&size=${size}`);
  }

  // Additional endpoints from other controllers
  public async getNotifications(page = 0, size = 20) {
    return this.get(`/notifications?page=${page}&size=${size}`);
  }

  // Promo Code Management
  public async getAllPromoCodes() {
    return this.get('/admin/promo-codes');
  }

  public async createPromoCode(promoCodeData: any) {
    return this.post('/admin/promo-codes', promoCodeData);
  }

  public async updatePromoCode(promoCodeId: number, promoCodeData: any) {
    return this.put(`/admin/promo-codes/${promoCodeId}`, promoCodeData);
  }

  public async togglePromoCodeStatus(promoCodeId: number, isActive: boolean) {
    return this.put(`/admin/promo-codes/${promoCodeId}/toggle-status`, { isActive });
  }

  public async deletePromoCode(promoCodeId: number) {
    return this.delete(`/admin/promo-codes/${promoCodeId}`);
  }

  public async getPromoCodeUsage(promoCodeId: number) {
    return this.get(`/admin/promo-codes/${promoCodeId}/usage`);
  }

  public async getSupportTickets(page = 0, size = 20) {
    return this.get(`/support/tickets?page=${page}&size=${size}`);
  }

  public async getAllSupportTickets() {
    return this.get('/support/admin/tickets');
  }

  public async updateTicketStatus(ticketId: number, status: string) {
    return this.put(`/support/admin/tickets/${ticketId}/status?status=${status}`);
  }

  public async getTeamMembers() {
    return this.get('/team/members');
  }

  public async getTeamStats() {
    return this.get('/team/stats');
  }

  public async getDailyOrders(page = 0, size = 20) {
    return this.get(`/daily-orders?page=${page}&size=${size}`);
  }

  // User management endpoints
  public async getUserProfile() {
    return this.get('/user/profile');
  }

  public async updateUserProfile(userData: any) {
    return this.put('/user/profile', userData);
  }

  public async getDashboardStats() {
    return this.get('/user/dashboard-stats');
  }

  // Transaction endpoints
  public async getDeposits(page = 0, size = 20) {
    return this.get(`/deposits?page=${page}&size=${size}`);
  }

  public async getWithdrawals(page = 0, size = 20) {
    return this.get(`/withdrawals?page=${page}&size=${size}`);
  }

  public async createDeposit(amount: number) {
    return this.post('/deposits', { amount });
  }

  public async createWithdrawal(amount: number, walletAddress: string) {
    return this.post('/withdrawals', { amount, walletAddress });
  }

  // Orders endpoints
  public async getOrders(page = 0, size = 20) {
    return this.get(`/orders?page=${page}&size=${size}`);
  }

  public async completeOrder(orderId: number) {
    return this.put(`/orders/${orderId}/complete`);
  }

  // Language endpoints
  public async getLanguages() {
    return this.get('/languages');
  }

  public async setLanguage(language: string) {
    return this.post('/languages', { language });
  }

  // Test method to check backend connectivity
  public async testBackendConnection() {
    try {
      const response = await this.get('/auth/health');
      return true;
    } catch (error) {
      console.error('Backend connection failed:', error);
      return false;
    }
  }
}

const apiService = new ApiService();
export default apiService;