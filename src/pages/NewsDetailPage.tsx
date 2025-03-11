import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Heart, 
  MessageCircle, 
  Share2, 
  Send, 
  Tag,
  User,
  Mail,
  Clock,
  Eye
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Post, Comment } from '../types';
import { getPublications, addComment, likePublication } from '../lib/storage';

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const posts = await getPublications();
        const foundPost = posts.find(p => p.id === id);
        if (foundPost) {
          setPost(foundPost);
        } else {
          navigate('/news');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleLike = async () => {
    if (!post || isLiked) return;
    try {
      await likePublication(post.id);
      setPost(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
      setIsLiked(true);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !comment.trim()) return;
    try {
      const newComment = await addComment(post.id, comment);
      setPost(prev => prev ? {
        ...prev,
        comments: [...prev.comments, newComment]
      } : null);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.content,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Lien copié dans le presse-papier !'))
        .catch(console.error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6A0DAD]"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Publication non trouvée</h2>
          <button
            onClick={() => navigate('/news')}
            className="text-[#6A0DAD] hover:underline"
          >
            Retourner aux actualités
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-[#6A0DAD] mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Retour
        </button>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-96">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Category Badge */}
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-[#6A0DAD] shadow">
                <Tag className="w-4 h-4 mr-1" />
                {post.category}
              </span>
            </div>
          </div>
          
          <div className="p-8">
            {/* Author Info */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#6A0DAD] rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{post.authorName}</h3>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Mail className="w-4 h-4 mr-1" />
                    {post.authorEmail}
                  </div>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(post.createdAt).toLocaleDateString('fr-BE')}
              </div>
            </div>

            {/* Title and Content */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>
            
            <div className="prose max-w-none mb-8 text-gray-700 leading-relaxed">
              {post.content}
            </div>

            {/* Publication Dates */}
            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-8">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>Valide du {new Date(post.validFrom).toLocaleDateString('fr-BE')}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>au {new Date(post.validTo).toLocaleDateString('fr-BE')}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span>Publication {post.status === 'published' ? 'publiée' : 'en attente'}</span>
              </div>
            </div>

            {/* Interaction Buttons */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <button 
                onClick={handleLike}
                className={`flex items-center px-4 py-2 rounded-full transition-colors ${
                  isLiked 
                    ? 'text-[#6A0DAD] bg-purple-50' 
                    : 'text-gray-500 hover:text-[#6A0DAD] hover:bg-purple-50'
                }`}
              >
                <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center px-4 py-2 rounded-full text-gray-500 hover:text-[#6A0DAD] hover:bg-purple-50 transition-colors">
                <MessageCircle className="w-5 h-5 mr-2" />
                <span>{post.comments.length}</span>
              </button>
              <button 
                onClick={handleShare}
                className="flex items-center px-4 py-2 rounded-full text-gray-500 hover:text-[#6A0DAD] hover:bg-purple-50 transition-colors"
              >
                <Share2 className="w-5 h-5 mr-2" />
                {t('news.share')}
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-gray-50 px-8 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Commentaires ({post.comments.length})
            </h2>
            
            <form onSubmit={handleComment} className="mb-8">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-[#6A0DAD] focus:ring focus:ring-[#6A0DAD] focus:ring-opacity-50"
                />
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#6A0DAD] hover:bg-[#5a0b91] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A0DAD] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Commenter
                </button>
              </div>
            </form>

            <div className="space-y-6">
              {post.comments.map((comment: Comment) => (
                <div key={comment.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-[#6A0DAD] rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">{comment.author}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('fr-BE')}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}

              {post.comments.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Aucun commentaire pour le moment. Soyez le premier à commenter !
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}