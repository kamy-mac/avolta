/**
 * Header Component
 * 
 * This component displays the main navigation header of the application.
 * It includes the logo, navigation links, language selector, and user menu.
 * 
 * @module components/layout/Header
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  User, 
  LogOut, 
  Home, 
  Calendar, 
  MessageSquare, 
  Globe, 
  Building2, 
  X, 
  Menu, 
  Bell, 
  ChevronDown, 
  Settings,
  HelpCircle,
  BookOpen,
  Users
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

/**
 * Header component
 */
export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Detect scroll to add shadow effect
   */
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  /**
   * Close menus when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close user menu when clicking outside
      if (userMenuOpen && !(event.target as Element).closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
      
      // Close search when clicking outside
      if (searchOpen && !(event.target as Element).closest('.search-container')) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen, searchOpen]);

  /**
   * Close mobile menu when route changes
   */
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  /**
   * Handle user icon click
   */
  const handleUserClick = () => {
    if (isAuthenticated) {
      setUserMenuOpen(!userMenuOpen);
    } else {
      navigate('/login');
    }
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
  };

  /**
   * Handle search submission
   */
  const handleSearchSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  /**
   * Check if a navigation link is active
   */
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <header className={`bg-white border-b border-gray-50 sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'shadow-md' : 'shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo avec effet hover */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group transition-transform duration-300 hover:scale-105">
              <img
                src="/src/images/LOGO_AVOLTA_FL_CORE_RGB.jpg"
                alt="Logo Avolta"
                className="w-auto h-11 object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation avec animation de soulignement */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/news" 
              className={`flex items-center font-medium relative group py-2 ${
                isActive('/news') ? 'text-[#6A0DAD]' : 'text-gray-700 hover:text-[#6A0DAD]'
              }`}
            >
              <Calendar className={`w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110 ${
                isActive('/news') ? 'text-[#6A0DAD]' : 'text-[#6A0DAD] opacity-80'
              }`} />
              <span>{t('header.news')}</span>
              <span className={`absolute bottom-0 left-0 h-0.5 bg-[#6A0DAD] transition-all duration-300 ${
                isActive('/news') ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
            
            <Link 
              to="/bac-airport" 
              className={`flex items-center font-medium relative group py-2 ${
                isActive('/bac-airport') ? 'text-[#6A0DAD]' : 'text-gray-700 hover:text-[#6A0DAD]'
              }`}
            >
              <Building2 className={`w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110 ${
                isActive('/bac-airport') ? 'text-[#6A0DAD]' : 'text-[#6A0DAD] opacity-80'
              }`} />
              <span>BAC Airport</span>
              <span className={`absolute bottom-0 left-0 h-0.5 bg-[#6A0DAD] transition-all duration-300 ${
                isActive('/bac-airport') ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
            
            <Link 
              to="/contact" 
              className={`flex items-center font-medium relative group py-2 ${
                isActive('/contact') ? 'text-[#6A0DAD]' : 'text-gray-700 hover:text-[#6A0DAD]'
              }`}
            >
              <Home className={`w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110 ${
                isActive('/contact') ? 'text-[#6A0DAD]' : 'text-[#6A0DAD] opacity-80'
              }`} />
              <span>{t('header.contact')}</span>
              <span className={`absolute bottom-0 left-0 h-0.5 bg-[#6A0DAD] transition-all duration-300 ${
                isActive('/contact') ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
          </nav>

          {/* Actions avec effets au survol */}
          <div className="flex items-center space-x-3">
            <LanguageSelector />
            
            {/* Search button and expandable search bar */}
            <div className="relative search-container">
              <button 
                className={`p-2.5 rounded-full transition-colors duration-300 ${
                  searchOpen ? 'bg-[#6A0DAD]/20 text-[#6A0DAD]' : 'hover:bg-[#6A0DAD]/10 text-[#6A0DAD]'
                }`}
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Rechercher"
              >
                <Search className="w-5 h-5" />
              </button>
              
              {/* Expandable search form */}
              <div 
                className={`absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 origin-top-right ${
                  searchOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
                }`}
              >
                <form onSubmit={handleSearchSubmit} className="p-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:border-[#6A0DAD] focus:ring focus:ring-[#6A0DAD]/20 rounded-md transition-all duration-200"
                      autoFocus={searchOpen}
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </form>
              </div>
            </div>
            
            {/* User menu */}
            <div className="relative user-menu-container">
              <button 
                onClick={handleUserClick}
                className={`p-2.5 rounded-full transition-colors duration-300 ${
                  userMenuOpen ? 'bg-[#6A0DAD]/20 text-[#6A0DAD]' : 'hover:bg-[#6A0DAD]/10 text-[#6A0DAD]'
                } relative`}
                aria-label={isAuthenticated ? "Menu utilisateur" : "Se connecter"}
              >
                <User className="w-5 h-5" />
                {isAuthenticated && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </button>
              
              {/* User dropdown menu for authenticated users */}
              {isAuthenticated && (
                <div 
                  className={`absolute right-0 top-full mt-2 w-60 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 origin-top-right transform ${
                    userMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.username || 'Utilisateur'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                  </div>
                  
                  <div className="py-1">
                    <Link 
                      to="/admin" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD]"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3 text-gray-500" />
                      Tableau de bord
                    </Link>
                    
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin/publications" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD]"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <BookOpen className="w-4 h-4 mr-3 text-gray-500" />
                        Publications
                      </Link>
                    )}
                    
                    {user?.role === 'superadmin' && (
                      <>
                        <Link 
                          to="/admin/pending" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD]"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Bell className="w-4 h-4 mr-3 text-gray-500" />
                          Publications en attente
                        </Link>
                        <Link 
                          to="/admin/users" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD]"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Users className="w-4 h-4 mr-3 text-gray-500" />
                          Gestion utilisateurs
                        </Link>
                      </>
                    )}
                  </div>
                  
                  <div className="py-1 border-t border-gray-100">
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-3 text-red-500" />
                      Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Logout button for authenticated users (desktop) */}
            {isAuthenticated && (
              <button 
                onClick={handleLogout}
                className="hidden md:flex p-2.5 rounded-full hover:bg-[#6A0DAD]/10 transition-colors duration-300 text-[#6A0DAD]"
                title="Se déconnecter"
                aria-label="Se déconnecter"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
            
            {/* Mobile menu button with animated hamburger */}
            <button 
              className="md:hidden p-2.5 rounded-full hover:bg-[#6A0DAD]/10 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <span className={`absolute block h-0.5 w-5 bg-[#6A0DAD] transform transition-all duration-300 ${
                  mobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'
                }`}></span>
                <span className={`absolute block h-0.5 bg-[#6A0DAD] transform transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0 w-0' : 'opacity-100 w-5'
                }`}></span>
                <span className={`absolute block h-0.5 w-5 bg-[#6A0DAD] transform transition-all duration-300 ${
                  mobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'
                }`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu with enhanced animation */}
      <div 
        className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col space-y-1">
            {/* Mobile search form */}
            <form onSubmit={handleSearchSubmit} className="mb-4 mt-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:border-[#6A0DAD] focus:ring focus:ring-[#6A0DAD]/20 rounded-lg"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                <button 
                  type="submit" 
                  className="absolute right-2 top-2 bg-[#6A0DAD] text-white p-1.5 rounded-md"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
            
            {/* Navigation links */}
            <Link 
              to="/news" 
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive('/news') 
                  ? 'bg-[#6A0DAD]/10 text-[#6A0DAD]' 
                  : 'text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD]'
              }`}
            >
              <div className={`rounded-full p-2 mr-4 ${
                isActive('/news') ? 'bg-[#6A0DAD]/20' : 'bg-[#6A0DAD]/10'
              }`}>
                <Calendar className="w-5 h-5 text-[#6A0DAD]" />
              </div>
              <span className="font-medium">{t('header.news')}</span>
            </Link>
            
            <Link 
              to="/events" 
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive('/events') 
                  ? 'bg-[#6A0DAD]/10 text-[#6A0DAD]' 
                  : 'text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD]'
              }`}
            >
              <div className={`rounded-full p-2 mr-4 ${
                isActive('/events') ? 'bg-[#6A0DAD]/20' : 'bg-[#6A0DAD]/10'
              }`}>
                <MessageSquare className="w-5 h-5 text-[#6A0DAD]" />
              </div>
              <span className="font-medium">{t('header.events')}</span>
            </Link>
            
            <Link 
              to="/bac-airport" 
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive('/bac-airport') 
                  ? 'bg-[#6A0DAD]/10 text-[#6A0DAD]' 
                  : 'text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD]'
              }`}
            >
              <div className={`rounded-full p-2 mr-4 ${
                isActive('/bac-airport') ? 'bg-[#6A0DAD]/20' : 'bg-[#6A0DAD]/10'
              }`}>
                <Building2 className="w-5 h-5 text-[#6A0DAD]" />
              </div>
              <span className="font-medium">BAC Airport</span>
            </Link>
            
            <Link 
              to="/contact" 
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive('/contact') 
                  ? 'bg-[#6A0DAD]/10 text-[#6A0DAD]' 
                  : 'text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD]'
              }`}
            >
              <div className={`rounded-full p-2 mr-4 ${
                isActive('/contact') ? 'bg-[#6A0DAD]/20' : 'bg-[#6A0DAD]/10'
              }`}>
                <Home className="w-5 h-5 text-[#6A0DAD]" />
              </div>
              <span className="font-medium">{t('header.contact')}</span>
            </Link>
            
            {/* Admin links for authenticated users */}
            {isAuthenticated && (
              <>
                <div className="border-t border-gray-100 my-2 pt-2">
                  <Link 
                    to="/admin" 
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive('/admin') && !location.pathname.includes('/admin/') 
                        ? 'bg-[#6A0DAD]/10 text-[#6A0DAD]' 
                        : 'text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD]'
                    }`}
                  >
                    <div className={`rounded-full p-2 mr-4 ${
                      isActive('/admin') && !location.pathname.includes('/admin/') ? 'bg-[#6A0DAD]/20' : 'bg-[#6A0DAD]/10'
                    }`}>
                      <Settings className="w-5 h-5 text-[#6A0DAD]" />
                    </div>
                    <span className="font-medium">Tableau de bord</span>
                  </Link>
                  
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin/publications" 
                      className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive('/admin/publications') 
                          ? 'bg-[#6A0DAD]/10 text-[#6A0DAD]' 
                          : 'text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD]'
                      }`}
                    >
                      <div className={`rounded-full p-2 mr-4 ${
                        isActive('/admin/publications') ? 'bg-[#6A0DAD]/20' : 'bg-[#6A0DAD]/10'
                      }`}>
                        <BookOpen className="w-5 h-5 text-[#6A0DAD]" />
                      </div>
                      <span className="font-medium">Publications</span>
                    </Link>
                  )}
                  
                  {user?.role === 'superadmin' && (
                    <>
                      <Link 
                        to="/admin/pending" 
                        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive('/admin/pending') 
                            ? 'bg-[#6A0DAD]/10 text-[#6A0DAD]' 
                            : 'text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD]'
                        }`}
                      >
                        <div className={`rounded-full p-2 mr-4 ${
                          isActive('/admin/pending') ? 'bg-[#6A0DAD]/20' : 'bg-[#6A0DAD]/10'
                        }`}>
                          <Bell className="w-5 h-5 text-[#6A0DAD]" />
                        </div>
                        <span className="font-medium">Publications en attente</span>
                      </Link>
                      
                      <Link 
                        to="/admin/users" 
                        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive('/admin/users') 
                            ? 'bg-[#6A0DAD]/10 text-[#6A0DAD]' 
                            : 'text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD]'
                        }`}
                      >
                        <div className={`rounded-full p-2 mr-4 ${
                          isActive('/admin/users') ? 'bg-[#6A0DAD]/20' : 'bg-[#6A0DAD]/10'
                        }`}>
                          <Users className="w-5 h-5 text-[#6A0DAD]" />
                        </div>
                        <span className="font-medium">Gestion utilisateurs</span>
                      </Link>
                    </>
                  )}
                </div>
                
                {/* Logout button for mobile */}
                <button 
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <div className="bg-red-100 rounded-full p-2 mr-4">
                    <LogOut className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="font-medium">Se déconnecter</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}