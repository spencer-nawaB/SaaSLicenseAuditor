'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Upload, AlertCircle, TrendingDown, DollarSign, Users, Calendar, FileText, Download, Search, Eye, Zap, Target, AlertTriangle, CheckCircle } from 'lucide-react';

const SaaSLicenseAuditor = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedWasteType, setSelectedWasteType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Generate demo data
  const generateDemoData = () => {
    const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
    const subscriptions = [
      { id: 1, vendor: 'Slack', category: 'productivity', department: 'Engineering', seats: 150, utilizationRate: 0.75, monthlySpend: 1200, annualSpend: 14400, lastLogin: 5, unusedSeats: 38, potentialSavings: 4560, wasteType: 'underutilized', riskLevel: 'medium' },
      { id: 2, vendor: 'Salesforce', category: 'crm', department: 'Sales', seats: 50, utilizationRate: 0.65, monthlySpend: 7500, annualSpend: 90000, lastLogin: 1, unusedSeats: 18, potentialSavings: 32400, wasteType: 'underutilized', riskLevel: 'medium' },
      { id: 3, vendor: 'Zoom', category: 'productivity', department: 'Marketing', seats: 100, utilizationRate: 0.85, monthlySpend: 1499, annualSpend: 17988, lastLogin: 2, unusedSeats: 15, potentialSavings: 2698, wasteType: 'optimized', riskLevel: 'low' },
    ];

    return {
      subscriptions,
      summary: {
        totalSpend: subscriptions.reduce((sum, sub) => sum + sub.annualSpend, 0),
        totalWaste: subscriptions.reduce((sum, sub) => sum + sub.potentialSavings, 0),
        wastePercentage: 35.2,
        totalSubscriptions: subscriptions.length,
        unusedLicenses: 2,
        underutilizedLicenses: 1,
        redundantTools: 0
      },
      departmentBreakdown: departments.map(dept => {
        const deptSubs = subscriptions.filter(sub => sub.department === dept);
        return {
          department: dept,
          totalSpend: deptSubs.reduce((sum, sub) => sum + sub.annualSpend, 0),
          potentialSavings: deptSubs.reduce((sum, sub) => sum + sub.potentialSavings, 0),
          subscriptionCount: deptSubs.length
        };
      }).filter(dept => dept.subscriptionCount > 0)
    };
  };

  useEffect(() => {
    setAnalysisData(generateDemoData());
  }, []);

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

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  {analysisData.summary.wastePercentage}% waste
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

        {/* Demo Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 mt-0.5" size={20} />
            <div>
              <p className="font-medium text-blue-800">Demo Mode Active</p>
              <p className="text-blue-700 text-sm">
                This demo shows a simplified version of the SaaS License Auditor. 
                The full version includes comprehensive file upload, API integrations, and detailed optimization recommendations.
              </p>
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
