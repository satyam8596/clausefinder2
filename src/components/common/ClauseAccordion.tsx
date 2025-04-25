'use client';

import { useState } from 'react';
import { ChevronDown, AlertTriangle, CheckCircle, FileText, Info, Tag, Clock, Calendar, Hash } from 'lucide-react';

interface Clause {
  id: string;
  title: string;
  content: string;
  category: string;
  risk: 'high' | 'medium' | 'low' | 'none';
}

interface ClauseAccordionProps {
  clauses: Clause[];
}

const ClauseAccordion = ({ clauses }: ClauseAccordionProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getRiskColor = (risk: Clause['risk']) => {
    switch (risk) {
      case 'high':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30';
      case 'medium':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/30';
      case 'low':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/30';
      case 'none':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30';
      default:
        return 'text-secondary-600 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-900/20 border-secondary-200 dark:border-secondary-700';
    }
  };

  const getRiskIcon = (risk: Clause['risk']) => {
    if (risk === 'none') {
      return <CheckCircle className="w-4 h-4" />;
    }
    return <AlertTriangle className="w-4 h-4" />;
  };

  const getBorderColor = (risk: Clause['risk'], isExpanded: boolean) => {
    if (!isExpanded) return '';
    
    switch (risk) {
      case 'high':
        return 'border-l-4 border-l-red-500 dark:border-l-red-600';
      case 'medium':
        return 'border-l-4 border-l-amber-500 dark:border-l-amber-600';
      case 'low':
        return 'border-l-4 border-l-yellow-500 dark:border-l-yellow-600';
      case 'none':
        return 'border-l-4 border-l-green-500 dark:border-l-green-600';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      {clauses.map((clause) => {
        const isExpanded = expandedId === clause.id;
        return (
          <div
            key={clause.id}
            className={`accordion-item bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${
              isExpanded ? 'shadow-md ring-1 ring-gray-200 dark:ring-gray-700' : 'border border-gray-200 dark:border-gray-700'
            } ${getBorderColor(clause.risk, isExpanded)}`}
            data-risk={clause.risk}
            data-id={clause.id}
          >
            <button
              onClick={() => toggleExpand(clause.id)}
              className={`accordion-button w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors ${
                isExpanded ? 'bg-gray-50 dark:bg-gray-800/50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`risk-badge px-2.5 py-1.5 rounded-full text-xs font-medium border ${getRiskColor(clause.risk)}`}>
                  <div className="flex items-center space-x-1.5">
                    {getRiskIcon(clause.risk)}
                    <span>{clause.risk === 'none' ? 'Safe' : `${clause.risk} risk`}</span>
                  </div>
                </div>
                <h3 className="clause-title font-semibold text-gray-800 dark:text-gray-100 text-sm md:text-base">
                  {clause.title.replace(/^\*\*/g, '')}
                </h3>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {isExpanded && (
              <div className="accordion-content animate-fadeIn">
                <div className="p-5 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-200 dark:border-gray-700">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Clause Content</h4>
                      <div className="clause-content text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                        {clause.content}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700/30 rounded-lg">
                      <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Category</div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {clause.category || "Unspecified"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700/30 rounded-lg">
                      <Hash className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Identifier</div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {clause.id}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Copy to clipboard functionality could be added here
                        navigator.clipboard.writeText(clause.content);
                      }}
                      className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                      Copy text
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ClauseAccordion; 