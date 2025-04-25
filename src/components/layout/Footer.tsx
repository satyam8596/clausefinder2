'use client';

import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-900 border-t border-secondary-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-bold text-white">
                Clause<span className="text-primary-400">Finder</span>
              </span>
            </Link>
            <p className="text-secondary-400 mb-4 text-sm">
              Advanced AI-powered legal contract analysis to help legal professionals work smarter and faster.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-white mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/#features" 
                  className="text-secondary-400 hover:text-primary-400 text-sm transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  href="/pricing" 
                  className="text-secondary-400 hover:text-primary-400 text-sm transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  href="/integrations" 
                  className="text-secondary-400 hover:text-primary-400 text-sm transition-colors"
                >
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-white mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/blog" 
                  className="text-secondary-400 hover:text-primary-400 text-sm transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/help" 
                  className="text-secondary-400 hover:text-primary-400 text-sm transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  href="/documentation" 
                  className="text-secondary-400 hover:text-primary-400 text-sm transition-colors"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-white mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/about" 
                  className="text-secondary-400 hover:text-primary-400 text-sm transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-secondary-400 hover:text-primary-400 text-sm transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/careers" 
                  className="text-secondary-400 hover:text-primary-400 text-sm transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-secondary-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-secondary-500">
            &copy; {currentYear} ClauseFinder. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy" className="text-sm text-secondary-500 hover:text-primary-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-secondary-500 hover:text-primary-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 