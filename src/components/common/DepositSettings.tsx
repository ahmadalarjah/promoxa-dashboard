import React, { useState, useEffect } from 'react';
import {
  Wallet,
  DollarSign,
  Save,
  Edit,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import apiService from '../../services/apiService';
import { toast } from 'react-toastify';

interface DepositSettingsProps {
  onClose?: () => void;
}

const DepositSettings: React.FC<DepositSettingsProps> = ({ onClose }) => {
  const [depositAddress, setDepositAddress] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingMinAmount, setIsEditingMinAmount] = useState(false);
  const [tempAddress, setTempAddress] = useState('');
  const [tempMinAmount, setTempMinAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepositSettings();
  }, []);

  const fetchDepositSettings = async () => {
    try {
      setLoading(true);
      const [addressResponse, minAmountResponse] = await Promise.all([
        apiService.getDepositAddress(),
        apiService.getMinDepositAmount()
      ]);

      setDepositAddress(addressResponse.data.address);
      setMinAmount(minAmountResponse.data.minAmount.toString());
    } catch (error: any) {
      console.error('Failed to fetch deposit settings:', error);
      toast.error('Failed to load deposit settings');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = () => {
    setTempAddress(depositAddress);
    setIsEditingAddress(true);
  };

  const handleCancelAddressEdit = () => {
    setIsEditingAddress(false);
    setTempAddress(depositAddress);
  };

  const handleSaveAddress = async () => {
    if (!tempAddress.trim()) {
      toast.error('Deposit address cannot be empty');
      return;
    }

    try {
      setLoading(true);
      await apiService.updateDepositAddress(tempAddress);
      setDepositAddress(tempAddress);
      setIsEditingAddress(false);
      toast.success('Deposit address updated successfully');
    } catch (error: any) {
      console.error('Failed to update deposit address:', error);
      
      // Show more specific error messages
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          toast.error(error.response.data);
        } else if (error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to update deposit address');
        }
      } else {
        toast.error('Failed to update deposit address');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditMinAmount = () => {
    setTempMinAmount(minAmount);
    setIsEditingMinAmount(true);
  };

  const handleCancelMinAmountEdit = () => {
    setIsEditingMinAmount(false);
    setTempMinAmount(minAmount);
  };

  const handleSaveMinAmount = async () => {
    const amount = parseFloat(tempMinAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Minimum amount must be a positive number');
      return;
    }

    try {
      setLoading(true);
      await apiService.updateMinDepositAmount(amount);
      setMinAmount(tempMinAmount);
      setIsEditingMinAmount(false);
      toast.success('Minimum deposit amount updated successfully');
    } catch (error: any) {
      console.error('Failed to update minimum amount:', error);
      
      // Show more specific error messages
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          toast.error(error.response.data);
        } else if (error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to update minimum amount');
        }
      } else {
        toast.error('Failed to update minimum amount');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Deposit Settings</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Manage deposit wallet address and minimum amount requirements
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Deposit Wallet Address */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-blue-600" />
            <h4 className="text-md font-medium text-gray-900">Deposit Wallet Address</h4>
          </div>
          
          {isEditingAddress ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={tempAddress}
                  onChange={(e) => setTempAddress(e.target.value)}
                  placeholder="Enter new wallet address"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleSaveAddress}
                  disabled={loading}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </button>
                <button
                  onClick={handleCancelAddressEdit}
                  disabled={loading}
                  className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>Make sure to verify the wallet address before saving</span>
                </div>
                <div className="text-xs text-gray-500">
                  <p>Requirements:</p>
                  <ul className="list-disc list-inside ml-2">
                    <li>Length: 10-100 characters</li>
                    <li>Only letters and numbers allowed</li>
                    <li>No spaces or special characters</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <code className="text-sm font-mono text-gray-800 break-all">
                    {depositAddress}
                  </code>
                </div>
                <button
                  onClick={() => copyToClipboard(depositAddress)}
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  title="Copy to clipboard"
                >
                  Copy
                </button>
                <button
                  onClick={handleEditAddress}
                  disabled={loading}
                  className="flex items-center px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Minimum Deposit Amount */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <h4 className="text-md font-medium text-gray-900">Minimum Deposit Amount</h4>
          </div>
          
          {isEditingMinAmount ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={tempMinAmount}
                    onChange={(e) => setTempMinAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleSaveMinAmount}
                  disabled={loading}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </button>
                <button
                  onClick={handleCancelMinAmountEdit}
                  disabled={loading}
                  className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-md">
                <span className="text-lg font-semibold text-gray-800">
                  ${parseFloat(minAmount).toFixed(2)} USDT
                </span>
              </div>
              <button
                onClick={handleEditMinAmount}
                disabled={loading}
                className="flex items-center px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Important Notes:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Changes to the deposit address will affect all new deposits</li>
                <li>Ensure the wallet address is correct before saving</li>
                <li>Minimum amount changes apply to new deposit requests</li>
                <li>Existing pending deposits are not affected by these changes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositSettings;
