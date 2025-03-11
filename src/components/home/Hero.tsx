import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LazyImage } from '../../utils/lazyLoad';

const stats = [
  { number: '25+', label: 'Années d\'expérience' },
  { number: '50M+', label: 'Voyageurs servis' },
  { number: '100+', label: 'Partenaires' },
  { number: '3', label: 'Aéroports majeurs' }
];

const features = [
  {
    title: 'Courageux',
    description: 'Offrir une expérience exceptionnelle aux voyageurs du monde entier',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
    link: '/innovation'
  },
  {
    title: 'Passionné',
    description: 'Nous rendons chaque voyage aussi gratifiant que la destination',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
    link: '/sustainability'
  },
  {
    title: 'Collaboratif',
    description: 'Des voyages réinventés selon vos conditions.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
    link: '/excellence'
  },
  {
    title: 'Inclusif',
    description: 'Élargir les limites de l\'expérience de voyage',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
    link: '/excellence'
  }
];

export default function Hero() {
  return (
    <div className="relative bg-night min-h-screen">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <LazyImage
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05"
          alt="Airport Background"
          className="w-full h-full"
          aspectRatio="16/9"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-night via-night/80 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-1 bg-primary/10 backdrop-blur-sm rounded-full text-primary text-sm font-medium mb-6">
              Leader en solutions aéroportuaires
            </span>
            <h1 className="style-audacieux text-day leading-tight mb-6">
              Bienvenue à <span className="text-primary">Avolta By Autogrill</span>
            </h1>
            <p className="text-lg text-day/80 mb-8 max-w-lg">
              Nous existons pour rendre les voyageurs plus heureux en maximisant chaque instant de leur voyage.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-day font-medium rounded-full transition-colors"
              >
                Contactez-nous
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center px-6 py-3 bg-day/10 hover:bg-day/20 text-day font-medium rounded-full backdrop-blur-sm transition-colors"
              >
                En savoir plus
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-day/5 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-transform"
              >
                <div className="text-4xl font-display font-semibold text-primary mb-2">{stat.number}</div>
                <div className="text-day/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
            >
              <LazyImage
                src={feature.image}
                alt={feature.title}
                className="absolute inset-0 w-full h-full"
                aspectRatio="4/3"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night via-night/50 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-display font-semibold text-day mb-2">{feature.title}</h3>
                  <p className="text-day/80 mb-4">{feature.description}</p>
                  <div className="flex items-center text-primary">
                    <span className="text-sm font-medium">Découvrir</span>
                    <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}