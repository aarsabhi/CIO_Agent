// Mock data for the CIO Dashboard
export interface User {
  email: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
}

export interface PIMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  category: 'performance' | 'security' | 'financial' | 'operational';
  description: string;
  lastUpdated: string;
}

export interface SystemMetric {
  timestamp: string;
  uptime: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  incidents: number;
  performance: number;
  costs: number;
}

export interface SecurityIncident {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved';
  region: string;
  timestamp: string;
  description: string;
  affectedSystems: string[];
}

export interface BudgetData {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  variance: number;
  projects: string[];
}

export interface ProjectData {
  id: string;
  name: string;
  status: 'planning' | 'in-progress' | 'testing' | 'completed' | 'delayed';
  progress: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  team: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// Performance Indicators (PI) Data
export const piMetrics: PIMetric[] = [
  {
    id: 'system-uptime',
    name: 'System Uptime',
    value: 99.97,
    target: 99.95,
    unit: '%',
    trend: 'up',
    change: 0.03,
    category: 'performance',
    description: 'Overall system availability across all regions',
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    id: 'mttr',
    name: 'Mean Time to Resolution',
    value: 2.3,
    target: 4.0,
    unit: 'hours',
    trend: 'down',
    change: -0.7,
    category: 'operational',
    description: 'Average time to resolve critical incidents',
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    id: 'security-score',
    name: 'Security Posture Score',
    value: 94,
    target: 90,
    unit: 'points',
    trend: 'up',
    change: 2,
    category: 'security',
    description: 'Composite security assessment score',
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    id: 'budget-efficiency',
    name: 'Budget Efficiency',
    value: 87,
    target: 85,
    unit: '%',
    trend: 'up',
    change: 3,
    category: 'financial',
    description: 'IT budget utilization efficiency',
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    id: 'user-satisfaction',
    name: 'User Satisfaction',
    value: 4.2,
    target: 4.0,
    unit: '/5',
    trend: 'up',
    change: 0.2,
    category: 'operational',
    description: 'Average user satisfaction rating',
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    id: 'automation-rate',
    name: 'Process Automation',
    value: 73,
    target: 80,
    unit: '%',
    trend: 'up',
    change: 5,
    category: 'operational',
    description: 'Percentage of automated IT processes',
    lastUpdated: '2024-01-15T10:30:00Z'
  }
];

// System Performance Data (last 24 hours)
export const systemMetrics: SystemMetric[] = Array.from({ length: 24 }, (_, i) => ({
  timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
  uptime: 99.5 + Math.random() * 0.5,
  responseTime: 150 + Math.random() * 100,
  throughput: 8000 + Math.random() * 2000,
  errorRate: Math.random() * 0.5,
  cpuUsage: 60 + Math.random() * 30,
  memoryUsage: 70 + Math.random() * 20,
  incidents: Math.floor(Math.random() * 5),
  performance: 85 + Math.random() * 15,
  costs: 50000 + Math.random() * 20000
}));

// Security Incidents
export const securityIncidents: SecurityIncident[] = [
  {
    id: 'SEC-001',
    title: 'Suspicious Login Attempts',
    severity: 'medium',
    status: 'investigating',
    region: 'EU-Central',
    timestamp: '2024-01-15T08:45:00Z',
    description: 'Multiple failed login attempts detected from unusual IP ranges',
    affectedSystems: ['Active Directory', 'VPN Gateway']
  },
  {
    id: 'SEC-002',
    title: 'Malware Detection',
    severity: 'high',
    status: 'resolved',
    region: 'US-East',
    timestamp: '2024-01-14T14:20:00Z',
    description: 'Malware detected and quarantined on endpoint devices',
    affectedSystems: ['Endpoint Protection', 'Email Security']
  },
  {
    id: 'SEC-003',
    title: 'Data Exfiltration Attempt',
    severity: 'critical',
    status: 'open',
    region: 'APAC',
    timestamp: '2024-01-15T06:15:00Z',
    description: 'Unusual data transfer patterns detected',
    affectedSystems: ['Database Servers', 'Network Monitoring']
  }
];

// Budget Data
export const budgetData: BudgetData[] = [
  {
    category: 'Infrastructure',
    allocated: 12500000,
    spent: 10200000,
    remaining: 2300000,
    variance: -8.4,
    projects: ['Cloud Migration', 'Network Upgrade', 'Data Center Expansion']
  },
  {
    category: 'Security',
    allocated: 8000000,
    spent: 7100000,
    remaining: 900000,
    variance: 11.25,
    projects: ['Zero Trust Implementation', 'SIEM Upgrade', 'Security Training']
  },
  {
    category: 'Software Licenses',
    allocated: 15000000,
    spent: 14200000,
    remaining: 800000,
    variance: 5.33,
    projects: ['Enterprise Software Renewal', 'New Analytics Platform']
  },
  {
    category: 'Personnel',
    allocated: 25000000,
    spent: 23800000,
    remaining: 1200000,
    variance: 4.8,
    projects: ['Team Expansion', 'Training Programs', 'Contractor Services']
  }
];

// Project Data
export const projectData: ProjectData[] = [
  {
    id: 'PROJ-001',
    name: 'Cloud Migration Phase 2',
    status: 'in-progress',
    progress: 67,
    budget: 5000000,
    spent: 3200000,
    startDate: '2023-09-01',
    endDate: '2024-03-31',
    team: ['Alice Johnson', 'Bob Chen', 'Carol Davis', 'David Wilson'],
    priority: 'high'
  },
  {
    id: 'PROJ-002',
    name: 'Zero Trust Security Implementation',
    status: 'in-progress',
    progress: 45,
    budget: 3500000,
    spent: 1400000,
    startDate: '2023-11-01',
    endDate: '2024-06-30',
    team: ['Eve Martinez', 'Frank Thompson', 'Grace Lee'],
    priority: 'critical'
  },
  {
    id: 'PROJ-003',
    name: 'Data Analytics Platform',
    status: 'testing',
    progress: 85,
    budget: 2800000,
    spent: 2500000,
    startDate: '2023-06-01',
    endDate: '2024-01-31',
    team: ['Henry Kim', 'Iris Rodriguez', 'Jack Brown'],
    priority: 'medium'
  },
  {
    id: 'PROJ-004',
    name: 'Network Infrastructure Upgrade',
    status: 'delayed',
    progress: 30,
    budget: 4200000,
    spent: 1800000,
    startDate: '2023-10-01',
    endDate: '2024-05-31',
    team: ['Kate Anderson', 'Liam O\'Connor', 'Maya Patel'],
    priority: 'high'
  },
  {
    id: 'PROJ-005',
    name: 'Employee Training Portal',
    status: 'completed',
    progress: 100,
    budget: 800000,
    spent: 750000,
    startDate: '2023-08-01',
    endDate: '2023-12-31',
    team: ['Noah Taylor', 'Olivia White'],
    priority: 'low'
  }
];

// Regional Performance Data
export const regionalData = {
  'US-East': {
    uptime: 99.98,
    incidents: 2,
    users: 15000,
    performance: 95,
    latency: 45
  },
  'US-West': {
    uptime: 99.95,
    incidents: 1,
    users: 12000,
    performance: 92,
    latency: 38
  },
  'EU-Central': {
    uptime: 99.92,
    incidents: 4,
    users: 18000,
    performance: 88,
    latency: 62
  },
  'APAC': {
    uptime: 99.89,
    incidents: 6,
    users: 22000,
    performance: 85,
    latency: 78
  }
};

// Risk Assessment Data
export const riskData = [
  {
    id: 'RISK-001',
    title: 'Legacy System Dependencies',
    probability: 'High',
    impact: 'High',
    severity: 'Critical',
    mitigation: 'Accelerate modernization roadmap',
    owner: 'Architecture Team',
    dueDate: '2024-06-30'
  },
  {
    id: 'RISK-002',
    title: 'Cybersecurity Threats',
    probability: 'Medium',
    impact: 'Critical',
    severity: 'High',
    mitigation: 'Enhanced monitoring and training',
    owner: 'Security Team',
    dueDate: '2024-03-31'
  },
  {
    id: 'RISK-003',
    title: 'Talent Retention',
    probability: 'Medium',
    impact: 'Medium',
    severity: 'Medium',
    mitigation: 'Competitive compensation review',
    owner: 'HR Team',
    dueDate: '2024-04-30'
  }
];

// Generate time-series data for charts
export const generateTimeSeriesData = (days: number = 30) => {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    data.push({
      date: date.toISOString().split('T')[0],
      uptime: 99.5 + Math.random() * 0.5,
      incidents: Math.floor(Math.random() * 5),
      performance: 85 + Math.random() * 15,
      costs: 50000 + Math.random() * 20000
    });
  }
  
  return data;
};

export const timeSeriesData = generateTimeSeriesData();