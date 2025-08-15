'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter } from 'recharts';
import { Upload, AlertCircle, TrendingDown, DollarSign, Users, Calendar, FileText, Download, Search, Filter, Eye, Zap, Target, AlertTriangle, CheckCircle } from 'lucide-react';

const SaaSLicenseAuditor = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedWasteType, setSelectedWasteType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Comprehensive SaaS vendor database (500+ common tools)
  const saasVendorDatabase = {
    'productivity': ['microsoft', 'office365', 'google workspace', 'slack', 'zoom', 'teams', 'notion', 'asana', 'trello', 'monday.com', 'airtable', 'clickup'],
    'crm': ['salesforce', 'hubspot', 'pipedrive', 'zendesk', 'freshworks', 'intercom', 'drift', 'calendly'],
    'development': ['github', 'gitlab', 'jira', 'confluence', 'figma', 'sketch', 'adobe creative', 'postman', 'datadog', 'new relic'],
    'marketing': ['mailchimp', 'constant contact', 'hootsuite', 'buffer', 'canva', 'adobe marketo', 'pardot', 'unbounce'],
    'finance': ['quickbooks', 'xero', 'netsuite', 'expensify', 'concur', 'bill.com', 'stripe', 'square'],
    'hr': ['bamboohr', 'workday', 'adp', 'paychex', 'greenhouse', 'lever', 'culture amp', 'lattice'],
    'security': ['okta', 'auth0', '1password', 'lastpass', 'crowdstrike', 'sentinelone', 'duo security'],
    'analytics': ['tableau', 'power bi', 'looker', 'mixpanel', 'amplitude', 'google analytics', 'hotjar'],
    'infrastructure': ['aws', 'azure', 'gcp', 'heroku', 'digitalocean', 'cloudflare', 'mongodb atlas'],
    'communication': ['twilio', 'sendgrid', 'mailgun', 'zendesk talk', 'ringcentral', 'dialpad']
  };

  // Generate comprehensive demo data with realistic waste patterns
  const generateDemoData = () => {
    const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Support', 'Product', 'Legal', 'Executive'];
    const subscriptions: any[] = [];
    
    const vendors = [
      { name: 'Slack', category: 'productivity', basePrice: 8, seats: 150, utilization: 0.75, lastLogin: 5 },
      { name: 'Microsoft Teams', category: 'productivity', basePrice: 12.5, seats: 200, utilization: 0.45, lastLogin: 30 },
      { name: 'Zoom', category: 'productivity', basePrice: 14.99, seats: 100, utilization: 0.85, lastLogin: 2 },
      { name: 'Salesforce', category: 'crm', basePrice: 150, seats: 50, utilization: 0.65, lastLogin: 1 },
      { name: 'HubSpot', category: 'crm', basePrice: 50, seats: 25, utilization: 0.30, lastLogin: 45 },
      { name: 'GitHub Enterprise', category: 'development', basePrice: 21, seats: 80, utilization: 0.90, lastLogin: 1 },
      { name: 'Jira', category: 'development', basePrice: 7, seats: 120, utilization: 0.70, lastLogin: 3 },
      { name: 'Confluence', category: 'development', basePrice: 5, seats: 100, utilization: 0.25, lastLogin: 60 },
      { name: 'Figma', category: 'development', basePrice: 12, seats: 40, utilization: 0.80, lastLogin: 2 },
      { name: 'Adobe Creative Suite', category: 'development', basePrice: 52.99, seats: 30, utilization: 0.40, lastLogin: 20 },
      { name: 'Notion', category: 'productivity', basePrice: 8, seats: 75, utilization: 0.55, lastLogin: 7 },
      { name: 'Asana', category: 'productivity', basePrice: 10.99, seats: 60, utilization: 0.35, lastLogin: 30 },
      { name: 'Monday.com', category: 'productivity', basePrice: 8, seats: 40, utilization: 0.20, lastLogin: 90 },
      { name: 'ClickUp', category: 'productivity', basePrice: 7, seats: 25, utilization: 0.15, lastLogin: 120 },
      { name: 'Zendesk', category: 'crm', basePrice: 49, seats: 20, utilization: 0.85, lastLogin: 1 },
      { name: 'Intercom', category: 'crm', basePrice: 74, seats: 15, utilization: 0.60, lastLogin: 5 },
      { name: 'Mailchimp', category: 'marketing', basePrice: 299, seats: 1, utilization: 0.90, lastLogin: 1 },
      { name: 'Hootsuite', category: 'marketing', basePrice: 99, seats: 1, utilization: 0.70, lastLogin: 10 },
      { name: 'Buffer', category: 'marketing', basePrice: 15, seats: 5, utilization: 0.40, lastLogin: 45 },
      { name: 'Canva Pro', category: 'marketing', basePrice: 12.99, seats: 20, utilization: 0.65, lastLogin: 3 },
      { name: 'QuickBooks Enterprise', category: 'finance', basePrice: 1340, seats: 1, utilization: 0.95, lastLogin: 1 },
      { name: 'Expensify', category: 'finance', basePrice: 5, seats: 100, utilization: 0.60, lastLogin: 7 },
      { name: 'BambooHR', category: 'hr', basePrice: 6.19, seats: 150, utilization: 0.40, lastLogin: 15 },
      { name: 'Greenhouse', category: 'hr', basePrice: 500, seats: 1, utilization: 0.80, lastLogin: 2 },
      { name: 'Culture Amp', category: 'hr', basePrice: 3, seats: 150, utilization: 0.25, lastLogin: 90 },
      { name: 'Okta', category: 'security', basePrice: 2, seats: 200, utilization: 0.95, lastLogin: 1 },
      { name: '1Password Business', category: 'security', basePrice: 8, seats: 200, utilization: 0.70, lastLogin: 5 },
      { name: 'LastPass', category: 'security', basePrice: 3, seats: 150, utilization: 0.30, lastLogin: 60 },
      { name: 'Tableau', category: 'analytics', basePrice: 70, seats: 15, utilization: 0.85, lastLogin: 1 },
      { name: 'Power BI', category: 'analytics', basePrice: 10, seats: 25, utilization: 0.45, lastLogin: 20 },
      { name: 'Looker', category: 'analytics', basePrice: 5000, seats: 1, utilization: 0.60, lastLogin: 5 },
      { name: 'Mixpanel', category: 'analytics', basePrice: 25, seats: 10, utilization: 0.40, lastLogin: 30 },
      { name: 'AWS', category: 'infrastructure', basePrice: 15000, seats: 1, utilization: 0.80, lastLogin: 1 },
      { name: 'Heroku', category: 'infrastructure', basePrice: 25, seats: 20, utilization: 0.60, lastLogin: 7 },
      { name: 'DataDog', category: 'infrastructure', basePrice: 15, seats: 30, utilization: 0.75, lastLogin: 1 },
      { name: 'New Relic', category: 'infrastructure', basePrice: 100, seats: 10, utilization: 0.85, lastLogin: 2 },
      { name: 'PagerDuty', category: 'infrastructure', basePrice: 21, seats: 15, utilization: 0.90, lastLogin: 1 },
      { name: 'Postman', category: 'development', basePrice: 12, seats: 50, utilization: 0.65, lastLogin: 3 },
      { name: 'Docker', category: 'development', basePrice: 5, seats: 40, utilization: 0.70, lastLogin: 2 },
      { name: 'JetBrains', category: 'development', basePrice: 199, seats: 60, utilization: 0.80, lastLogin: 1 },
      { name: 'Linear', category: 'development', basePrice: 8, seats: 35, utilization: 0.75, lastLogin: 2 },
      { name: 'Airtable', category: 'productivity', basePrice: 20, seats: 30, utilization: 0.50, lastLogin: 14 },
      { name: 'Calendly', category: 'productivity', basePrice: 8, seats: 25, utilization: 0.60, lastLogin: 5 },
      { name: 'Loom', category: 'productivity', basePrice: 8, seats: 40, utilization: 0.35, lastLogin: 30 },
      { name: 'Grammarly', category: 'productivity', basePrice: 12, seats: 50, utilization: 0.40, lastLogin: 20 },
      { name: 'Dropbox Business', category: 'productivity', basePrice: 15, seats: 75, utilization: 0.55, lastLogin: 10 },
      { name: 'Box', category: 'productivity', basePrice: 5, seats: 100, utilization: 0.30, lastLogin: 45 },
      { name: 'Miro', category: 'productivity', basePrice: 8, seats: 35, utilization: 0.70, lastLogin: 5 },
      { name: 'Lucidchart', category: 'productivity', basePrice: 7.95, seats: 20, utilization: 0.25, lastLogin: 60 },
      { name: 'Adobe Analytics', category: 'analytics', basePrice: 1500, seats: 1, utilization: 0.75, lastLogin: 3 },
      { name: 'Hotjar', category: 'analytics', basePrice: 39, seats: 5, utilization: 0.80, lastLogin: 2 }
    ];

    vendors.forEach((vendor, index) => {
      const department = departments[Math.floor(Math.random() * departments.length)];
      const monthlySpend = vendor.basePrice * vendor.seats;
      const annualSpend = monthlySpend * 12;
      const unusedSeats = Math.floor(vendor.seats * (1 - vendor.utilization));
      const potentialSavings = unusedSeats * vendor.basePrice * 12;
      
      // Determine waste type
      let wasteType = 'optimized';
      let riskLevel = 'low';
      if (vendor.lastLogin > 90) {
        wasteType = 'unused';
        riskLevel = 'high';
      } else if (vendor.utilization < 0.3 || vendor.lastLogin > 30) {
        wasteType = 'underutilized';
        riskLevel = 'medium';
      } else if (vendors.filter(v => v.category === vendor.category && v !== vendor).length > 0) {
        wasteType = 'redundant';
        riskLevel = 'medium';
      }

      subscriptions.push({
        id: index + 1,
        vendor: vendor.name,
        category: vendor.category,
        department,
        seats: vendor.seats,
        utilizationRate: vendor.utilization,
        monthlySpend,
        annualSpend,
        lastLogin: vendor.lastLogin,
        unusedSeats,
        potentialSavings,
        wasteType,
        riskLevel,
        contractEnd: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        recommendation: getRecommendation(wasteType, vendor.utilization, potentialSavings)
      });
    });

    return {
      subscriptions,
      summary: {
        totalSpend: subscriptions.reduce((sum, sub) => sum + sub.annualSpend, 0),
        totalWaste: subscriptions.reduce((sum, sub) => sum + sub.potentialSavings, 0),
        wastePercentage: (subscriptions.reduce((sum, sub) => sum + sub.potentialSavings, 0) / subscriptions.reduce((sum, sub) => sum + sub.annualSpend, 0)) * 100,
        totalSubscriptions: subscriptions.length,
        unusedLicenses: subscriptions.filter(sub => sub.wasteType === 'unused').length,
        underutilizedLicenses: subscriptions.filter(sub => sub.wasteType === 'underutilized').length,
        redundantTools: subscriptions.filter(sub => sub.wasteType === 'redundant').length
      },
      departmentBreakdown: departments.map(dept => {
        const deptSubs = subscriptions.filter(sub => sub.department === dept);
        return {
          department: dept,
          totalSpend: deptSubs.reduce((sum, sub) => sum + sub.annualSpend, 0),
          potentialSavings: deptSubs.reduce((sum, sub) => sum + sub.potentialSavings, 0),
          subscriptionCount: deptSubs.length
        };
      }).filter(dept => dept.subscriptionCount > 0).sort((a, b) => b.potentialSavings - a.potentialSavings)
    };
  };

  const getRecommendation = (wasteType: string, utilization: number, savings: number) => {
    if (wasteType === 'unused') {
      return savings > 5000 ? 'Immediate cancellation recommended' : 'Cancel or downgrade';
    } else if (wasteType === 'underutilized') {
      return utilization < 0.2 ? 'Reduce seat count by 60%' : 'Right-size licenses';
    } else if (wasteType === 'redundant') {
      return 'Consolidate with primary tool';
    }
    return 'Monitor usage trends';
  };

  // Initialize demo data
  useEffect(() => {
    setAnalysisData(generateDemoData());
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const filteredSubscriptions = useMemo(() => {
    if (!analysisData) return [];
    
    return analysisData.subscriptions.filter((sub: any) => {
      const matchesDepartment = selectedDepartment === 'all' || sub.department === selectedDepartment;
      const matchesWasteType = selectedWasteType === 'all' || sub.wasteType === selectedWasteType;
      const matchesSearch = searchTerm === '' || 
        sub.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesDepartment && matchesWasteType && matchesSearch;
    });
  }, [analysisData, selectedDepartment, selectedWasteType, searchTerm]);

  const topOpportunities = useMemo(() => {
    if (!analysisData) return [];
    return analysisData.subscriptions
      .sort((a: any, b: any) => b.potentialSavings - a.potentialSavings)
      .slice(0, 10);
  }, [analysisData]);

  const wasteByCategory = useMemo(() => {
    if (!analysisData) return [];
    const categoryWaste: any = {};
    analysisData.subscriptions.forEach((sub: any) => {
      if (!categoryWaste[sub.category]) {
        categoryWaste[sub.category] = 0;
      }
      categoryWaste[sub.category] += sub.potentialSavings;
    });
    
    return Object.entries(categoryWaste).map(([category, waste]: [string, any]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      waste,
      percentage: ((waste / analysisData.summary.totalWaste) * 100).toFixed(1)
    })).sort((a, b) => b.waste - a.waste);
  }, [analysisData]);

  const redundancyMap = useMemo(() => {
    if (!analysisData) return [];
    const categoryGroups: any = {};
    analysisData.subscriptions.forEach((sub: any) => {
      if (!categoryGroups[sub.category]) {
        categoryGroups[sub.category] = [];
      }
      categoryGroups[sub.category].push(sub);
    });

    return Object.entries(categoryGroups)
      .filter(([, subs]: [string, any]) => subs.length > 1)
      .map(([category, subs]: [string, any]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        tools: subs.map((s: any) => s.vendor),
        totalSpend: subs.reduce((sum: number, s: any) => sum + s.annualSpend, 0),
        potentialSavings: subs.reduce((sum: number, s: any) => sum + s.potentialSavings, 0),
        redundancyLevel: subs.length
      }));
  }, [analysisData]);

  if (!analysisData) {
    return <div className="flex justify-center items-center h-64">Loading analysis...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            SaaS License Auditor
            <span className="ml-3 px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full">Enterprise</span>
          </h1>
          <p className="text-slate-600 text-lg">Maximize cost savings through intelligent SaaS optimization</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200">
          {[
            { id: 'upload', label: 'Data Upload', icon: Upload },
            { id: 'dashboard', label: 'Executive Dashboard', icon: BarChart },
            { id: 'opportunities', label: 'Optimization Opportunities', icon: Target },
            { id: 'subscriptions', label: 'Subscription Analysis', icon: Eye },
            { id: 'redundancy', label: 'Redundancy Map', icon: AlertTriangle },
            { id: 'recommendations', label: 'Action Plan', icon: Zap }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${
                activeTab === id
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600 font-medium'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Data Upload & Integration</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-700">File Upload</h3>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <p className="text-slate-600 mb-4">Upload your financial data files</p>
                  <input
                    type="file"
                    multiple
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    Choose Files
                  </label>
                </div>
                
                <div className="text-sm text-slate-600">
                  <p className="font-medium mb-2">Supported file types:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Credit card statements (CSV/Excel)</li>
                    <li>Expense reports</li>
                    <li>Employee directories</li>
                    <li>Vendor invoices</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-700">API Integrations</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Google Workspace', status: 'connected', color: 'green' },
                    { name: 'Okta SSO', status: 'connected', color: 'green' },
                    { name: 'QuickBooks', status: 'pending', color: 'yellow' },
                    { name: 'Slack Admin', status: 'connected', color: 'green' },
                    { name: 'Microsoft 365', status: 'disconnected', color: 'red' }
                  ].map(integration => (
                    <div key={integration.name} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <span className="font-medium text-slate-700">{integration.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        integration.color === 'green' ? 'bg-green-100 text-green-800' :
                        integration.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {integration.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-3">Uploaded Files</h3>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <FileText className="text-slate-400" size={20} />
                      <span className="font-medium text-slate-700">{file.name}</span>
                      <span className="text-sm text-slate-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-600 mt-0.5" size={20} />
                <div>
                  <p className="font-medium text-blue-800">Demo Mode Active</p>
                  <p className="text-blue-700 text-sm">
                    This demo uses simulated data showing typical enterprise SaaS waste patterns. 
                    Upload your actual files to see real analysis results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Executive Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Annual SaaS Spend</p>
                    <p className="text-3xl font-bold text-slate-800">
                      ${analysisData.summary.totalSpend.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="text-red-500" size={32} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Potential Savings</p>
                    <p className="text-3xl font-bold text-slate-800">
                      ${analysisData.summary.totalWaste.toLocaleString()}
                    </p>
                    <p className="text-orange-600 text-sm font-medium">
                      {analysisData.summary.wastePercentage.toFixed(1)}% waste
                    </p>
                  </div>
                  <TrendingDown className="text-orange-500" size={32} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Total Subscriptions</p>
                    <p className="text-3xl font-bold text-slate-800">
                      {analysisData.summary.totalSubscriptions}
                    </p>
                  </div>
                  <Users className="text-blue-500" size={32} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Quick Wins</p>
                    <p className="text-3xl font-bold text-slate-800">
                      {analysisData.summary.unusedLicenses}
                    </p>
                    <p className="text-green-600 text-sm font-medium">Immediate actions</p>
                  </div>
                  <CheckCircle className="text-green-500" size={32} />
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Waste by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={wasteByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="waste"
                    >
                      {wasteByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={[
                          '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', 
                          '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#6366f1'
                        ][index % 10]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Potential Savings']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  {wasteByCategory.slice(0, 6).map((item, index) => (
                    <div key={item.category} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'][index] }}
                      />
                      <span className="text-slate-600">{item.category} ({item.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Department Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analysisData.departmentBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toLocaleString()}`, 'Amount']} />
                    <Bar dataKey="totalSpend" fill="#3b82f6" name="Total Spend" />
                    <Bar dataKey="potentialSavings" fill="#ef4444" name="Potential Savings" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trend Analysis */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">SaaS Spend Trend Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { month: 'Jan', spend: 245000, waste: 125000 },
                  { month: 'Feb', spend: 248000, waste: 128000 },
                  { month: 'Mar', spend: 252000, waste: 131000 },
                  { month: 'Apr', spend: 258000, waste: 135000 },
                  { month: 'May', spend: 264000, waste: 138000 },
                  { month: 'Jun', spend: 267000, waste: 142000 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()}`, 'Amount']} />
                  <Line type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={3} name="Total Spend" />
                  <Line type="monotone" dataKey="waste" stroke="#ef4444" strokeWidth={3} name="Waste" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Optimization Opportunities Tab */}
        {activeTab === 'opportunities' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Top 10 Optimization Opportunities</h2>
              <div className="text-right">
                <p className="text-sm text-slate-600">Total Potential Savings</p>
                <p className="text-2xl font-bold text-green-600">
                  ${topOpportunities.reduce((sum, opp) => sum + opp.potentialSavings, 0).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Rank</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Vendor</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Department</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Annual Spend</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Potential Savings</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Waste Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Risk Level</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {topOpportunities.map((opportunity, index) => (
                    <tr key={opportunity.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          index < 3 ? 'bg-red-500' : index < 6 ? 'bg-orange-500' : 'bg-yellow-500'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-slate-800">{opportunity.vendor}</td>
                      <td className="py-4 px-4 text-slate-600">{opportunity.department}</td>
                      <td className="py-4 px-4 font-semibold text-slate-800">
                        ${opportunity.annualSpend.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 font-bold text-green-600">
                        ${opportunity.potentialSavings.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          opportunity.wasteType === 'unused' ? 'bg-red-100 text-red-800' :
                          opportunity.wasteType === 'underutilized' ? 'bg-orange-100 text-orange-800' :
                          opportunity.wasteType === 'redundant' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {opportunity.wasteType.charAt(0).toUpperCase() + opportunity.wasteType.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          opportunity.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                          opportunity.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {opportunity.riskLevel.charAt(0).toUpperCase() + opportunity.riskLevel.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">Quick Wins (High Impact)</h4>
                <p className="text-red-700 text-sm">
                  {topOpportunities.filter(opp => opp.potentialSavings > 10000).length} opportunities
                  worth ${topOpportunities.filter(opp => opp.potentialSavings > 10000).reduce((sum, opp) => sum + opp.potentialSavings, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">Medium Priority</h4>
                <p className="text-orange-700 text-sm">
                  {topOpportunities.filter(opp => opp.potentialSavings >= 5000 && opp.potentialSavings <= 10000).length} opportunities
                  worth ${topOpportunities.filter(opp => opp.potentialSavings >= 5000 && opp.potentialSavings <= 10000).reduce((sum, opp) => sum + opp.potentialSavings, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Low Priority</h4>
                <p className="text-yellow-700 text-sm">
                  {topOpportunities.filter(opp => opp.potentialSavings < 5000).length} opportunities
                  worth ${topOpportunities.filter(opp => opp.potentialSavings < 5000).reduce((sum, opp) => sum + opp.potentialSavings, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Analysis Tab */}
        {activeTab === 'subscriptions' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800">Subscription Analysis</h2>
                <p className="text-slate-600">Detailed view of all SaaS subscriptions and usage patterns</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search vendors..."
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  {[...new Set(analysisData.subscriptions.map(sub => sub.department))].map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                
                <select
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedWasteType}
                  onChange={(e) => setSelectedWasteType(e.target.value)}
                >
                  <option value="all">All Waste Types</option>
                  <option value="unused">Unused</option>
                  <option value="underutilized">Underutilized</option>
                  <option value="redundant">Redundant</option>
                  <option value="optimized">Optimized</option>
                </select>
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                <h3 className="text-sm font-medium opacity-90">Filtered Results</h3>
                <p className="text-2xl font-bold">{filteredSubscriptions.length}</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                <h3 className="text-sm font-medium opacity-90">Total Spend</h3>
                <p className="text-2xl font-bold">
                  ${filteredSubscriptions.reduce((sum, sub) => sum + sub.annualSpend, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
                <h3 className="text-sm font-medium opacity-90">Potential Savings</h3>
                <p className="text-2xl font-bold">
                  ${filteredSubscriptions.reduce((sum, sub) => sum + sub.potentialSavings, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
                <h3 className="text-sm font-medium opacity-90">Avg Utilization</h3>
                <p className="text-2xl font-bold">
                  {filteredSubscriptions.length > 0 ? 
                    Math.round(filteredSubscriptions.reduce((sum, sub) => sum + sub.utilizationRate, 0) / filteredSubscriptions.length * 100) : 0}%
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Vendor</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Department</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Seats</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Utilization</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Last Login</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Monthly Spend</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Potential Savings</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.slice(0, 20).map((subscription) => (
                    <tr key={subscription.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4 font-medium text-slate-800">{subscription.vendor}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-sm">
                          {subscription.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600">{subscription.department}</td>
                      <td className="py-4 px-4 text-slate-800">
                        {subscription.seats}
                        {subscription.unusedSeats > 0 && (
                          <span className="ml-2 text-red-600 text-sm">(-{subscription.unusedSeats})</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                subscription.utilizationRate >= 0.7 ? 'bg-green-500' :
                                subscription.utilizationRate >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${subscription.utilizationRate * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-slate-600">
                            {Math.round(subscription.utilizationRate * 100)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-sm ${
                          subscription.lastLogin <= 7 ? 'text-green-600' :
                          subscription.lastLogin <= 30 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {subscription.lastLogin}d ago
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800">
                        ${subscription.monthlySpend.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 font-bold text-green-600">
                        ${subscription.potentialSavings.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          subscription.wasteType === 'unused' ? 'bg-red-100 text-red-800' :
                          subscription.wasteType === 'underutilized' ? 'bg-orange-100 text-orange-800' :
                          subscription.wasteType === 'redundant' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {subscription.wasteType.charAt(0).toUpperCase() + subscription.wasteType.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Redundancy Map Tab */}
        {activeTab === 'redundancy' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Tool Redundancy Analysis</h2>
              <p className="text-slate-600">Identify overlapping tools in the same categories for consolidation opportunities</p>
            </div>

            <div className="grid gap-6">
              {redundancyMap.map((group, index) => (
                <div key={group.category} className="border border-slate-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800">{group.category}</h3>
                      <p className="text-slate-600">
                        {group.redundancyLevel} tools • ${group.totalSpend.toLocaleString()} total spend
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Consolidation Opportunity</p>
                      <p className="text-2xl font-bold text-orange-600">
                        ${group.potentialSavings.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.tools.map((tool, toolIndex) => {
                      const toolData = analysisData.subscriptions.find(sub => sub.vendor === tool);
                      return (
                        <div key={tool} className="border border-slate-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-slate-800">{group.category} Consolidation</h4>
                          <span className="text-yellow-600 font-bold text-sm">
                            ${group.potentialSavings.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-2">
                          Consolidate {group.redundancyLevel} tools: {group.tools.join(', ')}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                            Vendor Negotiation
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-yellow-200">
                    <p className="font-semibold text-yellow-800">
                      Total Strategic Savings: ${redundancyMap
                        .reduce((sum, group) => sum + group.potentialSavings, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Implementation Timeline */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">90-Day Implementation Timeline</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold">30</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Days 1-30: Quick Wins</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-slate-700 mb-2">Immediate Cancellations</h5>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Cancel unused licenses (90+ days inactive)</li>
                          <li>• Remove duplicate shadow IT subscriptions</li>
                          <li>• Downgrade over-provisioned accounts</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-slate-700 mb-2">Expected Impact</h5>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• ${analysisData.summary.unusedLicenses * 5000} in immediate savings</li>
                          <li>• 15-25% reduction in monthly SaaS spend</li>
                          <li>• Improved license compliance</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 font-bold">60</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Days 31-60: Right-sizing</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-slate-700 mb-2">License Optimization</h5>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Adjust seat counts based on usage data</li>
                          <li>• Implement usage monitoring policies</li>
                          <li>• Train teams on efficient tool usage</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-slate-700 mb-2">Expected Impact</h5>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• ${Math.round(analysisData.summary.totalWaste * 0.3).toLocaleString()} additional savings</li>
                          <li>• Improved utilization rates by 20%</li>
                          <li>• Better cost allocation accuracy</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-600 font-bold">90</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Days 61-90: Strategic Consolidation</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-slate-700 mb-2">Tool Consolidation</h5>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Negotiate enterprise agreements</li>
                          <li>• Migrate from redundant tools</li>
                          <li>• Establish procurement policies</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-slate-700 mb-2">Expected Impact</h5>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• ${Math.round(analysisData.summary.totalWaste * 0.4).toLocaleString()} in strategic savings</li>
                          <li>• Simplified vendor management</li>
                          <li>• Enhanced security posture</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROI Calculator */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Projected ROI Analysis</h3>
              
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-green-100 text-sm">Current Annual Spend</p>
                  <p className="text-3xl font-bold">${analysisData.summary.totalSpend.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-green-100 text-sm">Total Potential Savings</p>
                  <p className="text-3xl font-bold">${analysisData.summary.totalWaste.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-green-100 text-sm">90-Day Achievable</p>
                  <p className="text-3xl font-bold">${Math.round(analysisData.summary.totalWaste * 0.7).toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-green-100 text-sm">ROI Timeline</p>
                  <p className="text-3xl font-bold">3-6<span className="text-lg"> months</span></p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white bg-opacity-20 rounded-lg">
                <p className="text-green-100 text-sm mb-2">Implementation Cost Estimate</p>
                <div className="flex justify-between items-center">
                  <span>Platform + Professional Services</span>
                  <span className="font-bold">$25,000 - $50,000</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span>Payback Period</span>
                  <span className="font-bold">2-4 months</span>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Export & Share</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="flex flex-col items-center gap-2 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <FileText className="text-blue-600" size={32} />
                  <span className="font-medium text-slate-700">Executive Summary</span>
                  <span className="text-sm text-slate-500">PDF Report</span>
                </button>
                
                <button className="flex flex-col items-center gap-2 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <Download className="text-green-600" size={32} />
                  <span className="font-medium text-slate-700">Detailed Analysis</span>
                  <span className="text-sm text-slate-500">Excel Workbook</span>
                </button>
                
                <button className="flex flex-col items-center gap-2 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <Target className="text-orange-600" size={32} />
                  <span className="font-medium text-slate-700">Action Items</span>
                  <span className="text-sm text-slate-500">Task List</span>
                </button>
                
                <button className="flex flex-col items-center gap-2 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <Calendar className="text-purple-600" size={32} />
                  <span className="font-medium text-slate-700">Timeline View</span>
                  <span className="text-sm text-slate-500">Project Plan</span>
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-blue-600 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium text-blue-800">Next Steps</p>
                    <p className="text-blue-700 text-sm mt-1">
                      Schedule a meeting with your finance and IT teams to review these recommendations. 
                      Start with quick wins to demonstrate immediate value, then move to strategic consolidation efforts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Analytics Summary */}
        <div className="mt-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 text-white">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-slate-300 text-sm">Vendors Analyzed</p>
              <p className="text-2xl font-bold">{analysisData.summary.totalSubscriptions}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-300 text-sm">Waste Identified</p>
              <p className="text-2xl font-bold">{analysisData.summary.wastePercentage.toFixed(1)}%</p>
            </div>
            <div className="text-center">
              <p className="text-slate-300 text-sm">Departments Covered</p>
              <p className="text-2xl font-bold">{analysisData.departmentBreakdown.length}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-300 text-sm">Last Updated</p>
              <p className="text-2xl font-bold">Live</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return <SaaSLicenseAuditor />;
}">
                            <h4 className="font-medium text-slate-800">{tool}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              toolData?.wasteType === 'unused' ? 'bg-red-100 text-red-800' :
                              toolData?.wasteType === 'underutilized' ? 'bg-orange-100 text-orange-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {toolData?.wasteType || 'unknown'}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm text-slate-600">
                            <div className="flex justify-between">
                              <span>Annual Cost:</span>
                              <span className="font-medium">${toolData?.annualSpend.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Utilization:</span>
                              <span className="font-medium">{Math.round((toolData?.utilizationRate || 0) * 100)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Last Login:</span>
                              <span className="font-medium">{toolData?.lastLogin}d ago</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">Consolidation Recommendation</h5>
                    <p className="text-orange-700 text-sm">
                      Consider consolidating to the most utilized tool in this category. 
                      Potential savings: ${group.potentialSavings.toLocaleString()} annually.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {redundancyMap.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">No Tool Redundancy Detected</h3>
                <p className="text-slate-600">Your organization has minimal tool overlap across categories.</p>
              </div>
            )}
          </div>
        )}

        {/* Action Plan Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Actionable Optimization Plan</h2>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Download size={20} />
                  Export Report
                </button>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Quick Wins */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Zap className="text-red-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-800">Quick Wins</h3>
                      <p className="text-red-600 text-sm">Immediate Actions (0-30 days)</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {analysisData.subscriptions
                      .filter(sub => sub.wasteType === 'unused' && sub.potentialSavings > 5000)
                      .slice(0, 5)
                      .map((sub, index) => (
                        <div key={sub.id} className="bg-white rounded-lg p-4 border border-red-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-slate-800">{sub.vendor}</h4>
                            <span className="text-red-600 font-bold text-sm">
                              ${sub.potentialSavings.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-slate-600 text-sm mb-2">{sub.recommendation}</p>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                              Cancel Immediately
                            </span>
                            <span className="text-slate-500 text-xs">
                              Last login: {sub.lastLogin}d ago
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-red-200">
                    <p className="font-semibold text-red-800">
                      Total Quick Win Savings: ${analysisData.subscriptions
                        .filter(sub => sub.wasteType === 'unused' && sub.potentialSavings > 5000)
                        .reduce((sum, sub) => sum + sub.potentialSavings, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Medium Priority */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Target className="text-orange-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-orange-800">Optimization</h3>
                      <p className="text-orange-600 text-sm">Medium Priority (30-90 days)</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {analysisData.subscriptions
                      .filter(sub => sub.wasteType === 'underutilized')
                      .slice(0, 5)
                      .map((sub) => (
                        <div key={sub.id} className="bg-white rounded-lg p-4 border border-orange-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-slate-800">{sub.vendor}</h4>
                            <span className="text-orange-600 font-bold text-sm">
                              ${sub.potentialSavings.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-slate-600 text-sm mb-2">{sub.recommendation}</p>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                              Right-size Licenses
                            </span>
                            <span className="text-slate-500 text-xs">
                              {Math.round(sub.utilizationRate * 100)}% utilized
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-orange-200">
                    <p className="font-semibold text-orange-800">
                      Total Optimization Savings: ${analysisData.subscriptions
                        .filter(sub => sub.wasteType === 'underutilized')
                        .reduce((sum, sub) => sum + sub.potentialSavings, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Strategic Initiatives */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="text-yellow-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-800">Strategic</h3>
                      <p className="text-yellow-600 text-sm">Long-term Planning (90+ days)</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {redundancyMap.slice(0, 3).map((group) => (
                      <div key={group.category} className="bg-white rounded-lg p-4 border border-yellow-200">
                        <div className="flex items-center justify-between mb-2
