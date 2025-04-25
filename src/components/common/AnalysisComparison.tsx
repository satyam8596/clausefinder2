'use client';

import { useState } from 'react';
import { Calendar, ChevronDown, ArrowUpDown, AlertTriangle, CheckCircle } from 'lucide-react';

// Mock data for previous analyses
const MOCK_PREVIOUS_ANALYSES = [
  { 
    id: 'prev-1', 
    date: '2023-05-15T10:30:00Z', 
    highRisks: 7, 
    mediumRisks: 12, 
    lowRisks: 5 
  },
  { 
    id: 'prev-2', 
    date: '2023-04-20T14:45:00Z', 
    highRisks: 9, 
    mediumRisks: 10, 
    lowRisks: 6 
  }
];

interface AnalysisComparisonProps {
  currentAnalysis: {
    id: string;
    timestamp: string;
    highRisks: number;
    mediumRisks: number;
    lowRisks: number;
  };
}

const AnalysisComparison = ({ currentAnalysis }: AnalysisComparisonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  
  // Get the selected analysis data or use the first one as default
  const comparisonAnalysis = selectedAnalysis 
    ? MOCK_PREVIOUS_ANALYSES.find(a => a.id === selectedAnalysis) 
    : MOCK_PREVIOUS_ANALYSES[0];
  
  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };
  
  // Calculate the change in risk levels
  const calculateChange = (current: number, previous: number) => {
    const diff = current - previous;
    if (diff === 0) return { value: 0, icon: null };
    
    return {
      value: Math.abs(diff),
      direction: diff > 0 ? 'increase' : 'decrease',
      icon: diff > 0 
        ? <ArrowUpDown className="w-3 h-3 text-red-500 transform rotate-180" /> 
        : <ArrowUpDown className="w-3 h-3 text-green-500" />
    };
  };
  
  const highRiskChange = calculateChange(currentAnalysis.highRisks, comparisonAnalysis.highRisks);
  const mediumRiskChange = calculateChange(currentAnalysis.mediumRisks, comparisonAnalysis.mediumRisks);
  const lowRiskChange = calculateChange(currentAnalysis.lowRisks, comparisonAnalysis.lowRisks);
  
  // Calculate overall risk trend
  const getTrendIcon = () => {
    const totalCurrentRisks = currentAnalysis.highRisks + currentAnalysis.mediumRisks;
    const totalPreviousRisks = comparisonAnalysis.highRisks + comparisonAnalysis.mediumRisks;
    
    if (totalCurrentRisks < totalPreviousRisks) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (totalCurrentRisks > totalPreviousRisks) {
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
    return null;
  };
  
  return (
    <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-md overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
      >
        <div className="flex items-center">
          <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
          <h3 className="font-medium text-primary-700 dark:text-primary-300">
            Compare with Previous Versions
          </h3>
        </div>
        <ChevronDown className={`w-5 h-5 text-primary-600 dark:text-primary-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="overflow-hidden">
          <div className="p-4 border-t border-primary-100 dark:border-primary-900/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-2 sm:mb-0">
                Select a previous version to compare with current analysis
              </p>
              
              <select
                className="px-3 py-2 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-md text-secondary-900 dark:text-white shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                value={selectedAnalysis || MOCK_PREVIOUS_ANALYSES[0].id}
                onChange={(e) => setSelectedAnalysis(e.target.value)}
              >
                {MOCK_PREVIOUS_ANALYSES.map(analysis => (
                  <option key={analysis.id} value={analysis.id}>
                    {formatDate(analysis.date)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-secondary-50 dark:bg-secondary-800/70 rounded-lg p-4">
                <h4 className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-3 flex items-center">
                  Current Analysis
                  <span className="ml-2 text-xs font-normal text-secondary-500">
                    {formatDate(currentAnalysis.timestamp)}
                  </span>
                </h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-600 dark:text-red-400">High Risk</span>
                    <span className="font-semibold text-red-700 dark:text-red-400">{currentAnalysis.highRisks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-amber-600 dark:text-amber-400">Medium Risk</span>
                    <span className="font-semibold text-amber-700 dark:text-amber-400">{currentAnalysis.mediumRisks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-yellow-600 dark:text-yellow-400">Low Risk</span>
                    <span className="font-semibold text-yellow-700 dark:text-yellow-400">{currentAnalysis.lowRisks}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-secondary-50 dark:bg-secondary-800/70 rounded-lg p-4">
                <h4 className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-3 flex items-center">
                  Previous Analysis
                  <span className="ml-2 text-xs font-normal text-secondary-500">
                    {formatDate(comparisonAnalysis.date)}
                  </span>
                </h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-600 dark:text-red-400">High Risk</span>
                    <span className="font-semibold text-red-700 dark:text-red-400">{comparisonAnalysis.highRisks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-amber-600 dark:text-amber-400">Medium Risk</span>
                    <span className="font-semibold text-amber-700 dark:text-amber-400">{comparisonAnalysis.mediumRisks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-yellow-600 dark:text-yellow-400">Low Risk</span>
                    <span className="font-semibold text-yellow-700 dark:text-yellow-400">{comparisonAnalysis.lowRisks}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-primary-50 dark:bg-primary-900/10 rounded-lg p-4">
              <h4 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3 flex items-center">
                Risk Changes
                {getTrendIcon() && (
                  <span className="ml-2">{getTrendIcon()}</span>
                )}
              </h4>
              
              <div className="space-y-2">
                {highRiskChange.value > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary-600 dark:text-secondary-400">High Risk Change</span>
                    <span className={`flex items-center font-medium ${
                      highRiskChange.direction === 'increase' 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {highRiskChange.icon}
                      <span className="ml-1">{highRiskChange.value}</span>
                    </span>
                  </div>
                )}
                
                {mediumRiskChange.value > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary-600 dark:text-secondary-400">Medium Risk Change</span>
                    <span className={`flex items-center font-medium ${
                      mediumRiskChange.direction === 'increase' 
                        ? 'text-amber-600 dark:text-amber-400' 
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {mediumRiskChange.icon}
                      <span className="ml-1">{mediumRiskChange.value}</span>
                    </span>
                  </div>
                )}
                
                {lowRiskChange.value > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary-600 dark:text-secondary-400">Low Risk Change</span>
                    <span className={`flex items-center font-medium ${
                      lowRiskChange.direction === 'increase' 
                        ? 'text-yellow-600 dark:text-yellow-400' 
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {lowRiskChange.icon}
                      <span className="ml-1">{lowRiskChange.value}</span>
                    </span>
                  </div>
                )}
                
                {highRiskChange.value === 0 && mediumRiskChange.value === 0 && lowRiskChange.value === 0 && (
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    No changes in risk levels between versions.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisComparison; 