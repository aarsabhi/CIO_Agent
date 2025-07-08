import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Users, Server, Shield, BarChart3, Activity } from 'lucide-react';
import PIMetrics from './PIMetrics';
import InteractiveCharts from './InteractiveCharts';
import { piMetrics, securityIncidents, projectData, User } from '../data/mockData';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const metrics = [
    {
      title: 'System Uptime',
      value: '99.97%',
      change: '+0.03%',
      trend: 'up',
      icon: Server,
      color: 'green'
    },
    {
      title: 'Security Score',
      value: '94/100',
      change: '+2 points',
      trend: 'up',
      icon: Shield,
      color: 'blue'
    },
    {
      title: 'Active Incidents',
      value: '3',
      change: '-2 from yesterday',
      trend: 'down',
      icon: AlertTriangle,
      color: 'orange'
    },
    {
      title: 'Team Performance',
      value: '87%',
      change: '+5% this month',
      trend: 'up',
      icon: Users,
      color: 'purple'
    }
  ];

  const getAlertColor = (type: string) => {
    const colors = {
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200',
      error: 'bg-red-100 text-red-800 border-red-200',
      success: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
        <p className="text-blue-100">
          {user.role} • {user.department} Department
        </p>
        <div className="mt-4 flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>All systems operational</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Last login: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const getMetricColor = (color: string) => {
            const colors = {
              green: 'bg-green-500',
              blue: 'bg-blue-500',
              orange: 'bg-orange-500',
              purple: 'bg-purple-500'
            };
            return colors[color as keyof typeof colors] || 'bg-gray-500';
          };
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${getMetricColor(metric.color)}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Indicators */}
      <PIMetrics metrics={piMetrics} />

      {/* Interactive Charts */}
      <InteractiveCharts />

      {/* Charts and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Incidents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Security Incidents</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {securityIncidents.slice(0, 4).map((incident) => (
              <div key={incident.id} className={`p-4 rounded-lg border ${getAlertColor(incident.severity === 'critical' ? 'error' : incident.severity === 'high' ? 'warning' : 'info')}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{incident.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{incident.region} • {incident.status}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(incident.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Active Projects</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {projectData.filter(p => p.status === 'in-progress').slice(0, 4).map((project) => (
              <div key={project.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{project.name}</h4>
                    <p className="text-xs text-gray-500">{project.team.length} team members</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    project.priority === 'critical' ? 'bg-red-100 text-red-800' :
                    project.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {project.priority}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <CheckCircle className="w-6 h-6 text-green-500 mb-2" />
            <h4 className="font-medium text-gray-900">Generate Report</h4>
            <p className="text-sm text-gray-500">Create executive summary</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <AlertTriangle className="w-6 h-6 text-orange-500 mb-2" />
            <h4 className="font-medium text-gray-900">Review Risks</h4>
            <p className="text-sm text-gray-500">Check security issues</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <TrendingUp className="w-6 h-6 text-blue-500 mb-2" />
            <h4 className="font-medium text-gray-900">Run Forecast</h4>
            <p className="text-sm text-gray-500">Predict trends</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;