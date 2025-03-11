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
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/src/images/LOGO_AVOLTA_FL_CORE_RGB.jpg"
                alt="Logo Avolta"
                className="w-25 h-10"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/news" className="flex items-center text-gray-700 hover:text-[#6A0DAD] font-sans">
              <Calendar className="w-5 h-5 mr-2 text-[#6A0DAD]" />
              {t('header.news')}
            </Link>
            <Link to="/events" className="flex items-center text-gray-700 hover:text-[#6A0DAD] font-sans">
              <MessageSquare className="w-5 h-5 mr-2 text-[#6A0DAD]" />
              {t('header.events')}
            </Link>
            <Link to="/bac-airport" className="flex items-center text-gray-700 hover:text-[#6A0DAD] font-sans">
              <Building2 className="w-5 h-5 mr-2 text-[#6A0DAD]" />
              BAC Airport
            </Link>
            <Link to="/contact" className="flex items-center text-gray-700 hover:text-[#6A0DAD] font-sans">
              <Home className="w-5 h-5 mr-2 text-[#6A0DAD]" />
              {t('header.contact')}
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Search className="w-5 h-5 text-[#6A0DAD]" />
            </button>
            <button 
              onClick={handleUserClick}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <User className="w-5 h-5 text-[#6A0DAD]" />
            </button>
            {isAuthenticated && (
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-gray-100"
                title="Se déconnecter"
              >
                <LogOut className="w-5 h-5 text-[#6A0DAD]" />
              </button>
            )}
            <button 
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#6A0DAD]" />
              ) : (
                <Menu className="w-5 h-5 text-[#6A0DAD]" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-2 py-3">
              <Link 
                to="/news" 
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-[#6A0DAD]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Calendar className="w-5 h-5 mr-3 text-[#6A0DAD]" />
                {t('header.news')}
              </Link>
              <Link 
                to="/events" 
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-[#6A0DAD]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MessageSquare className="w-5 h-5 mr-3 text-[#6A0DAD]" />
                {t('header.events')}
              </Link>
              <Link 
                to="/bac-airport" 
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-[#6A0DAD]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Building2 className="w-5 h-5 mr-3 text-[#6A0DAD]" />
                BAC Airport
              </Link>
              <Link 
                to="/contact" 
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-[#6A0DAD]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5 mr-3 text-[#6A0DAD]" />
                {t('header.contact')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}