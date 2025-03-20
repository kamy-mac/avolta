import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plus, List, Mail, Bell, BarChart, Settings, Clock, Home, Users, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isSuperAdmin } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };
  // Dans AdminHeader.tsx

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  console.log('User role:', user?.role);
  console.log('isSuperAdmin:', isSuperAdmin);
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#6A0DAD] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="font-semibold text-[#6A0DAD]">Admin</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-gray-600 hover:text-[#6A0DAD] text-sm font-medium rounded-md transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              Accueil
            </Link>
            
            <Link
              to="/admin/create"
              className={`inline-flex items-center px-4 py-2 border ${
                isActive('create')
                  ? 'border-[#6A0DAD] text-white bg-[#6A0DAD]'
                  : 'border-transparent text-gray-600 hover:text-[#6A0DAD]'
              } text-sm font-medium rounded-md transition-colors`}
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouvelle publication
            </Link>
            
            <Link
              to="/admin/publications"
              className={`inline-flex items-center px-4 py-2 border ${
                isActive('publications')
                  ? 'border-[#6A0DAD] text-white bg-[#6A0DAD]'
                  : 'border-transparent text-gray-600 hover:text-[#6A0DAD]'
              } text-sm font-medium rounded-md transition-colors`}
            >
              <List className="h-5 w-5 mr-2" />
              Publications
            </Link>

            {isSuperAdmin && (
              <>
                <Link
                  to="/admin/pending"
                  className={`inline-flex items-center px-4 py-2 border ${
                    isActive('pending')
                      ? 'border-[#6A0DAD] text-white bg-[#6A0DAD]'
                      : 'border-transparent text-gray-600 hover:text-[#6A0DAD]'
                  } text-sm font-medium rounded-md transition-colors`}
                >
                  <Clock className="h-5 w-5 mr-2" />
                  En attente
                </Link>

                <Link
                  to="/admin/users"
                  className={`inline-flex items-center px-4 py-2 border ${
                    isActive('users')
                      ? 'border-[#6A0DAD] text-white bg-[#6A0DAD]'
                      : 'border-transparent text-gray-600 hover:text-[#6A0DAD]'
                  } text-sm font-medium rounded-md transition-colors`}
                >
                  <Users className="h-5 w-5 mr-2" />
                  Administrateurs
                </Link>
              </>
            )}

            <Link
              to="/admin/newsletter"
              className={`inline-flex items-center px-4 py-2 border ${
                isActive('newsletter')
                  ? 'border-[#6A0DAD] text-white bg-[#6A0DAD]'
                  : 'border-transparent text-gray-600 hover:text-[#6A0DAD]'
              } text-sm font-medium rounded-md transition-colors`}
            >
              <Mail className="h-5 w-5 mr-2" />
              Newsletter
            </Link>

            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-md text-gray-400 hover:text-[#6A0DAD] relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 transform translate-x-1/2 -translate-y-1/2"></span>
              </button>
              
              <button className="p-2 rounded-md text-gray-400 hover:text-[#6A0DAD]">
                <BarChart className="h-6 w-6" />
              </button>
              
              <button className="p-2 rounded-md text-gray-400 hover:text-[#6A0DAD]">
                <Settings className="h-6 w-6" />
              </button>
              
              <button 
                onClick={handleLogout}
                className="p-2 rounded-md text-gray-400 hover:text-[#6A0DAD]"
                title="Se déconnecter"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}