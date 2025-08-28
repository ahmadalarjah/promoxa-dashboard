import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Pin,
  PinOff,
  Edit2,
  Trash2,
  Users,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Send
} from 'lucide-react';
import DataTable from '../components/common/DataTable';
import apiService from '../services/apiService';
import { toast } from 'react-toastify';

interface ChatMessage {
  id: number;
  username: string;
  content: string;
  createdAt: string;
  isPinned: boolean;
  isAdminMessage: boolean;
  likesCount: number;
  dislikesCount: number;
}

const CommunityManagement: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminMessage, setAdminMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 50
  });

  useEffect(() => {
    fetchCommunityMessages();
  }, [pagination.currentPage]);

  const fetchCommunityMessages = async () => {
    try {
      setLoading(true);
      
      const response = await apiService.getCommunityMessages(pagination.currentPage, pagination.size);
      
      setMessages(response.data.content);
      setFilteredMessages(response.data.content);
      setPagination({
        currentPage: response.data.number,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
        size: response.data.size
      });
      
    } catch (error: any) {
      console.error('Failed to fetch community messages:', error);
      console.error('Error response:', error.response);
      toast.error('Failed to load community messages');
    } finally {
      setLoading(false);
    }
  };

  const handlePinMessage = async (messageId: number) => {
    try {
      await apiService.pinMessage(messageId);
      toast.success('Message pinned successfully');
      fetchCommunityMessages();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to pin message');
    }
  };

  const handleUnpinMessage = async (messageId: number) => {
    try {
      await apiService.unpinMessage(messageId);
      toast.success('Message unpinned successfully');
      fetchCommunityMessages();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to unpin message');
    }
  };

  const handleEditMessage = async (messageId: number, newContent: string) => {
    try {
      await apiService.editMessage(messageId, newContent);
      toast.success('Message edited successfully');
      fetchCommunityMessages();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to edit message');
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    try {
      await apiService.deleteMessage(messageId);
      toast.success('Message deleted successfully');
      fetchCommunityMessages();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete message');
    }
  };

  const handleDeleteAllMessages = async () => {
    if (window.confirm('Are you sure you want to delete ALL messages? This action cannot be undone.')) {
      try {
        await apiService.deleteAllMessages();
        toast.success('All messages deleted successfully');
        fetchCommunityMessages();
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to delete all messages');
      }
    }
  };

  const handleSendAdminMessage = async () => {
    if (!adminMessage.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    try {
      setSendingMessage(true);
      
      const response = await apiService.sendChatMessage(adminMessage);
      
      toast.success('Admin message sent successfully');
      setAdminMessage('');
      fetchCommunityMessages();
    } catch (error: any) {
      console.error('Failed to send admin message:', error);
      console.error('Error response:', error.response);
      toast.error(error.response?.data?.error || 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredMessages(messages);
      return;
    }
    
    const filtered = messages.filter(message => 
      message.username.toLowerCase().includes(query.toLowerCase()) ||
      message.content.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredMessages(filtered);
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

  const columns = [
    {
      key: 'username',
      label: 'User',
      render: (value: string, row: ChatMessage) => (
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            row.isAdminMessage ? 'bg-red-500' : 'bg-blue-500'
          }`}></div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            {row.isAdminMessage && (
              <span className="text-xs text-red-600 font-medium">Admin</span>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'content',
      label: 'Message',
      render: (value: string, row: ChatMessage) => (
        <div className={`${row.isPinned ? 'bg-yellow-50 p-2 rounded border-l-4 border-yellow-400' : ''}`}>
          <div className="text-sm text-gray-900 break-words max-w-md">
            {value.length > 100 ? `${value.substring(0, 100)}...` : value}
          </div>
          {row.isPinned && (
            <div className="flex items-center mt-1">
              <Pin className="h-3 w-3 text-yellow-600 mr-1" />
              <span className="text-xs text-yellow-600 font-medium">Pinned</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'reactions',
      label: 'Reactions',
      render: (value: any, row: ChatMessage) => (
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-green-600">
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{row.likesCount}</span>
          </div>
          <div className="flex items-center text-red-600">
            <ThumbsDown className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{row.dislikesCount}</span>
          </div>
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (value: string) => (
        <div className="text-sm text-gray-600">{formatDate(value)}</div>
      )
    }
  ];

  const pinnedMessages = messages.filter(msg => msg.isPinned);
  const totalReactions = messages.reduce((sum, msg) => sum + msg.likesCount + msg.dislikesCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Management</h1>
          <p className="text-gray-600 mt-2">Manage chat messages, moderate content, and engage with users</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleDeleteAllMessages}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete All Messages
          </button>
          <button
            onClick={fetchCommunityMessages}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Pin className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pinned Messages</p>
              <p className="text-2xl font-bold text-gray-900">{pinnedMessages.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <ThumbsUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reactions</p>
              <p className="text-2xl font-bold text-gray-900">{totalReactions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Admin Messages</p>
              <p className="text-2xl font-bold text-gray-900">
                {messages.filter(msg => msg.isAdminMessage).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Message Input */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Send Admin Message</h3>
        </div>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> Messages sent from here will appear in the "Admin Messages" section on the user community page.
          </p>
        </div>
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Content
            </label>
            <textarea
              value={adminMessage}
              onChange={(e) => setAdminMessage(e.target.value)}
              placeholder="Type your admin message here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 mt-1">
              {adminMessage.length}/1000 characters
            </div>
          </div>
          <button
            onClick={handleSendAdminMessage}
            disabled={sendingMessage || !adminMessage.trim()}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendingMessage ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </>
            )}
          </button>
        </div>
      </div>

      {/* Pinned Messages Section */}
      {pinnedMessages.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Pin className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Pinned Messages</h3>
          </div>
          <div className="space-y-3">
            {pinnedMessages.map((message) => (
              <div key={message.id} className="bg-white p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="font-medium text-gray-900">{message.username}</span>
                      {message.isAdminMessage && (
                        <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700">{message.content}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <div className="flex items-center text-green-600">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span className="text-sm">{message.likesCount}</span>
                      </div>
                      <div className="flex items-center text-red-600">
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        <span className="text-sm">{message.dislikesCount}</span>
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnpinMessage(message.id)}
                    className="ml-4 p-2 text-gray-400 hover:text-yellow-600 transition-colors duration-200"
                    title="Unpin Message"
                  >
                    <PinOff className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages Table */}
      <DataTable
        data={filteredMessages}
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
        actions={(message: ChatMessage) => (
          <div className="flex items-center space-x-2">
            {message.isPinned ? (
              <button
                onClick={() => handleUnpinMessage(message.id)}
                className="p-1 text-gray-400 hover:text-yellow-600 transition-colors duration-200"
                title="Unpin Message"
              >
                <PinOff className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => handlePinMessage(message.id)}
                className="p-1 text-gray-400 hover:text-yellow-600 transition-colors duration-200"
                title="Pin Message"
              >
                <Pin className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => {
                const newContent = prompt('Edit message:', message.content);
                if (newContent && newContent !== message.content) {
                  handleEditMessage(message.id, newContent);
                }
              }}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
              title="Edit Message"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to delete this message?\n\n"${message.content.substring(0, 100)}${message.content.length > 100 ? '...' : ''}"`)) {
                  handleDeleteMessage(message.id);
                }
              }}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
              title="Delete Message"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default CommunityManagement;