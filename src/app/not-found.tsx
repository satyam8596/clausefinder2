'use client';

import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="p-8 rounded-xl bg-white dark:bg-secondary-800 shadow-lg max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <FileQuestion className="w-20 h-20 text-primary-500" />
        </div>
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          href="/" 
          className="button-primary block"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
} 