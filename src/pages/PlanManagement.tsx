import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, DollarSign, TrendingUp, Power, PowerOff } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import PlanForm from '../components/common/PlanForm';
import apiService from '../services/apiService';
import { toast } from 'react-toastify';

interface Plan {
  id: number;
  name: string;
  price: string;
  minDailyEarning: string;
  maxDailyEarning: string;
  canPurchase: boolean;
  isActive?: boolean;
}

const PlanManagement: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlanFormOpen, setIsPlanFormOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllPlans();
      setPlans(response.data);
    } catch (error: any) {
      console.error('Failed to fetch plans:', error);
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanFormClose = () => {
    setIsPlanFormOpen(false);
    setSelectedPlan(null);
  };

  const handlePlanFormSubmit = async (plan: Plan) => {
    try {
      if (plan.id) {
        await apiService.updatePlan(plan.id, plan);
        toast.success('Plan updated successfully');
      } else {
        await apiService.createPlan(plan);
        toast.success('Plan created successfully');
      }
      fetchPlans();
      handlePlanFormClose();
    } catch (error: any) {
      console.error('Failed to save plan:', error);
      toast.error('Failed to save plan');
    }
  };

  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsPlanFormOpen(true);
  };

  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setIsPlanFormOpen(true);
  };

  const handleDeletePlan = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await apiService.deletePlan(id);
        toast.success('Plan deleted successfully');
        fetchPlans();
      } catch (error: any) {
        console.error('Failed to delete plan:', error);
        toast.error('Failed to delete plan');
      }
    }
  };

  const handleTogglePlanStatus = async (id: number) => {
    try {
      await apiService.togglePlanStatus(id);
      toast.success('Plan status updated successfully');
      fetchPlans();
    } catch (error: any) {
      console.error('Failed to toggle plan status:', error);
      toast.error('Failed to update plan status');
    }
  };

  const formatCurrency = (value: string) => {
    return `$${parseFloat(value || '0').toFixed(2)}`;
  };

  const columns = [
    {
      key: 'name',
      label: 'Plan Name',
      sortable: true,
      render: (value: string) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (value: string) => (
        <span className="font-bold text-blue-600">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'minDailyEarning',
      label: 'Min Daily Earning',
      render: (value: string) => (
        <span className="text-green-600">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'maxDailyEarning',
      label: 'Max Daily Earning',
      render: (value: string) => (
        <span className="text-green-700 font-medium">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'dailyRange',
      label: 'Daily Range',
      render: (value: any, row: Plan) => {
        const min = parseFloat(row.minDailyEarning);
        const max = parseFloat(row.maxDailyEarning);
        const percentage = ((max - min) / parseFloat(row.price) * 100).toFixed(1);
        return (
          <div>
            <div className="text-sm text-gray-900">
              {formatCurrency(row.minDailyEarning)} - {formatCurrency(row.maxDailyEarning)}
            </div>
            <div className="text-xs text-gray-500">
              ~{percentage}% of price
            </div>
          </div>
        );
      }
    },
    {
      key: 'roi',
      label: 'Monthly ROI',
      render: (value: any, row: Plan) => {
        const avgDaily = (parseFloat(row.minDailyEarning) + parseFloat(row.maxDailyEarning)) / 2;
        const monthlyEarning = avgDaily * 30;
        const roi = (monthlyEarning / parseFloat(row.price) * 100).toFixed(1);
        return (
          <div>
            <div className="text-sm font-medium text-purple-600">{roi}%</div>
            <div className="text-xs text-gray-500">
              ~{formatCurrency((monthlyEarning).toString())}/month
            </div>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plan Management</h1>
          <p className="text-gray-600 mt-2">Manage investment plans and packages</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCreatePlan}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Plan
          </button>
          <button
            onClick={fetchPlans}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Package className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Plans</p>
              <p className="text-2xl font-bold text-gray-900">{plans.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Entry Level</p>
              <p className="text-2xl font-bold text-gray-900">
                {plans.length > 0 ? formatCurrency(
                  Math.min(...plans.map(p => parseFloat(p.price))).toString()
                ) : '$0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Premium Plan</p>
              <p className="text-2xl font-bold text-gray-900">
                {plans.length > 0 ? formatCurrency(
                  Math.max(...plans.map(p => parseFloat(p.price))).toString()
                ) : '$0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Daily ROI</p>
              <p className="text-2xl font-bold text-gray-900">
                {plans.length > 0 ? (
                  (plans.reduce((sum, plan) => {
                    const avgDaily = (parseFloat(plan.minDailyEarning) + parseFloat(plan.maxDailyEarning)) / 2;
                    return sum + (avgDaily / parseFloat(plan.price) * 100);
                  }, 0) / plans.length).toFixed(1)
                ) : '0'}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Table */}
      <DataTable
        data={plans}
        columns={columns}
        loading={loading}
        actions={(plan: Plan) => (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleEditPlan(plan)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
              title="Edit Plan"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeletePlan(plan.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
              title="Delete Plan"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleTogglePlanStatus(plan.id)}
              className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
              title={plan.isActive ? 'Deactivate Plan' : 'Activate Plan'}
            >
              {plan.isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
            </button>
          </div>
        )}
      />

      {/* Plan Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const avgDaily = (parseFloat(plan.minDailyEarning) + parseFloat(plan.maxDailyEarning)) / 2;
          const monthlyROI = (avgDaily * 30 / parseFloat(plan.price) * 100);
          const isHighTier = parseFloat(plan.price) > 1000;
          
          return (
            <div
              key={plan.id}
              className={`bg-white p-6 rounded-lg shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
                isHighTier ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-bold ${isHighTier ? 'text-purple-900' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                {isHighTier && (
                  <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                    Premium
                  </span>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${isHighTier ? 'text-purple-600' : 'text-blue-600'}`}>
                    {formatCurrency(plan.price)}
                  </div>
                  <div className="text-sm text-gray-500">Investment Amount</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-sm font-medium text-green-600">
                      {formatCurrency(plan.minDailyEarning)}
                    </div>
                    <div className="text-xs text-gray-500">Min Daily</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-green-700">
                      {formatCurrency(plan.maxDailyEarning)}
                    </div>
                    <div className="text-xs text-gray-500">Max Daily</div>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Monthly ROI</span>
                    <span className={`text-sm font-bold ${isHighTier ? 'text-purple-600' : 'text-blue-600'}`}>
                      {monthlyROI.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Daily</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(avgDaily.toString())}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Plan Form Modal */}
      {isPlanFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl">
            <PlanForm
              plan={selectedPlan || undefined}
              onSave={handlePlanFormSubmit}
              onCancel={handlePlanFormClose}
              mode={selectedPlan ? 'edit' : 'create'}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanManagement;