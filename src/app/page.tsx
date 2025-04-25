'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BadgeCheck, BookText, Shield, BarChart2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import FeatureCard from '@/components/common/FeatureCard';
import Image from 'next/image';

// Dynamically import 3D components with no SSR
const Document3D = dynamic(() => import('@/components/3d/Document3D'), { ssr: false });
const ClauseAnimation = dynamic(() => import('@/components/3d/ClauseAnimation'), { ssr: false });
const AIDocumentAnalysis = dynamic(() => import('@/components/3d/AIDocumentAnalysis'), { ssr: false });

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-secondary-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gradient-to-br dark:from-primary-950 dark:via-primary-900 dark:to-secondary-900 py-20 lg:py-28">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_20%,transparent_100%)]"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[40rem] h-[40rem] rounded-full bg-primary-100/40 dark:bg-primary-500/20 blur-[128px]"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/3 w-[30rem] h-[30rem] rounded-full bg-accent-100/30 dark:bg-accent-500/20 blur-[96px]"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl space-y-8 text-center lg:text-left">
              <div>
                <div 
                  className="inline-flex items-center rounded-full bg-primary-50 border border-primary-200 dark:bg-primary-500/20 dark:border-primary-300/20 px-3 py-1 text-sm text-primary-700 dark:text-primary-200 backdrop-blur-sm animate-fadeIn"
                  style={{ animationDelay: '100ms' }}
                >
                  <span className="mr-2 rounded-full bg-primary-500 px-1.5 py-0.5 text-xs font-semibold uppercase text-white">New</span>
                  <span>Introducing ClauseFinder AI v2.0</span>
                </div>
              </div>
              
              <h1 
                className="text-4xl md:text-5xl xl:text-6xl font-bold text-secondary-900 dark:text-white animate-fadeInUp"
                style={{ animationDelay: '200ms' }}
              >
                AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600">Contract Analysis</span> For Legal Professionals
              </h1>
              
              <p 
                className="text-lg text-secondary-700 dark:text-secondary-300 animate-fadeInUp"
                style={{ animationDelay: '300ms' }}
              >
                ClauseFinder AI helps legal teams quickly identify, analyze, and extract critical clauses from contracts. Save hours of review time and never miss important contract terms again.
              </p>
              
              <div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fadeInUp" 
                style={{ animationDelay: '400ms' }}
              >
                <Link 
                  href="/upload" 
                  className="inline-flex h-12 items-center justify-center rounded-md bg-primary-600 px-8 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-primary-500 focus-visible:outline-none"
                >
                  Try Free Demo
                </Link>
                <Link 
                  href="/dashboard" 
                  className="inline-flex h-12 items-center justify-center rounded-md bg-secondary-100 dark:bg-secondary-800/80 backdrop-blur-sm border border-secondary-200 dark:border-secondary-700/30 px-8 text-sm font-medium text-secondary-900 dark:text-white shadow transition-all duration-300 hover:bg-secondary-200 dark:hover:bg-secondary-800 hover:border-secondary-300/50 dark:hover:border-secondary-700/50 focus-visible:outline-none"
                >
                  View Dashboard
                </Link>
              </div>
              
              <div 
                className="flex items-center justify-center lg:justify-start space-x-4 text-sm text-secondary-600 dark:text-secondary-400 animate-fadeIn"
                style={{ animationDelay: '500ms' }}
              >
                <div className="flex -space-x-2">
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-secondary-900 bg-gradient-to-br from-secondary-300 to-secondary-400 dark:from-secondary-700 dark:to-secondary-800"></div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-secondary-900 bg-gradient-to-br from-secondary-300 to-secondary-400 dark:from-secondary-700 dark:to-secondary-800"></div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-secondary-900 bg-gradient-to-br from-secondary-300 to-secondary-400 dark:from-secondary-700 dark:to-secondary-800"></div>
                </div>
                <div>
                  <span className="font-medium text-secondary-900 dark:text-white">500+</span> legal teams trust ClauseFinder
                </div>
              </div>
            </div>
            
            <div 
              className="w-full max-w-lg rounded-lg border border-secondary-200 dark:border-secondary-800/50 overflow-hidden shadow-2xl shadow-secondary-300/30 dark:shadow-secondary-900/50 animate-fadeInUp bg-white dark:bg-gradient-to-br dark:from-secondary-900 dark:to-secondary-800"
              style={{ animationDelay: '600ms' }}
            >
              <div className="p-1">
                <div className="rounded-md bg-secondary-100 dark:bg-secondary-950 px-4 py-2 flex items-center space-x-1">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <div className="ml-2 text-xs text-secondary-600 dark:text-secondary-400">contract-analysis.ai</div>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex space-x-4 items-start">
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary-500 dark:bg-primary-700 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white dark:text-primary-200" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-24 bg-secondary-300 dark:bg-secondary-700 rounded mb-2"></div>
                    <div className="h-2 w-full bg-secondary-200 dark:bg-secondary-800 rounded"></div>
                  </div>
                </div>
                
                <div className="flex space-x-4 items-start">
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-accent-500 dark:bg-accent-700 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white dark:text-accent-200" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-32 bg-secondary-300 dark:bg-secondary-700 rounded mb-2"></div>
                    <div className="h-2 w-full bg-secondary-200 dark:bg-secondary-800 rounded"></div>
                  </div>
                </div>
                
                <div className="flex space-x-4 items-start">
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-yellow-400 dark:bg-yellow-700 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white dark:text-yellow-200" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-20 bg-secondary-300 dark:bg-secondary-700 rounded mb-2"></div>
                    <div className="h-2 w-full bg-secondary-200 dark:bg-secondary-800 rounded"></div>
                  </div>
                </div>
                
                <div className="mt-8 space-y-2">
                  <div className="h-2 w-3/4 bg-secondary-200 dark:bg-secondary-800 rounded"></div>
                  <div className="h-2 w-full bg-secondary-200 dark:bg-secondary-800 rounded"></div>
                  <div className="h-2 w-2/3 bg-secondary-200 dark:bg-secondary-800 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-secondary-50 dark:bg-secondary-900 relative overflow-hidden">
        <div className="bg-grid-pattern absolute inset-0 opacity-5"></div>
        
        {/* Floating background elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-500/5 dark:bg-primary-700/5 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-500/5 dark:bg-primary-600/5 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-1 mb-4 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/80 border border-primary-100 dark:border-primary-900/50 rounded-full animate-fadeInUp" style={{ animationDelay: '0ms' }}>
              Powerful Features
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-secondary-900 dark:text-white animate-fadeInUp" style={{ animationDelay: '100ms' }}>
              Why Choose ClauseFinder
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-300 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
              Our platform combines cutting-edge AI with legal expertise to deliver unmatched contract analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="🔍"
              title="Smart Clause Detection"
              description="Our AI accurately identifies and extracts key clauses from any legal document, saving you hours of manual review."
              delay={100}
            />
            <FeatureCard
              icon="⚠️"
              title="Risk Assessment"
              description="Get instant insights into potential legal risks in your contracts with our advanced risk scoring system."
              delay={300}
            />
            <FeatureCard
              icon="📊"
              title="Detailed Analysis"
              description="Receive comprehensive reports that break down complex legal language into actionable insights."
              delay={500}
            />
            <FeatureCard
              icon="⚡"
              title="Lightning Fast"
              description="Process documents in seconds, not hours. Our platform delivers results at unmatched speed."
              delay={700}
            />
            <FeatureCard
              icon="🔐"
              title="Secure & Confidential"
              description="Your documents remain private and secure with enterprise-grade encryption and security protocols."
              delay={900}
            />
            <FeatureCard
              icon="🤝"
              title="Collaboration Tools"
              description="Share insights with team members and collaborate on document analysis in real-time."
              delay={1100}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-secondary-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-500/10 dark:from-primary-900/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-accent-500/10 dark:from-primary-800/10 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-1 mb-4 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/80 border border-primary-100 dark:border-primary-900/50 rounded-full animate-fadeInUp" style={{ animationDelay: '0ms' }}>
              Simple Process
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-secondary-900 dark:text-white animate-fadeInUp" style={{ animationDelay: '100ms' }}>
              How ClauseFinder AI Works
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-300 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
              Our platform uses Google Gemini technology to analyze legal documents with unparalleled accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 animate-fadeInUp" style={{ animationDelay: '300ms' }}>
              <div className="relative backdrop-blur-sm p-5 rounded-2xl shadow-xl bg-white/90 dark:bg-secondary-900/90 border border-secondary-200/50 dark:border-secondary-800/50 transform transition-all duration-700 hover:scale-105">
                {isMounted ? (
                  <AIDocumentAnalysis />
                ) : (
                  <div className="h-[400px] flex items-center justify-center">
                    <p className="text-secondary-600 dark:text-secondary-300">Loading animation...</p>
                  </div>
                )}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="space-y-8">
                <div className="flex gap-4 items-start animate-fadeInUp" style={{ animationDelay: '400ms' }}>
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-xl">1</div>
                  <div className="pt-1">
                    <h3 className="text-xl font-semibold mb-2 text-secondary-900 dark:text-white">Upload Your Document</h3>
                    <p className="text-secondary-600 dark:text-secondary-300">Simply upload your contract in PDF, DOCX, or TXT format through our secure interface. Your data remains private and encrypted.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start animate-fadeInUp" style={{ animationDelay: '600ms' }}>
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-xl">2</div>
                  <div className="pt-1">
                    <h3 className="text-xl font-semibold mb-2 text-secondary-900 dark:text-white">AI Analysis</h3>
                    <p className="text-secondary-600 dark:text-secondary-300">Our AI reads and understands the document, identifying important clauses and potential legal risks with state-of-the-art accuracy.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start animate-fadeInUp" style={{ animationDelay: '800ms' }}>
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-xl">3</div>
                  <div className="pt-1">
                    <h3 className="text-xl font-semibold mb-2 text-secondary-900 dark:text-white">Get Detailed Reports</h3>
                    <p className="text-secondary-600 dark:text-secondary-300">Review comprehensive reports with extracted clauses, risk assessments, and recommended actions that help you make informed decisions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section id="founders" className="py-20 bg-secondary-50 dark:bg-secondary-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary-500/10 dark:from-primary-900/10 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-accent-500/10 dark:from-primary-800/10 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-1 mb-4 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/80 border border-primary-100 dark:border-primary-900/50 rounded-full animate-fadeInUp" style={{ animationDelay: '0ms' }}>
              Meet The Team
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-secondary-900 dark:text-white animate-fadeInUp" style={{ animationDelay: '100ms' }}>
              Our Founders
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-300 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
              Legal experts and AI engineers combining decades of experience to revolutionize contract analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Founder 1 */}
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm overflow-hidden border border-secondary-200 dark:border-secondary-700 transition-all duration-300 hover:shadow-md animate-fadeInUp" style={{ animationDelay: '300ms' }}>
              <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/30">
                <div className="absolute inset-0 flex items-center justify-center text-primary-500 dark:text-primary-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-secondary-900 dark:text-white mb-1">Tejas Pipaiya</h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium text-xs mb-2">CEO & Product Lead</p>
                <p className="text-secondary-600 dark:text-secondary-300 text-sm mb-3">
                  Tech entrepreneur with expertise in AI and legal technology.
                </p>
                <div className="flex space-x-2">
                  <a href="#" className="text-secondary-500 hover:text-primary-600 dark:hover:text-primary-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  <a href="#" className="text-secondary-500 hover:text-primary-600 dark:hover:text-primary-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Founder 2 */}
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm overflow-hidden border border-secondary-200 dark:border-secondary-700 transition-all duration-300 hover:shadow-md animate-fadeInUp" style={{ animationDelay: '400ms' }}>
              <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/30">
                <div className="absolute inset-0 flex items-center justify-center text-primary-500 dark:text-primary-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-secondary-900 dark:text-white mb-1">Tirth Patel</h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium text-xs mb-2">CTO & AI Research Lead</p>
                <p className="text-secondary-600 dark:text-secondary-300 text-sm mb-3">
                  AI specialist with deep expertise in NLP and machine learning models.
                </p>
                <div className="flex space-x-2">
                  <a href="#" className="text-secondary-500 hover:text-primary-600 dark:hover:text-primary-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  <a href="#" className="text-secondary-500 hover:text-primary-600 dark:hover:text-primary-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-800 dark:to-primary-900 py-20">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_60%)]"></div>
          <div className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_60%)]"></div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary-500/20 dark:bg-primary-700/20 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-accent-400/20 dark:bg-primary-600/20 blur-3xl"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 
              className="text-3xl md:text-4xl font-bold text-white mb-6 animate-fadeInUp"
              style={{ animationDelay: '100ms' }}
            >
              Ready to Transform Your Contract Review Process?
            </h2>
            <p 
              className="text-lg text-primary-50 mb-8 animate-fadeInUp"
              style={{ animationDelay: '200ms' }}
            >
              Join thousands of legal professionals who are saving time and reducing risk with ClauseFinder AI. Our platform helps you identify critical contract clauses and potential risks in seconds.
            </p>
            <div 
              className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp"
              style={{ animationDelay: '300ms' }}
            >
              <Link 
                href="/upload" 
                className="inline-flex h-10 items-center justify-center rounded-md bg-white px-6 text-sm font-medium text-primary-700 dark:text-primary-800 shadow-md transition-all duration-300 hover:bg-primary-50 hover:shadow-lg focus-visible:outline-none"
              >
                Try Free Demo
              </Link>
              <Link 
                href="/dashboard" 
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary-400/50 dark:bg-primary-700/50 backdrop-blur-sm border border-primary-300/30 dark:border-primary-600/30 px-6 text-sm font-medium text-white shadow transition-all duration-300 hover:bg-primary-400/70 dark:hover:bg-primary-700/70 hover:border-primary-300/50 dark:hover:border-primary-600/50 focus-visible:outline-none"
              >
                Contact Sales
              </Link>
            </div>
          </div>
          
          {/* Stats */}
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fadeInUp"
            style={{ animationDelay: '400ms' }}
          >
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-1">10,000+</p>
              <p className="text-sm text-primary-100">Documents Analyzed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-1">97%</p>
              <p className="text-sm text-primary-100">Accuracy Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-1">75%</p>
              <p className="text-sm text-primary-100">Time Saved</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-1">500+</p>
              <p className="text-sm text-primary-100">Enterprise Clients</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 