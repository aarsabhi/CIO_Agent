import React, { useState } from 'react';
import { FileText, Download, RefreshCw, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { securityIncidents, projectData, piMetrics } from '../data/mockData';

const DailyBrief: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Generate brief data from real mock data
  const generateBriefData = () => {
    const criticalIncidents = securityIncidents.filter(i => i.severity === 'critical' || i.severity === 'high');
    const delayedProjects = projectData.filter(p => p.status === 'delayed');
    const completedProjects = projectData.filter(p => p.status === 'completed');
    const uptimeMetric = piMetrics.find(m => m.id === 'system-uptime');
    const mttrMetric = piMetrics.find(m => m.id === 'mttr');
    const satisfactionMetric = piMetrics.find(m => m.id === 'user-satisfaction');
    
    return {
      risks: [
        ...criticalIncidents.map(i => `${i.title} in ${i.region} - ${i.severity} severity`),
        ...delayedProjects.map(p => `${p.name} project delayed - ${p.progress}% complete`),
        "Budget overrun of 8.4% in Q4 infrastructure costs"
      ],
      wins: [
        ...completedProjects.map(p => `${p.name} completed successfully`),
        `System uptime achieved ${uptimeMetric?.value}% (target: ${uptimeMetric?.target}%)`,
        `MTTR improved to ${mttrMetric?.value}h (target: ${mttrMetric?.target}h)`,
        "Zero Trust Security implementation 45% complete ahead of schedule"
      ],
      blockers: [
        "Pending security patch deployment approval",
        "Resource constraints in DevOps team affecting project timelines",
        "APAC data integration delays impacting quarterly reporting",
        "Vendor approval process delayed for critical infrastructure updates"
      ],
      metrics: {
        uptime: `${uptimeMetric?.value}%`,
        incidents: securityIncidents.filter(i => i.status === 'open').length,
        resolution_time: `${mttrMetric?.value}h`,
        satisfaction: `${satisfactionMetric?.value}/5`
      }
    };
  };
  
  const [briefData, setBriefData] = useState(generateBriefData());

  const generateBrief = async () => {
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setBriefData(generateBriefData());
      setIsGenerating(false);
    }, 2000);
  };

  const exportBrief = () => {
    alert('Exporting daily brief as PDF...');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Daily Brief</h2>
            <p className="text-gray-500">Executive summary for {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportBrief}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={generateBrief}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Generate New Brief</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">System Uptime</p>
              <p className="text-2xl font-bold text-green-600">{briefData.metrics.uptime}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Incidents</p>
              <p className="text-2xl font-bold text-orange-600">{briefData.metrics.incidents}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Resolution</p>
              <p className="text-2xl font-bold text-blue-600">{briefData.metrics.resolution_time}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">User Satisfaction</p>
              <p className="text-2xl font-bold text-purple-600">{briefData.metrics.satisfaction}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Brief Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risks */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">Key Risks</h3>
          </div>
          <div className="space-y-3">
            {briefData.risks.map((risk, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700">{risk}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wins */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Key Wins</h3>
          </div>
          <div className="space-y-3">
            {briefData.wins.map((win, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700">{win}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Blockers */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Current Blockers</h3>
          </div>
          <div className="space-y-3">
            {briefData.blockers.map((blocker, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700">{blocker}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Executive Summary</h3>
        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">
            Today's IT operations show strong performance with {briefData.metrics.uptime} uptime and improved 
            incident resolution times. The team successfully completed several key initiatives while maintaining 
            service quality standards.
          </p>
          <p className="text-gray-700 mb-4">
            However, attention is needed for emerging risks in the EU-West region and pending security updates. 
            The APAC data integration delay continues to impact quarterly reporting timelines.
          </p>
          <p className="text-gray-700">
            Recommended actions include prioritizing security patch deployment, addressing regional performance 
            issues, and accelerating the APAC integration project to meet quarterly deadlines.
          </p>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Action Items</h3>
        <div className="space-y-3">
          {[
            { priority: 'High', task: 'Deploy security patches for authentication system', owner: 'Security Team', due: '2 days' },
            { priority: 'Medium', task: 'Investigate EU-West performance issues', owner: 'Infrastructure Team', due: '1 week' },
            { priority: 'Medium', task: 'Complete APAC data integration', owner: 'Data Team', due: '2 weeks' },
            { priority: 'Low', task: 'Review Q4 cloud infrastructure costs', owner: 'Finance Team', due: '1 month' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  item.priority === 'High' ? 'bg-red-100 text-red-800' :
                  item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {item.priority}
                </span>
                <span className="text-sm text-gray-900">{item.task}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{item.owner}</span>
                <span>Due: {item.due}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyBrief;