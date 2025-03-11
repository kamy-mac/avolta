/**
 * BAC Airport Page
 * 
 * This page displays content specifically for BAC Airport personnel.
 * It requires a code to access.
 * 
 * @module pages/BacAirportPage
 */

import React, { useState, useEffect } from 'react';
import { Lock, Building2, AlertCircle, CheckCircle, Eye, EyeOff, Calendar, Tag, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Post } from '../types';
import NewsCard from '../components/news/NewsCard';
import { getPublishedPublications } from '../lib/storage';

// Access code for BAC personnel
const BAC_ACCESS_CODE = 'bac123';

export default function BacAirportPage() {
  const [accessCode, setAccessCode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already authorized (from localStorage)
  useEffect(() => {
    const authorized = localStorage.getItem('bac_authorized') === 'true';
    setIsAuthorized(authorized);
    
    if (authorized) {
      loadBacPosts();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Load BAC-specific posts
  const loadBacPosts = async () => {
    try {
      setIsLoading(true);
      // Use the local storage function instead of the API service
      const allPosts = await getPublishedPublications();
      
      // Filter posts that have "bac" in the title or content (simulating BAC-specific content)
      const bacPosts = allPosts.filter(post => 
        post.title.toLowerCase().includes('bac') || 
        post.content.toLowerCase().includes('bac') ||
        post.category === 'bac'
      );
      
      // If no BAC posts found, use regular posts (for demo purposes)
      setPosts(bacPosts.length > 0 ? bacPosts : allPosts.slice(0, 3));
    } catch (error) {
      console.error('Error loading BAC posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle access code submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (accessCode === BAC_ACCESS_CODE) {
      setIsAuthorized(true);
      setSuccess('Accès autorisé. Bienvenue dans l\'espace BAC Airport!');
      localStorage.setItem('bac_authorized', 'true');
      loadBacPosts();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } else {
      setError('Code d\'accès incorrect. Veuillez réessayer.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthorized(false);
    localStorage.removeItem('bac_authorized');
    setAccessCode('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Building2 className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Espace BAC Airport</h1>
          </div>
          
          {isAuthorized && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 flex items-center"
            >
              <Lock className="w-4 h-4 mr-2" />
              Déconnexion
            </button>
          )}
        </div>
        
        {/* Access Form */}
        {!isAuthorized ? (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès Réservé</h2>
              <p className="text-gray-600">
                Cet espace est réservé au personnel de Brussels Airport Company.
                Veuillez saisir le code d'accès pour continuer.
              </p>
            </div>
            
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Code d'accès
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="accessCode"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                    placeholder="Entrez le code d'accès"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Indice: Pour cette démo, le code est "bac123"
                </p>
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition-colors"
              >
                Accéder
              </button>
            </form>
          </div>
        ) : (
          // BAC Content (visible after authentication)
          <div>
            {/* Welcome Banner */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Bienvenue dans l'espace BAC Airport</h2>
              <p className="text-gray-600 mb-4">
                Cet espace est dédié au personnel de Brussels Airport Company. Vous y trouverez des actualités, 
                des événements et des informations exclusives concernant BAC Airport.
              </p>
              
              <div className="bg-primary/10 rounded-lg p-4 flex items-start">
                <Calendar className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900">Prochain événement important</h3>
                  <p className="text-gray-600">Réunion du personnel - 15 avril 2025 à 14h00 - Salle de conférence principale</p>
                </div>
              </div>
            </div>
            
            {/* BAC News */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Tag className="w-6 h-6 mr-2 text-primary" />
              Actualités BAC
            </h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-lg shadow-lg h-96 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <NewsCard key={post.id} post={post} />
                ))}
              </div>
            )}
            
            {/* Staff Directory */}
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6 flex items-center">
              <User className="w-6 h-6 mr-2 text-primary" />
              Annuaire du Personnel
            </h2>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Département
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Poste
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { name: 'Jean Dupont', department: 'Opérations', position: 'Directeur', email: 'j.dupont@bac.be' },
                    { name: 'Marie Lambert', department: 'Ressources Humaines', position: 'Responsable', email: 'm.lambert@bac.be' },
                    { name: 'Pierre Durand', department: 'Sécurité', position: 'Chef d\'équipe', email: 'p.durand@bac.be' },
                    { name: 'Sophie Martin', department: 'Communication', position: 'Coordinatrice', email: 's.martin@bac.be' },
                    { name: 'Thomas Leroy', department: 'Maintenance', position: 'Technicien', email: 't.leroy@bac.be' }
                  ].map((person, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{person.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{person.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{person.position}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a href={`mailto:${person.email}`} className="text-sm text-primary hover:text-primary-dark">
                          {person.email}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}