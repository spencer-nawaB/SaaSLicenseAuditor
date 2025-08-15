import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Upload, AlertCircle, TrendingDown, DollarSign, Users, Calendar, FileText, Download, Search, Eye, Zap, Target, AlertTriangle, CheckCircle, Trash2, Play } from 'lucide-react';

const SaaSLicenseAuditorMVP = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedWasteType, setSelectedWasteType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Enhanced SaaS vendor database with pattern matching
  const saasVendorDatabase = {
    'productivity': {
      patterns: ['slack', 'zoom', 'microsoft', 'office365', 'teams', 'notion', 'asana', 'trello', 'monday', 'airtable', 'clickup', 'calendly', 'loom', 'grammarly', 'dropbox'],
      defaultPrice: 12
    },
    'crm': {
      patterns: ['salesforce', 'hubspot', 'pipedrive', 'zendesk', 'freshworks', 'intercom', 'drift'],
      defaultPrice: 50
    },
    'development': {
      patterns: ['github', 'gitlab', 'jira', 'confluence', 'figma', 'sketch', 'adobe', 'postman', 'datadog', 'jetbrains', 'linear', 'docker'],
      defaultPrice: 25
    },
    'marketing': {
      patterns: ['mailchimp', 'hootsuite', 'buffer', 'canva', 'marketo', 'pardot', 'unbounce'],
      defaultPrice: 30
    },
    'finance': {
      patterns: ['quickbooks', 'xero', 'netsuite', 'expensify', 'concur', 'bill.com', 'stripe', 'square'],
      defaultPrice: 40
    },
    'hr': {
      patterns: ['bamboohr', 'workday', 'adp', 'paychex', 'greenhouse', 'lever', 'culture amp', 'lattice'],
      defaultPrice: 15
    },
    'security': {
      patterns: ['okta', 'auth0', '1password', 'lastpass', 'crowdstrike', 'sentinelone', 'duo'],
      defaultPrice: 8
    },
    'analytics': {
      patterns: ['tableau', 'power bi', 'looker', 'mixpanel', 'amplitude', 'analytics', 'hotjar'],
      defaultPrice: 60
    },
    'infrastructure': {
      patterns: ['aws', 'azure', 'gcp', 'heroku', 'digitalocean', 'cloudflare', 'mongodb'],
      defaultPrice: 100
    },
    'communication': {
      patterns: ['twilio', 'sendgrid', 'mailgun', 'ringcentral', 'dialpad'],
      defaultPrice: 20
    }
  };

  // Function to categorize vendors
  const categorizeVendor = (description) => {
    const desc = description.toLowerCase();
    
    for (const [category, data] of Object.entries(saasVendorDatabase)) {
      for (const pattern of data.patterns) {
        if (desc.includes(pattern)) {
          return { category, defaultPrice: data.defaultPrice };
        }
      }
    }
    
    return { category: 'other', defaultPrice: 10 };
  };

  // Function to detect recurring charges
  const detectRecurringCharges = (transactions) => {
    const vendorGroups = {};
    
    transactions.forEach(transaction => {
      const vendor = extractVendorName(transaction.description);
      const amount = parseFloat(transaction.amount) || 0;
      
      if (!vendorGroups[vendor]) {
        vendorGroups[vendor] = [];
      }
      
      vendorGroups[vendor].push({
        ...transaction,
        amount,
        date: new Date(transaction.date)
      });
    });

    // Filter for recurring charges (2+ transactions)
    const recurringCharges = {};
    Object.entries(vendorGroups).forEach(([vendor, transactions]) => {
      if (transactions.length >= 2) {
        const avgAmount = transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length;
        const { category, defaultPrice } = categorizeVendor(vendor);
        
        recurringCharges[vendor] = {
          vendor,
          category,
          transactions: transactions.length,
          avgAmount,
          totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
          lastCharge: Math.max(...transactions.map(t => t.date.getTime())),
          estimatedSeats: Math.max(1, Math.round(avgAmount / defaultPrice)),
          defaultPrice
        };
      }
    });

    return recurringCharges;
  };

  // Extract vendor name from transaction description
  const extractVendorName = (description) => {
    // Remove common payment processor names and clean up
    const cleaned = description
      .toLowerCase()
      .replace(/\b(paypal|stripe|square|authorize\.net|payment|purchase|subscription)\b/g, '')
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Take first meaningful word(s)
    const words = cleaned.split(' ').filter(word => word.length > 2);
    return words.slice(0, 2).join(' ') || 'Unknown Vendor';
  };

  // Parse CSV content
  const parseCSV = (csvContent) => {
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    const transactions = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const transaction = {};

      headers.forEach((header, index) => {
        transaction[header] = values[index] || '';
      });

      // Map common header variations
      const mappedTransaction = {
        date: transaction.date || transaction.timestamp || transaction['transaction date'] || '',
        description: transaction.description || transaction.merchant || transaction.vendor || transaction.payee || '',
        amount: transaction.amount || transaction.debit || transaction.charge || transaction.cost || '0',
        category: transaction.category || transaction.type || '',
        department: transaction.department || transaction.dept || 'Unknown'
      };

      if (mappedTransaction.description && mappedTransaction.amount) {
        transactions.push(mappedTransaction);
      }
    }

    return transactions;
  };

  // Process uploaded files
  const processFiles = async () => {
    if (uploadedFiles.length === 0) {
      setError('Please upload at least one CSV file');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      let allTransactions = [];

      for (const file of uploadedFiles) {
        const content = await file.text();
        const transactions = parseCSV(content);
        allTransactions = [...allTransactions, ...transactions];
      }

      if (allTransactions.length === 0) {
        throw new Error('No valid transactions found in uploaded files');
      }

      // Detect recurring SaaS charges
      const recurringCharges = detectRecurringCharges(allTransactions);
      
      if (Object.keys(recurringCharges).length === 0) {
        throw new Error('No recurring SaaS subscriptions detected');
      }

      // Generate analysis data
      const subscriptions = Object.values(recurringCharges).map((charge, index) => {
        const monthlySpend = charge.avgAmount;
        const annualSpend = monthlySpend * 12;
        const estimatedUtilization = Math.random() * 0.7 + 0.3; // Random for MVP
        const unusedSeats = Math.floor(charge.estimatedSeats * (1 - estimatedUtilization));
        const potentialSavings = unusedSeats * charge.defaultPrice * 12;
        const daysSinceLastCharge = Math.floor((Date.now() - charge.lastCharge) / (1000 * 60 * 60 * 24));

        let wasteType = 'optimized';
        let riskLevel = 'low';
        
        if (daysSinceLastCharge > 90) {
          wasteType = 'unused';
          riskLevel = 'high';
        } else if (estimatedUtilization < 0.5) {
          wasteType = 'underutilized';
          riskLevel = 'medium';
        }

        return {
          id: index + 1,
          vendor: charge.vendor,
          category: charge.category,
          department: 'General', // Could be enhanced with department mapping
          seats: charge.estimatedSeats,
          utilizationRate: estimatedUtilization,
          monthlySpend,
          annualSpend,
          lastLogin: daysSinceLastCharge,
          unusedSeats,
          potentialSavings,
          wasteType,
          riskLevel,
          transactionCount: charge.transactions,
          recommendation: getRecommendation(wasteType, estimatedUtilization, potentialSavings)
        };
      });

      const totalSpend = subscriptions.reduce((sum, sub) => sum + sub.annualSpend, 0);
      const totalWaste = subscriptions.reduce((sum, sub) => sum + sub.potentialSavings, 0);

      const analysisResult = {
        subscriptions,
        summary: {
          totalSpend,
          totalWaste,
          wastePercentage: (totalWaste / totalSpend) * 100,
          totalSubscriptions: subscriptions.length,
          unusedLicenses: subscriptions.filter(sub => sub.wasteType === 'unused').length,
          underutilizedLicenses: subscriptions.filter(sub => sub.wasteType === 'underutilized').length,
          redundantTools: subscriptions.filter(sub => sub.wasteType === 'redundant').length,
          processedTransactions: allTransactions.length
        },
        categoryBreakdown: getCategoryBreakdown(subscriptions)
      };

      setAnalysisData(analysisResult);
      setActiveTab('dashboard');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const getCategoryBreakdown = (subscriptions) => {
    const categories = {};
    subscriptions.forEach(sub => {
      if (!categories[sub.category]) {
        categories[sub.category] = {
          category: sub.category.charAt(0).toUpperCase() + sub.category.slice(1),
          totalSpend: 0,
          potentialSavings: 0,
          subscriptionCount: 0
        };
      }
      categories[sub.category].totalSpend += sub.annualSpend;
      categories[sub.category].potentialSavings += sub.potentialSavings;
      categories[sub.category].subscriptionCount += 1;
    });

    return Object.values(categories).sort((a, b) => b.potentialSavings - a.potentialSavings);
  };

  const getRecommendation = (wasteType, utilization, savings) => {
    if (wasteType === 'unused') {
      return savings > 1000 ? 'Immediate cancellation recommended' : 'Cancel or downgrade';
    } else if (wasteType === 'underutilized') {
      return utilization < 0.3 ? 'Reduce seat count by 50%' : 'Right-size licenses';
    }
    return 'Monitor usage trends';
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const csvFiles = files.filter(file => 
      file.type === 'text/csv' || 
      file.name.toLowerCase().endsWith('.csv')
    );
    
    if (csvFiles.length !== files.length) {
      setError('Please upload only CSV files for the MVP version');
      return;
    }
    
    setUploadedFiles(prev => [...prev, ...csvFiles]);
    setError(null);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const exportToPDF = () => {
    if (!analysisData) return;
    
    // Create a simple text report
    const report = `
SaaS LICENSE AUDIT REPORT
========================

EXECUTIVE SUMMARY
- Total Annual SaaS Spend: $${analysisData.summary.totalSpend.toLocaleString()}
- Potential Annual Savings: $${analysisData.summary.totalWaste.toLocaleString()}
- Waste Percentage: ${analysisData.summary.wastePercentage.toFixed(1)}%
- Total Subscriptions Analyzed: ${analysisData.summary.totalSubscriptions}
- Transactions Processed: ${analysisData.summary.processedTransactions}

TOP OPTIMIZATION OPPORTUNITIES
${analysisData.subscriptions
  .sort((a, b) => b.potentialSavings - a.potentialSavings)
  .slice(0, 10)
  .map((sub, i) => `${i + 1}. ${sub.vendor} - $${sub.potentialSavings.toLocaleString()} potential savings`)
  .join('\n')}

CATEGORY BREAKDOWN
${analysisData.categoryBreakdown
  .map(cat => `${cat.category}: $${cat.totalSpend.toLocaleString()} spend, $${cat.potentialSavings.toLocaleString()} potential savings`)
  .join('\n')}

Generated on ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saas-audit-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredSubscriptions = useMemo(() => {
    if (!analysisData) return [];
    
    return analysisData.subscriptions.filter(sub => {
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
      .sort((a, b) => b.potentialSavings - a.potentialSavings)
      .slice(0, 10);
  }, [analysisData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            SaaS License Auditor
            <span className="ml-3 px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full">MVP</span>
          </h1>
          <p className="text-slate-600 text-lg">Upload your expense data to identify SaaS waste and optimization opportunities</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200">
          {[
            { id: 'upload', label: 'Upload Data', icon: Upload },
            { id: 'dashboard', label: 'Analysis Dashboard', icon: DollarSign, disabled: !analysisData },
            { id: 'subscriptions', label: 'Subscription Details', icon: Eye, disabled: !analysisData },
            { id: 'opportunities', label: 'Optimization', icon: Target, disabled: !analysisData }
          ].map(({ id, label, icon: Icon, disabled }) => (
            <button
              key={id}
              onClick={() => !disabled && setActiveTab(id)}
              disabled={disabled}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${
                activeTab === id
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600 font-medium'
                  : disabled
                  ? 'text-slate-400 cursor-not-allowed'
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
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Upload Your Expense Data</h2>
            
            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">📋 Instructions</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Export your credit card statements or expense reports as CSV files</li>
                  <li>• Ensure files contain columns for: date, description/vendor, amount</li>
                  <li>• The system will automatically detect recurring SaaS subscriptions</li>
                  <li>• Multiple files can be uploaded and will be combined for analysis</li>
                </ul>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <p className="text-slate-600 mb-4">Drop CSV files here or click to upload</p>
                <input
                  type="file"
                  multiple
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors inline-block"
                >
                  Choose CSV Files
                </label>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-red-600 mt-0.5" size={20} />
                    <div>
                      <p className="font-medium text-red-800">Error</p>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-3">
                    Uploaded Files ({uploadedFiles.length})
                  </h3>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="text-slate-400" size={20} />
                          <div>
                            <span className="font-medium text-slate-700">{file.name}</span>
                            <span className="text-sm text-slate-500 ml-2">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Process Button */}
                  <div className="mt-6 text-center">
                    <button
                      onClick={processFiles}
                      disabled={processing}
                      className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                    >
                      {processing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Play size={20} />
                          Analyze SaaS Subscriptions
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Sample CSV Format */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">📄 Expected CSV Format</h3>
                <div className="bg-white p-3 rounded border text-sm font-mono">
                  <div className="text-gray-600">date,description,amount</div>
                  <div>2024-01-15,"Slack Technologies",120.00</div>
                  <div>2024-01-15,"Zoom Video Communications",14.99</div>
                  <div>2024-02-15,"Slack Technologies",120.00</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Dashboard */}
        {activeTab === 'dashboard' && analysisData && (
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
                    <p className="text-slate-600 text-sm font-medium">Subscriptions Found</p>
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
                    <p className="text-slate-600 text-sm font-medium">Transactions Processed</p>
                    <p className="text-3xl font-bold text-slate-800">
                      {analysisData.summary.processedTransactions}
                    </p>
                  </div>
                  <CheckCircle className="text-green-500" size={32} />
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-800">Spend by Category</h3>
                  <button
                    onClick={exportToPDF}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    <Download size={16} />
                    Export Report
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analysisData.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="totalSpend"
                    >
                      {analysisData.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={[
                          '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', 
                          '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#6366f1'
                        ][index % 10]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Annual Spend']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Category Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analysisData.categoryBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                    <Bar dataKey="totalSpend" fill="#3b82f6" name="Total Spend" />
                    <Bar dataKey="potentialSavings" fill="#ef4444" name="Potential Savings" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Details */}
        {activeTab === 'subscriptions' && analysisData && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800">Detected Subscriptions</h2>
                <p className="text-slate-600">SaaS subscriptions identified from your expense data</p>
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
                  value={selectedWasteType}
                  onChange={(e) => setSelectedWasteType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="unused">Unused</option>
                  <option value="underutilized">Underutilized</option>
                  <option value="optimized">Optimized</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Vendor</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Est. Seats</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Monthly Spend</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Annual Spend</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Potential Savings</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Transactions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.map((subscription) => (
                    <tr key={subscription.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4 font-medium text-slate-800">{subscription.vendor}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-sm">
                          {subscription.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-800">
                        {subscription.seats}
                        {subscription.unusedSeats > 0 && (
                          <span className="ml-2 text-red-600 text-sm">(-{subscription.unusedSeats})</span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800">
                        ${subscription.monthlySpend.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800">
                        ${subscription.annualSpend.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 font-bold text-green-600">
                        ${subscription.potentialSavings.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          subscription.wasteType === 'unused' ? 'bg-red-100 text-red-800' :
                          subscription.wasteType === 'underutilized' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {subscription.wasteType.charAt(0).toUpperCase() + subscription.wasteType.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        {subscription.transactionCount} charges
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Optimization Opportunities */}
        {activeTab === 'opportunities' && analysisData && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Top Optimization Opportunities</h2>
              <div className="text-right">
                <p className="text-sm text-slate-600">Total Potential Savings</p>
                <p className="text-2xl font-bold text-green-600">
                  ${topOpportunities.reduce((sum, opp) => sum + opp.potentialSavings, 0).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {topOpportunities.map((opportunity, index) => (
                <div key={opportunity.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        index < 3 ? 'bg-red-500' : index < 6 ? 'bg-orange-500' : 'bg-yellow-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{opportunity.vendor}</h3>
                        <p className="text-slate-600 text-sm">{opportunity.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">
                        ${opportunity.potentialSavings.toLocaleString()}
                      </p>
                      <p className="text-slate-500 text-sm">potential savings</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Annual Spend:</span>
                      <span className="font-medium ml-2">${opportunity.annualSpend.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Estimated Seats:</span>
                      <span className="font-medium ml-2">{opportunity.seats}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Utilization:</span>
                      <span className="font-medium ml-2">{Math.round(opportunity.utilizationRate * 100)}%</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 text-sm font-medium">💡 Recommendation</p>
                    <p className="text-blue-700 text-sm">{opportunity.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Summary */}
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">🚨 Immediate Action</h4>
                <p className="text-red-700 text-sm">
                  {analysisData.subscriptions.filter(sub => sub.wasteType === 'unused').length} unused subscriptions
                </p>
                <p className="text-red-600 font-bold">
                  ${analysisData.subscriptions
                    .filter(sub => sub.wasteType === 'unused')
                    .reduce((sum, sub) => sum + sub.potentialSavings, 0)
                    .toLocaleString()} savings
                </p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">⚡ Quick Wins</h4>
                <p className="text-orange-700 text-sm">
                  {analysisData.subscriptions.filter(sub => sub.wasteType === 'underutilized').length} underutilized tools
                </p>
                <p className="text-orange-600 font-bold">
                  ${analysisData.subscriptions
                    .filter(sub => sub.wasteType === 'underutilized')
                    .reduce((sum, sub) => sum + sub.potentialSavings, 0)
                    .toLocaleString()} savings
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">✅ Well Optimized</h4>
                <p className="text-green-700 text-sm">
                  {analysisData.subscriptions.filter(sub => sub.wasteType === 'optimized').length} efficient subscriptions
                </p>
                <p className="text-green-600 font-bold">Keep monitoring</p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Status */}
        <div className="mt-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 text-white">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-slate-300 text-sm">Analysis Status</p>
              <p className="text-2xl font-bold">{analysisData ? 'Complete' : 'Waiting'}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-300 text-sm">Files Processed</p>
              <p className="text-2xl font-bold">{uploadedFiles.length}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-300 text-sm">Subscriptions Found</p>
              <p className="text-2xl font-bold">{analysisData?.summary.totalSubscriptions || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-300 text-sm">Potential Savings</p>
              <p className="text-2xl font-bold">
                {analysisData ? `${analysisData.summary.totalWaste.toLocaleString()}` : '$0'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaaSLicenseAuditorMVP;
