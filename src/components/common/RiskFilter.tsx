'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Filter, SlidersHorizontal } from 'lucide-react';

type RiskLevel = 'high' | 'medium' | 'low' | 'none' | 'all';

interface RiskFilterProps {
  onChange: (selectedRisks: RiskLevel[]) => void;
  counts: {
    high: number;
    medium: number;
    low: number;
    none: number;
  };
}

const RiskFilter = ({ onChange, counts }: RiskFilterProps) => {
  const [selectedRisks, setSelectedRisks] = useState<RiskLevel[]>(['all']);
  const [expanded, setExpanded] = useState(true);

  const handleRiskToggle = (risk: RiskLevel) => {
    let newSelected: RiskLevel[];

    if (risk === 'all') {
      // If 'all' is selected, deselect everything else
      newSelected = selectedRisks.includes('all') ? [] : ['all'];
    } else {
      // If we're selecting a specific risk level
      const withoutAll = selectedRisks.filter(r => r !== 'all');
      
      if (selectedRisks.includes(risk)) {
        // If already selected, remove it
        newSelected = withoutAll.filter(r => r !== risk);
      } else {
        // If not selected, add it
        newSelected = [...withoutAll, risk];
      }
      
      // Special case: if all individual risks are selected, select 'all' instead
      const allRisks: RiskLevel[] = ['high', 'medium', 'low', 'none'];
      if (allRisks.every(r => newSelected.includes(r) || counts[r] === 0)) {
        newSelected = ['all'];
      }
      
      // If none are selected, default to 'all'
      if (newSelected.length === 0) {
        newSelected = ['all'];
      }
    }

    setSelectedRisks(newSelected);
    onChange(newSelected);
  };

  const getRiskColor = (risk: RiskLevel, isSelected: boolean) => {
    const baseStyles = isSelected 
      ? 'border-2 shadow-sm dark:border-opacity-70 font-medium'
      : 'border opacity-85 hover:opacity-100 hover:shadow-sm';
      
    switch (risk) {
      case 'high':
        return `${baseStyles} ${
          isSelected 
            ? 'bg-red-50 text-red-800 border-red-500 dark:bg-red-900/30 dark:text-red-300 dark:border-red-600' 
            : 'bg-transparent text-red-700 border-red-300 hover:bg-red-50/50 dark:text-red-400 dark:border-red-800/30 dark:hover:bg-red-900/10'
        }`;
      case 'medium':
        return `${baseStyles} ${
          isSelected 
            ? 'bg-amber-50 text-amber-800 border-amber-500 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-600' 
            : 'bg-transparent text-amber-700 border-amber-300 hover:bg-amber-50/50 dark:text-amber-400 dark:border-amber-800/30 dark:hover:bg-amber-900/10'
        }`;
      case 'low':
        return `${baseStyles} ${
          isSelected 
            ? 'bg-yellow-50 text-yellow-800 border-yellow-500 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-600' 
            : 'bg-transparent text-yellow-700 border-yellow-300 hover:bg-yellow-50/50 dark:text-yellow-400 dark:border-yellow-800/30 dark:hover:bg-yellow-900/10'
        }`;
      case 'none':
        return `${baseStyles} ${
          isSelected 
            ? 'bg-green-50 text-green-800 border-green-500 dark:bg-green-900/30 dark:text-green-300 dark:border-green-600' 
            : 'bg-transparent text-green-700 border-green-300 hover:bg-green-50/50 dark:text-green-400 dark:border-green-800/30 dark:hover:bg-green-900/10'
        }`;
      default:
        return `${baseStyles} ${
          isSelected 
            ? 'bg-primary-50 text-primary-800 border-primary-500 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-600' 
            : 'bg-transparent text-primary-700 border-primary-300 hover:bg-primary-50/50 dark:text-primary-400 dark:border-primary-800/30 dark:hover:bg-primary-900/10'
        }`;
    }
  };
  
  const isSelected = (risk: RiskLevel) => {
    return selectedRisks.includes(risk) || 
           (risk !== 'all' && selectedRisks.includes('all'));
  };

  const getRiskIcon = (risk: RiskLevel) => {
    switch (risk) {
      case 'high':
        return <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />;
      case 'medium':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'low':
        return <AlertTriangle className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" />;
      case 'none':
        return <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />;
      case 'all':
        return <Filter className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />;
    }
  };
  
  const renderRiskBadge = (risk: RiskLevel, label: string) => {
    const selected = isSelected(risk);
    const count = risk === 'all' 
      ? counts.high + counts.medium + counts.low + counts.none 
      : counts[risk];
      
    // Don't show filters for risks that don't exist
    if (risk !== 'all' && count === 0) return null;
    
    return (
      <button
        onClick={() => handleRiskToggle(risk)}
        className={`
          py-2 px-3.5 rounded-full text-xs
          transition-all duration-200 flex items-center space-x-1.5
          ${getRiskColor(risk, selected)}
        `}
      >
        {getRiskIcon(risk)}
        <span>{label}{count > 0 && ` (${count})`}</span>
      </button>
    );
  };

  const totalRisks = counts.high + counts.medium + counts.low + counts.none;
  const filterLabel = selectedRisks.includes('all') 
    ? `All (${totalRisks})` 
    : `${selectedRisks.length} selected`;

  return (
    <div className="mb-6 bg-gray-50/80 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm transition-all duration-300">
      <button 
        className="w-full flex justify-between items-center p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <SlidersHorizontal className="w-4 h-4 mr-2 text-primary-500 dark:text-primary-400" />
          <span>Filter by risk level</span>
          <div className="ml-2 py-0.5 px-2 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-md text-xs font-medium">
            {filterLabel}
          </div>
        </div>
        <svg 
          className={`w-5 h-5 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {expanded && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/20">
          <div className="flex flex-wrap gap-2">
            {renderRiskBadge('all', 'All')}
            {renderRiskBadge('high', 'High')}
            {renderRiskBadge('medium', 'Medium')}
            {renderRiskBadge('low', 'Low')}
            {renderRiskBadge('none', 'Safe')}
          </div>
          
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            <div className="flex flex-col items-center bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 p-2 rounded-lg text-center">
              <span className="text-xl font-bold">{counts.high}</span>
              <span className="text-xs">High</span>
            </div>
            <div className="flex flex-col items-center bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 p-2 rounded-lg text-center">
              <span className="text-xl font-bold">{counts.medium}</span>
              <span className="text-xs">Medium</span>
            </div>
            <div className="flex flex-col items-center bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-400 p-2 rounded-lg text-center">
              <span className="text-xl font-bold">{counts.low}</span>
              <span className="text-xs">Low</span>
            </div>
            <div className="flex flex-col items-center bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 p-2 rounded-lg text-center">
              <span className="text-xl font-bold">{counts.none}</span>
              <span className="text-xs">Safe</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskFilter; 