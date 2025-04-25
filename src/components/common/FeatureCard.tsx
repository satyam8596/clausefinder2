'use client';

import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <div 
      className="relative group p-6 rounded-2xl bg-secondary-100 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 bg-gradient-to-br from-primary-400/30 to-primary-500/30 dark:from-primary-600/30 dark:to-primary-700/30 rounded-full opacity-70 transform scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 -mb-10 -ml-10 bg-gradient-to-tr from-accent-400/20 to-accent-500/10 dark:from-accent-600/20 dark:to-accent-700/10 rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-500 ease-in-out"></div>
      
      <div className="relative z-10 group-hover:transform group-hover:translate-y-[-5px] transition-transform duration-300">
        <div className="text-4xl mb-4 text-primary-500 dark:text-primary-400 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <h3 className="text-xl font-semibold mb-2 text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">{title}</h3>
        <p className="text-secondary-600 dark:text-secondary-300">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard; 