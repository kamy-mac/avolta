import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getPublishedPublications } from '../lib/storage';
import NewsCard from '../components/news/NewsCard';
import { Post } from '../types';
import { Calendar, AlertCircle, Filter } from 'lucide-react';

export default function NewsPage() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeCategory, setActiveCategory] = useState<'news' | 'events'>('news');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPublishedPublications();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => post.category === activeCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-lg h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            {activeCategory === 'news' ? 'Actualités' : 'Événements'}
          </h1>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Publications actives au {new Date().toLocaleDateString('fr-BE')}</span>
          </div>
        </div>

        <div className="mb-8 flex space-x-4">
          <button
            onClick={() => setActiveCategory('news')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'news'
                ? 'bg-[#6A0DAD] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Actualités
          </button>
          <button
            onClick={() => setActiveCategory('events')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'events'
                ? 'bg-[#6A0DAD] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Événements
          </button>
        </div>
        
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune {activeCategory === 'news' ? 'actualité' : 'événement'} disponible
            </h2>
            <p className="text-gray-600">
              Il n'y a actuellement aucune publication dans cette catégorie. Revenez plus tard pour découvrir nos {activeCategory === 'news' ? 'actualités' : 'événements'}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}