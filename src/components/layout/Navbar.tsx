'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Upload', path: '/upload' },
  ];

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled || isMenuOpen
      ? 'bg-white/90 dark:bg-secondary-900/90 backdrop-blur-md shadow-md'
      : 'bg-transparent'
  }`;

  return (
    <>
      <nav className={navbarClasses}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-2"
            >
              <span className="text-2xl font-serif font-bold text-secondary-900 dark:text-white">
                ClauseFinder<span className="text-primary-600">AI</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`text-sm font-medium hover:text-primary-600 transition-colors ${
                      pathname === link.path
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-secondary-700 dark:text-secondary-300'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors"
                  aria-label="Toggle theme"
                >
                  {mounted && theme === 'dark' ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>

                <Link
                  href="/upload"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Try Free
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors"
                aria-label="Toggle theme"
              >
                {mounted && theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-secondary-900 shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={closeMenu}
                    className={`py-2 text-base font-medium ${
                      pathname === link.path
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-secondary-700 dark:text-secondary-300'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/upload"
                  onClick={closeMenu}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-center text-sm font-medium transition-colors mt-2"
                >
                  Try Free
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
      {/* Spacer to ensure content is not hidden behind the fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar; 