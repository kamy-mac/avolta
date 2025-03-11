import React from 'react';
import { Calendar, Heart, MessageCircle, Share2, Tag, User, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Post } from '../../types';
import { LazyImage } from '../../utils/lazyLoad';

interface NewsCardProps {
  post: Post;
}

export default function NewsCard({ post }: NewsCardProps) {
  return (
    <Link 
      to={`/news/${post.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative">
        <LazyImage
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-48"
          aspectRatio="16/9"
        />
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-[#6A0DAD] shadow">
            <Tag className="w-4 h-4 mr-1" />
            {post.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4 mr-1" />
          {new Date(post.createdAt).toLocaleDateString('fr-BE')}
        </div>
        
        <h3 className="text-xl font-display font-semibold mb-3 text-gray-900 line-clamp-2 hover:text-[#6A0DAD] transition-colors">
          {post.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2 font-sans">{post.content}</p>
        
        <div className="flex items-center justify-between text-gray-500 pt-4 border-t">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm">
              <User className="w-4 h-4 mr-1" />
              {post.authorName}
            </div>
            <div className="flex items-center text-sm">
              <Mail className="w-4 h-4 mr-1" />
              {post.authorEmail}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center hover:text-[#6A0DAD] transition-colors">
              <Heart className="w-5 h-5 mr-1" />
              {post.likes}
            </div>
            <div className="flex items-center hover:text-[#6A0DAD] transition-colors">
              <MessageCircle className="w-5 h-5 mr-1" />
              {post.comments.length}
            </div>
            <div className="flex items-center hover:text-[#6A0DAD] transition-colors">
              <Share2 className="w-5 h-5 mr-1" />
              Partager
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}