import React, { useState } from 'react';
import { TrendingUp, Download, Settings, BarChart3, LineChart, PieChart } from 'lucide-react';

const Forecast: React.FC = () => {
  const [budgetIncrease, setBudgetIncrease] = useState(20);
  const [timeHorizon, setTimeHorizon] = useState(12);
  const [selectedMetric, setSelectedMetric] = useState('performance');

  const scenarios = [
    {
      name: 'Conservative',
      probability: 30,
      outcome: 'Maintain current performance levels',
      impact: '+5% efficiency',
      color: 'bg-blue-500'
    },
    {
      name: 'Optimistic',
      probability: 50,
      outcome: 'Significant improvements in all metrics',
      impact: '+25% efficiency',
      color: 'bg-green-500'
    },
    {
      name: 'Pessimistic',
      probability: 20,
      outcome: 'Potential performance degradation',
      impact: '-10% efficiency',
      color: 'bg-red-500'
    }
  ];

  const forecastData = [
    { month: 'Jan', value: 85 },
    { month: 'Feb', value: 88 },
    { month: 'Mar', value: 91 },
    { month: 'Apr', value: 87 },
    { month: 'May', value: 94 },
    { month: 'Jun', value: 97 },
    { month: 'Jul', value: 95 },
    { month: 'Aug', value: 99 },
    { month: 'Sep', value: 102 },
    { month: 'Oct', value: 105 },
    { month: 'Nov', value: 108 },
    { month: 'Dec', value: 112 }
  ];

  const generateForecast = () => {
    // Simulate forecast generation
    alert('Generating forecast with current parameters...');
  };

  const exportReport = () => {
    // Simulate report export
    alert('Exporting forecast report as PDF...');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">What-If Forecast</h2>
            <p className="text-gray-500">Scenario analysis and predictions</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportReport}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={generateForecast}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Forecast
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Impact</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Increase: {budgetIncrease}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={budgetIncrease}
                onChange={(e) => setBudgetIncrease(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="text-sm text-gray-600">
              Estimated impact: ${(budgetIncrease * 50000).toLocaleString()} additional budget
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Horizon</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Forecast Period: {timeHorizon} months
              </label>
              <input
                type="range"
                min="3"
                max="36"
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="text-sm text-gray-600">
              Forecast until: {new Date(Date.now() + timeHorizon * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Metric Focus</h3>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="performance">System Performance</option>
            <option value="security">Security Score</option>
            <option value="uptime">Uptime</option>
            <option value="cost">Cost Efficiency</option>
            <option value="satisfaction">User Satisfaction</option>
          </select>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Forecast Visualization</h3>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            <LineChart className="w-5 h-5 text-blue-600" />
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        <div className="h-64 flex items-end justify-between space-x-2">
          {forecastData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className={`w-full rounded-t-sm transition-all duration-300 ${
                  index < 6 ? 'bg-blue-400' : 'bg-blue-600'
                }`}
                style={{ height: `${(data.value / 120) * 100}%` }}
              />
              <span className="text-xs text-gray-500 mt-2">{data.month}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>Historical Data</span>
          <span>Forecast Period</span>
        </div>
      </div>

      {/* Scenario Analysis */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Scenario Analysis</h3>
        <div className="space-y-4">
          {scenarios.map((scenario, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${scenario.color}`} />
                  <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                </div>
                <div className="text-sm text-gray-500">{scenario.probability}% probability</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Outcome: </span>
                  <span className="text-gray-600">{scenario.outcome}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Impact: </span>
                  <span className="text-gray-600">{scenario.impact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Increase infrastructure investment by 15-20% for optimal performance</li>
              <li>• Focus on APAC region improvements for maximum impact</li>
              <li>• Implement security upgrades within next 6 months</li>
              <li>• Consider cloud migration for cost efficiency</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Risk Factors</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Market volatility could impact budget allocation</li>
              <li>• Regulatory changes may require additional compliance costs</li>
              <li>• Technology obsolescence risks in legacy systems</li>
              <li>• Talent acquisition challenges in specialized areas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecast;