import React, { useEffect, useState } from 'react';
import { getPublishedPublications } from '../../lib/storage';
import { Post } from '../../types';
import NewsCard from '../news/NewsCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NewsSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      const data = await getPublishedPublications();
      const newsOnly = data
        .filter(post => post.category === 'news')
        .slice(0, 3);
      setPosts(newsOnly);
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

  return (
    <section id="news-section" className="py-24 bg-sand relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="flex justify-between items-center mb-12">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-1 bg-primary rounded-full mr-4" />
                <span className="text-primary font-medium">Actualités</span>
              </div>
              <h2 className="style-raffine text-night">Restez informé</h2>
            </div>
            <Link
              to="/news"
              className="group flex items-center px-6 py-3 bg-night text-day rounded-full hover:bg-night/90 transition-colors"
            >
              <span className="mr-2">Toutes les actualités</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className={`transform transition-all duration-1000 delay-${index * 200} ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <NewsCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}