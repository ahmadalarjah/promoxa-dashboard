import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Package,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Bell,
  Headphones,
  Gift,
  Network
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard', color: 'text-blue-600' },
    { path: '/users', icon: Users, label: 'User Management', color: 'text-green-600' },
    { path: '/finance', icon: DollarSign, label: 'Financial Management', color: 'text-yellow-600' },
    { path: '/plans', icon: Package, label: 'Plan Management', color: 'text-purple-600' },
    { path: '/referrals', icon: Network, label: 'Referral Management', color: 'text-cyan-600' },
    { path: '/community', icon: MessageSquare, label: 'Community', color: 'text-pink-600' },
    { path: '/notifications', icon: Bell, label: 'Notifications', color: 'text-orange-600' },
    { path: '/support', icon: Headphones, label: 'Support Management', color: 'text-teal-600' },
    { path: '/promo-codes', icon: Gift, label: 'Promo Codes', color: 'text-amber-600' },
    { path: '/reports', icon: BarChart3, label: 'Reports', color: 'text-indigo-600' },
    { path: '/settings', icon: Settings, label: 'Settings', color: 'text-gray-600' },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-30 ${
      isOpen ? 'w-64' : 'w-20'
    }`}>
      {/* Header */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-white" />
          {isOpen && (
            <div className="text-white">
              <h1 className="font-bold text-lg">PROXOMA</h1>
              <p className="text-xs text-blue-100">Admin Dashboard</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-r-4 border-blue-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : item.color} transition-colors duration-200 group-hover:scale-110`} />
                  {isOpen && (
                    <span className="ml-3 font-medium text-sm">{item.label}</span>
                  )}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-2 w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {!isOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-100">
            <p className="text-xs text-gray-600 text-center">
              © 2025 Proxoma Platform
            </p>
            <p className="text-xs text-gray-500 text-center mt-1">
              Admin Panel v1.0
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
