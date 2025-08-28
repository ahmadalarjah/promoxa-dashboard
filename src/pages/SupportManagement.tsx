import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Clock,
  CheckCircle,
  Loader2,
  User,
  Calendar,
  Eye,
  AlertCircle,
  XCircle
} from 'lucide-react';
import apiService from '../services/apiService';
import { toast } from 'react-toastify';

interface SupportTicket {
  id: number;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  createdAt: string;
  closedAt?: string;
  userName: string;
  username: string;
  messages: SupportMessage[];
}

interface SupportMessage {
  id: number;
  content: string;
  isFromAdmin: boolean;
  senderName: string;
  createdAt: string;
}

const SupportManagement: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await apiService.getAllSupportTickets();
      if (response.data) {
        setTickets(response.data);
      } else {
        toast.error('فشل في تحميل التذاكر');
      }
    } catch (error: any) {
      console.error('Error loading tickets:', error);
      toast.error(error.response?.data?.message || 'فشل في تحميل التذاكر');
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: number, status: string) => {
    try {
      const response = await apiService.updateTicketStatus(ticketId, status);
      if (response.data) {
        setTickets(prev => prev.map(ticket => 
          ticket.id === ticketId ? response.data : ticket
        ));
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket(response.data);
        }
        toast.success('تم تحديث حالة التذكرة بنجاح');
      } else {
        toast.error('فشل في تحديث حالة التذكرة');
      }
    } catch (error: any) {
      console.error('Error updating ticket status:', error);
      toast.error(error.response?.data?.message || 'فشل في تحديث حالة التذكرة');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'IN_PROGRESS':
        return <Loader2 className="h-4 w-4 text-yellow-500" />;
      case 'CLOSED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CLOSED':
        return 'bg-green-100 text-green-800 border-green-200';
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

  const filteredTickets = tickets.filter(ticket => 
    filterStatus === 'all' || ticket.status === filterStatus
  );

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'OPEN').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    closed: tickets.filter(t => t.status === 'CLOSED').length
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
          <h1 className="text-3xl font-bold text-gray-900">إدارة التذاكر</h1>
          <p className="text-gray-600 mt-2">إدارة تذاكر الدعم الفني</p>
        </div>
        <div className="flex items-center space-x-3">
          <MessageSquare className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي التذاكر</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">مفتوحة</p>
              <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">قيد المعالجة</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
            </div>
            <Loader2 className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">مغلقة</p>
              <p className="text-2xl font-bold text-green-600">{stats.closed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
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
            <option value="all">جميع التذاكر</option>
            <option value="OPEN">مفتوحة</option>
            <option value="IN_PROGRESS">قيد المعالجة</option>
            <option value="CLOSED">مغلقة</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">التذاكر</h2>
          
          {filteredTickets.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد تذاكر</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{ticket.subject}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(ticket.status)}`}>
                          {ticket.status === 'OPEN' && 'مفتوحة'}
                          {ticket.status === 'IN_PROGRESS' && 'قيد المعالجة'}
                          {ticket.status === 'CLOSED' && 'مغلقة'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{ticket.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{ticket.userName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(ticket.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{ticket.messages?.length || 0} رسالة</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setShowDetails(true);
                        }}
                        className="flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        عرض التفاصيل
                      </button>
                      
                      {ticket.status === 'OPEN' && (
                        <button
                          onClick={() => updateTicketStatus(ticket.id, 'IN_PROGRESS')}
                          className="flex items-center px-3 py-1 text-sm text-yellow-600 hover:bg-yellow-50 rounded-md"
                        >
                          <Loader2 className="h-4 w-4 mr-1" />
                          بدء المعالجة
                        </button>
                      )}
                      
                      {ticket.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => updateTicketStatus(ticket.id, 'CLOSED')}
                          className="flex items-center px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-md"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          إغلاق التذكرة
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ticket Details Modal */}
      {showDetails && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">تفاصيل التذكرة</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedTicket.subject}</h3>
                  <p className="text-gray-600">{selectedTicket.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">المستخدم:</span>
                    <p className="text-gray-600">{selectedTicket.userName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">اسم المستخدم:</span>
                    <p className="text-gray-600">{selectedTicket.username}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">تاريخ الإنشاء:</span>
                    <p className="text-gray-600">{formatDate(selectedTicket.createdAt)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">الحالة:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status === 'OPEN' && 'مفتوحة'}
                      {selectedTicket.status === 'IN_PROGRESS' && 'قيد المعالجة'}
                      {selectedTicket.status === 'CLOSED' && 'مغلقة'}
                    </span>
                  </div>
                </div>
                
                {selectedTicket.messages && selectedTicket.messages.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">الرسائل ({selectedTicket.messages.length})</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {selectedTicket.messages.map((message) => (
                        <div key={message.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{message.senderName}</span>
                            <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-600">{message.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  {selectedTicket.status === 'OPEN' && (
                    <button
                      onClick={() => {
                        updateTicketStatus(selectedTicket.id, 'IN_PROGRESS');
                        setShowDetails(false);
                      }}
                      className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      <Loader2 className="h-4 w-4 mr-2" />
                      بدء المعالجة
                    </button>
                  )}
                  
                  {selectedTicket.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => {
                        updateTicketStatus(selectedTicket.id, 'CLOSED');
                        setShowDetails(false);
                      }}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      إغلاق التذكرة
                    </button>
                  )}
                  
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportManagement;
