/**
 * Header Component
 * 
 * This component displays the main navigation header of the application.
 * It includes the logo, navigation links, language selector, and user menu.
 * 
 * @module components/layout/Header
 */

import React, { useState } from 'react';
import { Menu, Search, User, LogOut, Home, Calendar, MessageSquare, Globe, Building2, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

/**
 * Header component
 */
export default function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * Handle user icon click
   */
  const handleUserClick = () => {
    if (isAuthenticated) {
      navigate('/admin');
    } else {
      navigate('/login');
    }
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white border-b border-gray-50 shadow-sm sticky top-0 z-50 transition-all duration-300">
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
        <Link to="/news" className="flex items-center text-gray-700 hover:text-[#6A0DAD] font-medium relative group py-2">
          <Calendar className="w-5 h-5 mr-2 text-[#6A0DAD] transition-transform duration-300 group-hover:scale-110" />
          <span>{t('header.news')}</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#6A0DAD] group-hover:w-full transition-all duration-300"></span>
        </Link>
        
        <Link to="/bac-airport" className="flex items-center text-gray-700 hover:text-[#6A0DAD] font-medium relative group py-2">
          <Building2 className="w-5 h-5 mr-2 text-[#6A0DAD] transition-transform duration-300 group-hover:scale-110" />
          <span>BAC Airport</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#6A0DAD] group-hover:w-full transition-all duration-300"></span>
        </Link>
        <Link to="/contact" className="flex items-center text-gray-700 hover:text-[#6A0DAD] font-medium relative group py-2">
          <Home className="w-5 h-5 mr-2 text-[#6A0DAD] transition-transform duration-300 group-hover:scale-110" />
          <span>{t('header.contact')}</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#6A0DAD] group-hover:w-full transition-all duration-300"></span>
        </Link>
      </nav>

      {/* Actions avec effets au survol */}
      <div className="flex items-center space-x-3">
        <LanguageSelector />
        <button className="p-2.5 rounded-full hover:bg-[#6A0DAD]/10 transition-colors duration-300">
          <Search className="w-5 h-5 text-[#6A0DAD]" />
        </button>
        <button 
          onClick={handleUserClick}
          className="p-2.5 rounded-full hover:bg-[#6A0DAD]/10 transition-colors duration-300 relative"
        >
          <User className="w-5 h-5 text-[#6A0DAD]" />
          {isAuthenticated && (
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-green-500 rounded-full"></span>
          )}
        </button>
        {isAuthenticated && (
          <button 
            onClick={handleLogout}
            className="p-2.5 rounded-full hover:bg-[#6A0DAD]/10 transition-colors duration-300"
            title="Se déconnecter"
          >
            <LogOut className="w-5 h-5 text-[#6A0DAD]" />
          </button>
        )}
        <button 
          className="md:hidden p-2.5 rounded-full hover:bg-[#6A0DAD]/10 transition-colors duration-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
  
  {/* Mobile menu avec animation de hauteur */}
  <div 
    className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
      mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
    }`}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="flex flex-col space-y-3">
        <Link 
          to="/news" 
          className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD] transition-all duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="bg-[#6A0DAD]/10 rounded-full p-2 mr-4">
            <Calendar className="w-5 h-5 text-[#6A0DAD]" />
          </div>
          <span className="font-medium">{t('header.news')}</span>
        </Link>
        <Link 
          to="/events" 
          className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD] transition-all duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="bg-[#6A0DAD]/10 rounded-full p-2 mr-4">
            <MessageSquare className="w-5 h-5 text-[#6A0DAD]" />
          </div>
          <span className="font-medium">{t('header.events')}</span>
        </Link>
        <Link 
          to="/bac-airport" 
          className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD] transition-all duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="bg-[#6A0DAD]/10 rounded-full p-2 mr-4">
            <Building2 className="w-5 h-5 text-[#6A0DAD]" />
          </div>
          <span className="font-medium">BAC Airport</span>
        </Link>
        <Link 
          to="/contact" 
          className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD] transition-all duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="bg-[#6A0DAD]/10 rounded-full p-2 mr-4">
            <Home className="w-5 h-5 text-[#6A0DAD]" />
          </div>
          <span className="font-medium">{t('header.contact')}</span>
        </Link>
      </div>
    </div>
  </div>
</header>
  );
}