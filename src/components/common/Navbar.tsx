'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  // Prevent hydration mismatch by not rendering theme-related UI until after mount
  const renderThemeToggle = () => {
    if (!mounted) return null;
    
    return (
      <button
        type="button"
        className="p-2 rounded-md text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 focus:outline-none"
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    );
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#features', label: 'Features' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/#founders', label: 'Founders' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <header className="fixed w-full z-50 bg-white/90 dark:bg-secondary-950/90 backdrop-blur-sm border-b border-secondary-200 dark:border-secondary-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="flex items-center font-bold text-2xl text-secondary-900 dark:text-white">
                <span className="text-primary-600 dark:text-primary-400 mr-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                  </svg>
                </span>
                ClauseFinder
                <span className="ml-2 text-xs text-white dark:text-white bg-primary-600 dark:bg-primary-500 py-1 px-2 rounded-md">BETA</span>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href) 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white'
                }`}
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/upload"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary-600 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50"
              onClick={closeMobileMenu}
            >
              Get Demo
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {renderThemeToggle()}
            
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-secondary-950 border-t border-secondary-200 dark:border-secondary-900">
          <div className="container mx-auto px-4 sm:px-6 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(link.href) 
                    ? 'text-primary-600 dark:text-primary-400 bg-secondary-100 dark:bg-secondary-900' 
                    : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-900 hover:text-secondary-900 dark:hover:text-white'
                }`}
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/upload"
              className="block w-full mt-4 text-center py-2 px-4 rounded-md bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
              onClick={closeMobileMenu}
            >
              Get Demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}; 