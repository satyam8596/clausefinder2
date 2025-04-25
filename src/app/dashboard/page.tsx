'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart, FileText, Filter, Calendar, 
  PlusCircle, ChevronRight, Search
} from 'lucide-react';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';

// Sample data for demonstration
const documents = [
  { 
    id: '1', 
    name: 'Software License Agreement.pdf', 
    status: 'completed', 
    date: '2025-03-15T14:30:00Z',
    clauses: 24,
    risks: 3
  },
  { 
    id: '2', 
    name: 'Employment Contract.docx', 
    status: 'completed', 
    date: '2025-03-10T09:45:00Z',
    clauses: 18,
    risks: 1
  },
  { 
    id: '3', 
    name: 'SaaS Service Agreement.pdf', 
    status: 'analyzing', 
    date: '2025-03-18T11:20:00Z',
    clauses: 0,
    risks: 0
  },
  { 
    id: '4', 
    name: 'NDA with XYZ Corp.pdf', 
    status: 'completed', 
    date: '2025-03-05T16:10:00Z',
    clauses: 12,
    risks: 0
  },
  { 
    id: '5', 
    name: 'Office Lease Agreement.pdf', 
    status: 'pending', 
    date: '2025-03-18T10:15:00Z',
    clauses: 0,
    risks: 0
  }
];

export default function Dashboard() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'analyzing':
        return <Clock className="w-5 h-5 text-primary-500 animate-pulse" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-secondary-400" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'analyzing':
        return 'Analyzing...';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-secondary-50 dark:bg-secondary-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">My Contracts</h1>
            <p className="text-secondary-600 dark:text-secondary-400">Manage and analyze your legal documents</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
            <Link 
              href="/upload"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary-600 px-6 text-sm font-medium text-white shadow transition-colors hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Upload New</span>
            </Link>
          </div>
        </div>

        {/* Search and filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-secondary-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Search documents..."
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Documents grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc, index) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary-200 dark:hover:border-primary-700/30"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/30">
                  <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary-100 dark:bg-secondary-800">
                  {getStatusIcon(doc.status)}
                  <span className="text-xs font-medium text-secondary-700 dark:text-secondary-300">
                    {getStatusText(doc.status)}
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2 truncate" title={doc.name}>
                {doc.name}
              </h3>
              
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-4">
                Uploaded on {formatDate(doc.date)}
              </p>
              
              {doc.status === 'completed' && (
                <div className="flex justify-between text-sm mb-4">
                  <div>
                    <span className="font-medium text-secondary-700 dark:text-secondary-300">{doc.clauses}</span>
                    <span className="text-secondary-500 dark:text-secondary-400"> clauses</span>
                  </div>
                  {doc.risks > 0 ? (
                    <div className="flex items-center text-red-600 dark:text-red-400">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      <span className="font-medium">{doc.risks} risks</span>
                    </div>
                  ) : (
                    <div className="text-green-600 dark:text-green-400 font-medium">No risks</div>
                  )}
                </div>
              )}
              
              <div className="flex justify-end gap-3 mt-auto pt-4 border-t border-secondary-100 dark:border-secondary-700/50">
                {doc.status === 'completed' ? (
                  <Link
                    href={`/clauses/${doc.id}`}
                    className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-md font-medium text-sm hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                  >
                    View Report
                  </Link>
                ) : (
                  <button 
                    className="px-4 py-2 bg-secondary-50 dark:bg-secondary-700 text-secondary-500 dark:text-secondary-400 rounded-md font-medium text-sm cursor-not-allowed"
                    disabled
                  >
                    Processing...
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 