import React, { useState } from 'react';
import { BarChart3, LineChart, PieChart, TrendingUp, Filter, Download } from 'lucide-react';
import { systemMetrics, timeSeriesData, regionalData } from '../data/mockData';

const InteractiveCharts: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'pie'>('line');
  const [selectedMetric, setSelectedMetric] = useState('uptime');
  const [timeRange, setTimeRange] = useState('24h');

  const chartTypes = [
    { id: 'line', icon: LineChart, label: 'Line Chart' },
    { id: 'bar', icon: BarChart3, label: 'Bar Chart' },
    { id: 'pie', icon: PieChart, label: 'Pie Chart' }
  ];

  const metrics = [
    { id: 'uptime', label: 'System Uptime', unit: '%' },
    { id: 'performance', label: 'Performance Score', unit: 'pts' },
    { id: 'incidents', label: 'Incidents', unit: 'count' },
    { id: 'costs', label: 'Daily Costs', unit: '$' }
  ];

  const timeRanges = [
    { id: '24h', label: 'Last 24 Hours' },
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '90d', label: 'Last 90 Days' }
  ];

  const getChartData = () => {
    switch (timeRange) {
      case '24h':
        return systemMetrics.slice(-24);
      case '7d':
        return timeSeriesData.slice(-7);
      case '30d':
        return timeSeriesData.slice(-30);
      default:
        return timeSeriesData;
    }
  };

  const renderLineChart = () => {
    const data = getChartData();
    const maxValue = Math.max(...data.map(d => d[selectedMetric as keyof typeof d] as number));
    
    return (
      <div className="h-64 flex items-end justify-between space-x-1 px-4">
        {data.map((point, index) => {
          const value = point[selectedMetric as keyof typeof point] as number;
          const height = (value / maxValue) * 100;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center group">
              <div 
                className="w-full bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600 cursor-pointer relative"
                style={{ height: `${height}%` }}
                title={`${value.toFixed(2)} ${metrics.find(m => m.id === selectedMetric)?.unit}`}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {value.toFixed(2)}
                </div>
              </div>
              <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                {timeRange === '24h' 
                  ? new Date(point.timestamp || point.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : new Date(point.date).toLocaleDateString([], { month: 'short', day: 'numeric' })
                }
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderBarChart = () => {
    const regions = Object.entries(regionalData);
    const maxValue = Math.max(...regions.map(([_, data]) => data[selectedMetric as keyof typeof data]));
    
    return (
      <div className="h-64 flex items-end justify-between space-x-4 px-4">
        {regions.map(([region, data]) => {
          const value = data[selectedMetric as keyof typeof data];
          const height = (value / maxValue) * 100;
          
          return (
            <div key={region} className="flex-1 flex flex-col items-center group">
              <div 
                className="w-full bg-green-500 rounded-t-sm transition-all duration-300 hover:bg-green-600 cursor-pointer relative"
                style={{ height: `${height}%` }}
                title={`${value} ${metrics.find(m => m.id === selectedMetric)?.unit}`}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {value}
                </div>
              </div>
              <span className="text-xs text-gray-500 mt-2 text-center">{region}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPieChart = () => {
    const regions = Object.entries(regionalData);
    const total = regions.reduce((sum, [_, data]) => sum + data[selectedMetric as keyof typeof data], 0);
    let currentAngle = 0;
    
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
    
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {regions.map(([region, data], index) => {
              const value = data[selectedMetric as keyof typeof data];
              const percentage = (value / total) * 100;
              const angle = (percentage / 100) * 360;
              
              const x1 = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
              const y1 = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
              const x2 = 50 + 40 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
              const y2 = 50 + 40 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              currentAngle += angle;
              
              return (
                <path
                  key={region}
                  d={pathData}
                  fill={colors[index]}
                  className="hover:opacity-80 cursor-pointer transition-opacity"
                  title={`${region}: ${value} (${percentage.toFixed(1)}%)`}
                />
              );
            })}
          </svg>
          
          {/* Legend */}
          <div className="absolute -right-24 top-0 space-y-2">
            {regions.map(([region, data], index) => {
              const value = data[selectedMetric as keyof typeof data];
              const percentage = ((value / total) * 100).toFixed(1);
              
              return (
                <div key={region} className="flex items-center space-x-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[index] }}
                  />
                  <span className="text-gray-700">{region}</span>
                  <span className="text-gray-500">({percentage}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'line':
        return renderLineChart();
      case 'bar':
        return renderBarChart();
      case 'pie':
        return renderPieChart();
      default:
        return renderLineChart();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Interactive Analytics</h3>
        
        <div className="flex items-center space-x-4">
          {/* Chart Type Selector */}
          <div className="flex items-center space-x-2">
            {chartTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedChart(type.id as any)}
                  className={`p-2 rounded-lg transition-colors ${
                    selectedChart === type.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title={type.label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
          
          {/* Metric Selector */}
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {metrics.map((metric) => (
              <option key={metric.id} value={metric.id}>
                {metric.label}
              </option>
            ))}
          </select>
          
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {timeRanges.map((range) => (
              <option key={range.id} value={range.id}>
                {range.label}
              </option>
            ))}
          </select>
          
          {/* Export Button */}
          <button className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 text-sm">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      {/* Chart */}
      <div className="border border-gray-200 rounded-lg p-4">
        {renderChart()}
      </div>
      
      {/* Chart Info */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>Showing: {metrics.find(m => m.id === selectedMetric)?.label}</span>
          <span>•</span>
          <span>Period: {timeRanges.find(r => r.id === timeRange)?.label}</span>
        </div>
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default InteractiveCharts;