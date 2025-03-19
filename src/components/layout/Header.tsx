import React, { useState } from 'react';
import { Menu, Search, User, LogOut, Home, Calendar, MessageSquare, Globe, Building2, X } from 'lucide-react';
import authService from '../../services/auth.service';

// Importation dynamique du logo
import logoAvolta from '/src/images/LOGO_AVOLTA_FL_CORE_RGB.jpg';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation items for both desktop and mobile
  const navigationItems = [
    { 
      href: "/news", 
      label: "Actualités", 
      icon: Calendar 
    },
    { 
      href: "/events", 
      label: "Événements", 
      icon: MessageSquare 
    },
    { 
      href: "/bac-airport", 
      label: "BAC Airport", 
      icon: Building2 
    },
    { 
      href: "/contact", 
      label: "Contact", 
      icon: Home 
    }
  ];

  /**
   * Handle user icon click
   */
  const handleUserClick = () => {
    const isAuthenticated = authService.isAuthenticated();
    if (isAuthenticated) {
      window.location.href = '/admin';
    } else {
      window.location.href = '/login';
    }
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    authService.logout();
  };

  // Check authentication status
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <img
                src={logoAvolta}
                alt="Logo Avolta"
                className="w-25 h-10"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a 
                key={item.href} 
                href={item.href} 
                className="flex items-center text-gray-700 hover:text-[#6A0DAD] font-sans"
              >
                <item.icon className="w-5 h-5 mr-2 text-[#6A0DAD]" />
                {item.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Search className="w-5 h-5 text-[#6A0DAD]" />
            </button>

            {/* User/Login Button */}
            <button 
              onClick={handleUserClick}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label={isAuthenticated ? "Tableau de bord" : "Se connecter"}
            >
              <User className="w-5 h-5 text-[#6A0DAD]" />
            </button>

            {/* Logout Button */}
            {isAuthenticated && (
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-gray-100"
                title="Se déconnecter"
                aria-label="Se déconnecter"
              >
                <LogOut className="w-5 h-5 text-[#6A0DAD]" />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
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
              {navigationItems.map((item) => (
                <a 
                  key={item.href}
                  href={item.href} 
                  className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-[#6A0DAD]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3 text-[#6A0DAD]" />
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}