import React from 'react';
import { TrendingUp, TrendingDown, Target, Clock, Shield, DollarSign, Users, Zap } from 'lucide-react';
import { PIMetric } from '../data/mockData';

interface PIMetricsProps {
  metrics: PIMetric[];
}

const PIMetrics: React.FC<PIMetricsProps> = ({ metrics }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return TrendingUp;
      case 'security': return Shield;
      case 'financial': return DollarSign;
      case 'operational': return Users;
      default: return Zap;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance': return 'blue';
      case 'security': return 'red';
      case 'financial': return 'green';
      case 'operational': return 'purple';
      default: return 'gray';
    }
  };

  const getStatusColor = (value: number, target: number, trend: string) => {
    const isOnTarget = value >= target;
    const isImproving = trend === 'up';
    
    if (isOnTarget && isImproving) return 'text-green-600';
    if (isOnTarget) return 'text-blue-600';
    if (isImproving) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '%') return `${value.toFixed(2)}%`;
    if (unit === 'hours') return `${value.toFixed(1)}h`;
    if (unit === '/5') return `${value.toFixed(1)}/5`;
    if (unit === 'points') return `${value.toFixed(0)} pts`;
    return `${value.toFixed(1)} ${unit}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Performance Indicators (PI)</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const Icon = getCategoryIcon(metric.category);
          const color = getCategoryColor(metric.category);
          const statusColor = getStatusColor(metric.value, metric.target, metric.trend);
          const progressPercentage = Math.min((metric.value / metric.target) * 100, 100);

          return (
            <div key={metric.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg bg-${color}-100`}>
                  <Icon className={`w-5 h-5 text-${color}-600`} />
                </div>
                <div className="flex items-center space-x-1">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : metric.trend === 'down' ? (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  ) : (
                    <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                  )}
                  <span className={`text-sm font-medium ${statusColor}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{metric.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatValue(metric.value, metric.unit)}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Target className="w-3 h-3" />
                      <span>Target: {formatValue(metric.target, metric.unit)}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Progress to Target</span>
                    <span>{progressPercentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        progressPercentage >= 100 ? 'bg-green-500' :
                        progressPercentage >= 80 ? 'bg-blue-500' :
                        progressPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Category Badge */}
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${color}-100 text-${color}-800 capitalize`}>
                    {metric.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(metric.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PIMetrics;