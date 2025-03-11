import React, { useState, useEffect } from 'react';
import { Calendar, Trash2, Eye, Edit2, Search, Filter, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getPublications, deletePublication } from '../../lib/storage';
import { Post } from '../../types';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Publications() {
  const [publications, setPublications] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'expired' | 'pending'>('all');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadPublications();
  }, []);

  const loadPublications = async () => {
    try {
      const data = await getPublications();
      setPublications(data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error('Error loading publications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        pub.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const now = new Date();
    const validFrom = new Date(pub.validFrom);
    const validTo = new Date(pub.validTo);
    
    switch (filter) {
      case 'active':
        return matchesSearch && now >= validFrom && now <= validTo && pub.status === 'published';
      case 'expired':
        return matchesSearch && now > validTo && pub.status === 'published';
      case 'pending':
        return matchesSearch && pub.status === 'pending';
      default:
        return matchesSearch;
    }
  });

  const handleDelete = async (id: string) => {
    if (window.confirm(t('admin.publications.confirmDelete'))) {
      try {
        await deletePublication(id);
        setPublications(prev => prev.filter(pub => pub.id !== id));
      } catch (error) {
        console.error('Error deleting publication:', error);
      }
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/publications/edit/${id}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {t('admin.publications.title')}
            </h1>
            <Link
              to="/admin/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6A0DAD] hover:bg-[#5a0b91]"
            >
              {t('admin.publications.create')}
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Rechercher une publication..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="sm:w-48">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
              >
                <option value="all">Toutes les publications</option>
                <option value="active">Publications actives</option>
                <option value="expired">Publications expirées</option>
                {user?.role === 'admin' && (
                  <option value="pending">Mes publications en attente</option>
                )}
              </select>
            </div>
          </div>
        </div>

        {filteredPublications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {searchTerm 
              ? "Aucune publication ne correspond à votre recherche"
              : t('admin.publications.noPublications')}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPublications.map((publication) => (
              <div key={publication.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">
                        {new Date(publication.createdAt).toLocaleDateString('fr-BE')}
                      </span>
                      {publication.status === 'pending' && (
                        <span className="ml-2 px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          En attente
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {publication.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {publication.content}
                    </p>
                    <div className="flex items-center space-x-4">
                      <Link
                        to={`/news/${publication.id}`}
                        className="inline-flex items-center text-[#6A0DAD] hover:text-[#5a0b91]"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Voir
                      </Link>
                      <button
                        onClick={() => handleEdit(publication.id)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        {t('admin.publications.edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(publication.id)}
                        className="inline-flex items-center text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        {t('admin.publications.delete')}
                      </button>
                    </div>
                  </div>
                  {publication.imageUrl && (
                    <img
                      src={publication.imageUrl}
                      alt={publication.title}
                      className="w-32 h-32 object-cover rounded-lg ml-4"
                    />
                  )}
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span>Valide du {new Date(publication.validFrom).toLocaleDateString('fr-BE')}</span>
                  <span className="mx-2">au</span>
                  <span>{new Date(publication.validTo).toLocaleDateString('fr-BE')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}