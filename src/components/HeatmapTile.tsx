import React, { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, Globe } from 'lucide-react';

interface HeatmapData {
  region: string;
  domain: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  value: number;
  incidents: number;
}

const HeatmapTile: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('24h');

  const heatmapData: HeatmapData[] = [
    { region: 'US-East', domain: 'Security', severity: 'high', value: 85, incidents: 3 },
    { region: 'US-East', domain: 'Performance', severity: 'medium', value: 65, incidents: 1 },
    { region: 'US-East', domain: 'Availability', severity: 'low', value: 25, incidents: 0 },
    { region: 'US-West', domain: 'Security', severity: 'medium', value: 60, incidents: 2 },
    { region: 'US-West', domain: 'Performance', severity: 'low', value: 30, incidents: 0 },
    { region: 'US-West', domain: 'Availability', severity: 'high', value: 80, incidents: 2 },
    { region: 'EU-Central', domain: 'Security', severity: 'low', value: 20, incidents: 0 },
    { region: 'EU-Central', domain: 'Performance', severity: 'critical', value: 95, incidents: 5 },
    { region: 'EU-Central', domain: 'Availability', severity: 'medium', value: 55, incidents: 1 },
    { region: 'APAC', domain: 'Security', severity: 'medium', value: 70, incidents: 2 },
    { region: 'APAC', domain: 'Performance', severity: 'high', value: 90, incidents: 4 },
    { region: 'APAC', domain: 'Availability', severity: 'critical', value: 100, incidents: 6 },
  ];

  const regions = ['US-East', 'US-West', 'EU-Central', 'APAC'];
  const domains = ['Security', 'Performance', 'Availability'];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-200 text-green-800';
      case 'medium': return 'bg-yellow-200 text-yellow-800';
      case 'high': return 'bg-orange-200 text-orange-800';
      case 'critical': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getIntensityColor = (value: number) => {
    if (value >= 80) return 'bg-red-500';
    if (value >= 60) return 'bg-orange-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRegionData = (region: string) => {
    return heatmapData.filter(d => d.region === region);
  };

  const getTotalIncidents = () => {
    return heatmapData.reduce((sum, d) => sum + d.incidents, 0);
  };

  const getCriticalRegions = () => {
    return heatmapData.filter(d => d.severity === 'critical').length;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Activity className="w-8 h-8 text-red-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Risk Heatmap</h2>
            <p className="text-gray-500">Real-time anomaly detection by region</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Incidents</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalIncidents()}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Critical Alerts</p>
              <p className="text-2xl font-bold text-red-600">{getCriticalRegions()}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Regions Monitored</p>
              <p className="text-2xl font-bold text-blue-600">{regions.length}</p>
            </div>
            <Globe className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Response Time</p>
              <p className="text-2xl font-bold text-green-600">2.3m</p>
            </div>
            <Clock className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Regional Risk Matrix</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-3 text-sm font-medium text-gray-700">Region</th>
                {domains.map(domain => (
                  <th key={domain} className="text-center p-3 text-sm font-medium text-gray-700">
                    {domain}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {regions.map(region => (
                <tr key={region} className="hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-900">{region}</td>
                  {domains.map(domain => {
                    const data = heatmapData.find(d => d.region === region && d.domain === domain);
                    return (
                      <td key={domain} className="p-3 text-center">
                        {data && (
                          <div
                            className={`w-12 h-12 rounded-lg mx-auto cursor-pointer hover:opacity-80 transition-opacity ${getIntensityColor(data.value)}`}
                            onClick={() => setSelectedRegion(region)}
                            title={`${region} - ${domain}: ${data.severity} (${data.incidents} incidents)`}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Severity:</span>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Low</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm text-gray-600">Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm text-gray-600">High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">Critical</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Detailed View */}
      {selectedRegion && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedRegion} - Detailed Analysis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getRegionData(selectedRegion).map((data, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{data.domain}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(data.severity)}`}>
                    {data.severity}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Risk Score:</span>
                    <span className="font-medium">{data.value}/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Incidents:</span>
                    <span className="font-medium">{data.incidents}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getIntensityColor(data.value)}`}
                      style={{ width: `${data.value}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setSelectedRegion(null)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeatmapTile;