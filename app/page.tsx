'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Upload, AlertCircle, TrendingDown, DollarSign, Users, Calendar, FileText, Download, Search, Eye, Zap, Target, AlertTriangle, CheckCircle } from 'lucide-react';

const SaaSLicenseAuditor = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedWasteType, setSelectedWasteType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
      { name: 'AWS', category: 'infrastructure', basePrice: 15000, seats: 1, utilization: 0.80, lastLogin: 1 },
      { name: 'Heroku', category: 'infrastructure', basePrice: 25, seats: 20, utilization: 0.60, lastLogin: 7 },
      { name: 'DataDog', category: 'infrastructure', basePrice: 15, seats: 30, utilization: 0.75, lastLogin: 1 },
      { name: 'New Relic', category: 'infrastructure', basePrice: 100, seats: 10, utilization: 0.85, lastLogin: 2 },
      { name: 'PagerDuty', category: 'infrastructure', basePrice: 21, seats: 15, utilization: 0.90, lastLogin: 1 },
      { name: 'Postman', category: 'development', basePrice: 12, seats: 50, utilization: 0.65, lastLogin: 3 },
      { name: 'Docker', category: 'development', basePrice: 5, seats: 40, utilization: 0.70, lastLogin: 2 },
      { name: 'JetBrains', category: 'development', basePrice: 199, seats: 60, utilization: 0.80, lastLogin: 1 },
      { name: 'Linear', category: 'development', basePrice: 8, seats: 35, utilization: 0.75, lastLogin: 2 },
      { name: 'Airtable', category: 'productivity', basePrice: 20, seats: 30, utilization: 0.50, lastLogin: 14 }
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
            { id: 'dashboard', label: 'Executive Dashboard', icon: DollarSign },
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
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
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
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                  <Line type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={3} name="Total Spend" />
                  <Line type="monotone" dataKey="waste" stroke="#ef4444" strokeWidth={3} name="Waste" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Other tabs content would go here - simplified for demo */}
        {activeTab !== 'upload' && activeTab !== 'dashboard' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              {activeTab === 'opportunities' && 'Optimization Opportunities'}
              {activeTab === 'subscriptions' && 'Subscription Analysis'}
              {activeTab === 'redundancy' && 'Redundancy Map'}
              {activeTab === 'recommendations' && 'Action Plan'}
            </h2>
            <p className="text-slate-600">
              This section shows detailed analysis for {activeTab}. 
              In the full version, this would include interactive tables, charts, and actionable recommendations.
            </p>
            
            {/* Show some sample data for the active tab */}
            <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topOpportunities.slice(0, 6).map((opportunity) => (
                <div key={opportunity.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-800">{opportunity.vendor}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      opportunity.wasteType === 'unused' ? 'bg-red-100 text-red-800' :
                      opportunity.wasteType === 'underutilized' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {opportunity.wasteType}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-slate-600">
                    <div className="flex justify-between">
                      <span>Department:</span>
                      <span className="font-medium">{opportunity.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual Spend:</span>
                      <span className="font-medium">${opportunity.annualSpend.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Potential Savings:</span>
                      <span className="font-bold text-green-600">${opportunity.potentialSavings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Utilization:</span>
                      <span className="font-medium">{Math.round(opportunity.utilizationRate * 100)}%</span>
                    </div>
                  </div>
                </div>
              ))}
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
}
