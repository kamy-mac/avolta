import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

import publicationService from '../../services/publication.service';
import { Post } from '../../types';
import NewsCard from '../news/NewsCard';

export default function NewsSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        // Fetch active publications and filter for news category
        const fetchedPosts = await publicationService.getActivePublicationsByCategory('news');
        
        // Limit to 3 posts
        const newsOnly = fetchedPosts.slice(0, 6);
        setPosts(newsOnly);
      } catch (err) {
        console.error('Error fetching news publications:', err);
        setError('Failed to load news. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('news-section');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const handleNewsClick = () => {
    // Redirect to news page (simulated)
    window.location.href = "/news";
  };

  return (
    <section id="news-section" className="py-24 bg-gradient-to-br from-sand to-sand/80 relative overflow-hidden">
  {/* Éléments décoratifs améliorés */}
  <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2" />
  
  <div className="absolute bottom-40 left-20 w-48 h-48 bg-primary/10 rounded-full blur-xl" />
  <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-primary/15 rounded-full blur-lg" />
  
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className={`transform transition-all duration-1000 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
    }`}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
        <div>
          <div className="flex items-center mb-4">
            <div className="w-12 h-1 bg-primary rounded-full mr-4" />
            <span className="text-primary font-medium uppercase tracking-wider text-sm">Actualités</span>
          </div>
          <h2 className="style-raffine text-night text-3xl md:text-4xl font-bold">Restez informé</h2>
          <p className="text-night/70 mt-3 max-w-xl">Découvrez les dernières actualités et tendances du secteur</p>
        </div>
        <button
          onClick={handleNewsClick}
          className="group flex items-center px-6 py-3 bg-night text-day rounded-full hover:bg-primary transition-all duration-300 shadow-md hover:shadow-lg self-start md:self-auto"
        >
          <span className="mr-2">Toutes les actualités</span>
          <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((_, index) => (
            <div 
              key={index}
              className="bg-white shadow-md rounded-xl overflow-hidden"
            >
              <div className="bg-gray-200 animate-pulse h-48 w-full"></div>
              <div className="p-6">
                <div className="h-4 w-1/3 bg-gray-200 animate-pulse mb-4 rounded"></div>
                <div className="h-6 bg-gray-200 animate-pulse mb-4 rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse mb-2 rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse mb-4 w-3/4 rounded"></div>
                <div className="h-5 w-1/4 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-700 p-8 rounded-xl text-center max-w-lg mx-auto">
          <div className="font-semibold mb-2">Une erreur est survenue</div>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-700"
          >
            Réessayer
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-blue-50 border border-blue-100 text-blue-700 p-8 rounded-xl text-center max-w-lg mx-auto">
          <div className="font-semibold mb-2">Information</div>
          <p>Aucune actualité disponible pour le moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <div
              key={post.id}
              style={{ transitionDelay: `${index * 150}ms` }}
              className={`transform transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden group">
                <NewsCard post={post} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    
  </div>
</section>
  );
}