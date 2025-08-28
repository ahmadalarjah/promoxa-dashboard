import React, { useState, useEffect } from 'react';
import { X, Save, Package } from 'lucide-react';
import { toast } from 'react-toastify';

interface Plan {
  id?: number;
  name: string;
  price: string;
  minDailyEarning: string;
  maxDailyEarning: string;
}

interface PlanFormProps {
  plan?: Plan;
  onSave: (plan: Plan) => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

const PlanForm: React.FC<PlanFormProps> = ({ plan, onSave, onCancel, mode }) => {
  const [formData, setFormData] = useState<Plan>({
    name: '',
    price: '',
    minDailyEarning: '',
    maxDailyEarning: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (plan) {
      setFormData(plan);
    }
  }, [plan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Plan name is required');
      return;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }
    
    if (!formData.minDailyEarning || parseFloat(formData.minDailyEarning) <= 0) {
      toast.error('Minimum daily earning must be greater than 0');
      return;
    }
    
    if (!formData.maxDailyEarning || parseFloat(formData.maxDailyEarning) <= 0) {
      toast.error('Maximum daily earning must be greater than 0');
      return;
    }
    
    if (parseFloat(formData.maxDailyEarning) < parseFloat(formData.minDailyEarning)) {
      toast.error('Maximum daily earning must be greater than minimum daily earning');
      return;
    }

    setLoading(true);
    try {
      onSave(formData);
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error('Failed to save plan');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Plan, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateROI = () => {
    if (!formData.price || !formData.minDailyEarning || !formData.maxDailyEarning) return null;
    
    const price = parseFloat(formData.price);
    const minDaily = parseFloat(formData.minDailyEarning);
    const maxDaily = parseFloat(formData.maxDailyEarning);
    const avgDaily = (minDaily + maxDaily) / 2;
    const monthlyROI = (avgDaily * 30 / price * 100);
    
    return {
      daily: (avgDaily / price * 100).toFixed(2),
      monthly: monthlyROI.toFixed(2)
    };
  };

  const roi = calculateROI();

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">
              {mode === 'create' ? 'Create New Plan' : 'Edit Plan'}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Plan Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plan Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter plan name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (USDT) *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Daily Earnings Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Daily Earning (USDT) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                value={formData.minDailyEarning}
                onChange={(e) => handleInputChange('minDailyEarning', e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Daily Earning (USDT) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                value={formData.maxDailyEarning}
                onChange={(e) => handleInputChange('maxDailyEarning', e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* ROI Preview */}
        {roi && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">ROI Preview</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-600 font-medium">Daily ROI:</span>
                <span className="ml-2 text-blue-800">{roi.daily}%</span>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Monthly ROI:</span>
                <span className="ml-2 text-blue-800">{roi.monthly}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : mode === 'create' ? 'Create Plan' : 'Update Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlanForm;
