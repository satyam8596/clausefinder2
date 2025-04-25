'use client';

import { BarChart2, Clock, FileText, AlertTriangle, Calendar } from 'lucide-react';
import { Clause } from '@/utils/gemini';

interface ContractMetricsProps {
  filename: string;
  timestamp: string;
  totalClauses: number;
  highRisks: number;
  mediumRisks: number;
  lowRisks: number;
  safeCount: number;
}

const ContractMetrics = ({
  filename,
  timestamp,
  totalClauses,
  highRisks,
  mediumRisks,
  lowRisks,
  safeCount
}: ContractMetricsProps) => {
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Document Info */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-4 flex items-center">
        <div className="p-3 rounded-full bg-primary-50 dark:bg-primary-900/30 mr-3">
          <FileText className="w-6 h-6 text-primary-500 dark:text-primary-400" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Document</h3>
          <p className="text-base font-semibold text-secondary-900 dark:text-white truncate max-w-[180px]" title={filename}>
            {filename}
          </p>
        </div>
      </div>
      
      {/* Analysis Date */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-4 flex items-center">
        <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 mr-3">
          <Calendar className="w-6 h-6 text-blue-500 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Analyzed</h3>
          <p className="text-base font-semibold text-secondary-900 dark:text-white">
            {formatDate(timestamp)}
          </p>
        </div>
      </div>
      
      {/* Clauses Count */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-4 flex items-center">
        <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/30 mr-3">
          <BarChart2 className="w-6 h-6 text-purple-500 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Total Clauses</h3>
          <p className="text-base font-semibold text-secondary-900 dark:text-white">
            {totalClauses} clauses
          </p>
        </div>
      </div>
      
      {/* Risk Breakdown */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-4 flex items-center">
        <div className="p-3 rounded-full bg-red-50 dark:bg-red-900/30 mr-3">
          <AlertTriangle className="w-6 h-6 text-red-500 dark:text-red-400" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Risk Breakdown</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
              <span className="text-xs text-secondary-700 dark:text-secondary-300">{highRisks}</span>
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span>
              <span className="text-xs text-secondary-700 dark:text-secondary-300">{mediumRisks}</span>
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></span>
              <span className="text-xs text-secondary-700 dark:text-secondary-300">{lowRisks}</span>
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
              <span className="text-xs text-secondary-700 dark:text-secondary-300">{safeCount}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractMetrics; 