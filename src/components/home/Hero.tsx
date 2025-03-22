import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronRight, ArrowUpRight, Star, ShieldCheck, Zap, Globe, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LazyImage } from '../../utils/lazyLoad';

// Données statistiques améliorées
const stats = [
  { 
    number: '25+', 
    label: 'Années d\'expérience', 
    icon: <Star className="w-5 h-5 text-primary" />,
    detail: 'De tradition et d\'excellence'
  },
  { 
    number: '50M+', 
    label: 'Voyageurs servis', 
    icon: <Globe className="w-5 h-5 text-primary" />,
    detail: 'De satisfaction client'
  },
  { 
    number: '100+', 
    label: 'Partenaires premium', 
    icon: <ShieldCheck className="w-5 h-5 text-primary" />,
    detail: 'À travers le monde'
  },
  { 
    number: '3', 
    label: 'Aéroports majeurs', 
    icon: <Zap className="w-5 h-5 text-primary" />,
    detail: 'Présence internationale'
  }
];

// Valeurs améliorées
const features = [
  {
    title: 'Courageux',
    description: 'Nous repoussons les limites pour offrir une expérience exceptionnelle aux voyageurs du monde entier',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
    link: '/innovation',
    color: 'from-amber-600/90 to-amber-700/30'
  },
  {
    title: 'Passionné',
    description: 'Nous transformons chaque voyage en une aventure aussi enrichissante que la destination elle-même',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
    link: '/sustainability',
    color: 'from-emerald-600/90 to-emerald-700/30'
  },
  {
    title: 'Collaboratif',
    description: 'Ensemble, nous réinventons l\'expérience de voyage selon vos besoins et aspirations',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
    link: '/excellence',
    color: 'from-sky-600/90 to-sky-700/30'
  },
  {
    title: 'Inclusif',
    description: 'Nous élargissons les horizons de l\'expérience de voyage pour accueillir chaque voyageur',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
    link: '/diversity',
    color: 'from-violet-600/90 to-violet-700/30'
  }
];

// Images de fond optimisées avec des chemins corrects pour les images locales
const backgroundImages = [
  '/src/images/com.intrepia.luma.png',
  '/src/images/com.intrepia.luma (2).png',
  'https://images.unsplash.com/photo-1583653317848-d4e6be6c848c?q=80&auto=format&fit=crop&w=1920&h=1080',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&auto=format&fit=crop&w=1920&h=1080'
];

export default function Hero() {
  const [activeBackground, setActiveBackground] = useState(0);
  const [isVisible, setIsVisible] = useState([false, false, false]);
  const [playVideo, setPlayVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Effet pour animer l'apparition des éléments avec un timing plus sophistiqué
  useEffect(() => {
    const timer1 = setTimeout(() => setIsVisible([true, false, false]), 400);
    const timer2 = setTimeout(() => setIsVisible([true, true, false]), 900);
    const timer3 = setTimeout(() => setIsVisible([true, true, true]), 1400);
    
    // Rotation des images de fond
    const backgroundInterval = setInterval(() => {
      setActiveBackground((current) => (current + 1) % backgroundImages.length);
    }, 8000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearInterval(backgroundInterval);
    };
  }, []);

  const handlePlayVideo = () => {
    setPlayVideo(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div className="relative bg-night min-h-screen overflow-hidden">
      {/* Overlay de grain pour texture premium */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none z-10"></div>
      
      {/* Images de fond avec transition fluide et filtres premium */}
      <div className="absolute inset-0 overflow-hidden">
        {backgroundImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === activeBackground ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <LazyImage
              src={img}
              alt={`Background ${index + 1}`}
              className="w-full h-full object-cover filter contrast-[1.05] saturate-[1.15] brightness-[2.5]"
              aspectRatio="16/9"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-night/95 via-night/80 to-night/40" />
          </div>
        ))}
      </div>

      {/* Éléments décoratifs en verre et néon */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[100px] opacity-70 animate-pulse-slow" />
      <div className="absolute bottom-1/3 left-10 w-64 h-64 bg-primary/10 rounded-full blur-[80px] opacity-70" />
      <div className="absolute top-2/3 right-1/4 w-48 h-48 bg-primary/15 rounded-full blur-[60px] opacity-50" />
      
      {/* Lignes décoratives */}
      <div className="absolute top-0 left-[10%] w-px h-48 bg-gradient-to-b from-transparent via-primary/40 to-transparent opacity-70"></div>
      <div className="absolute top-1/3 right-[15%] w-px h-64 bg-gradient-to-b from-transparent via-primary/40 to-transparent opacity-70"></div>

      {/* Hero Content avec marge top augmentée */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Section texte principale - prise 7 colonnes sur grand écran */}
          <div className={`lg:col-span-7 transform transition-all duration-1000 ease-out ${
            isVisible[0] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="inline-flex items-center px-4 py-1.5 bg-primary/10 backdrop-blur-md rounded-full text-primary text-sm font-medium mb-6 border border-primary/20">
              <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
              Leader en solutions aéroportuaires premium
            </div>
            
            <h1 className="style-audacieux text-day text-5xl sm:text-6xl xl:text-7xl leading-tight mb-8 tracking-tight">
              Bienvenue à <br />
              <span className="text-primary relative">
                Avolta By Autogrill
                <span className="absolute -bottom-3 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-primary/0 rounded-full"></span>
              </span>
            </h1>
            
            <p className="text-xl text-day/90 mb-10 max-w-xl leading-relaxed font-light">
              Nous créons des expériences de voyage inoubliables en transformant chaque moment d'attente en une opportunité d'évasion et de découverte.
            </p>
            
            <div className="flex flex-wrap gap-5 items-center">
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary-dark text-day font-medium rounded-full transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 group"
              >
                <span>Contactez-nous</span>
                <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/about"
                className="inline-flex items-center px-8 py-4 bg-day/5 hover:bg-day/15 text-day font-medium rounded-full backdrop-blur-md transition-all duration-300 border border-day/20 hover:border-day/30 group"
              >
                <span>En savoir plus</span>
                <ChevronRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button
                onClick={handlePlayVideo}
                className="inline-flex items-center text-day/90 hover:text-primary transition-colors group ml-1"
              >
                <span className="w-12 h-12 flex items-center justify-center rounded-full border border-day/30 group-hover:border-primary mr-3 transition-colors">
                  <Play className="w-5 h-5 fill-current" />
                </span>
                <span className="text-sm">Voir la vidéo</span>
              </button>
            </div>
            
            {/* Modal vidéo */}
            {playVideo && (
              <div className="fixed inset-0 bg-night/95 z-50 flex items-center justify-center p-4">
                <div className="relative w-full max-w-4xl">
                  <button 
                    onClick={() => setPlayVideo(false)}
                    className="absolute -top-12 right-0 text-day hover:text-primary"
                  >
                    Fermer ×
                  </button>
                  <video
                    ref={videoRef}
                    className="w-full rounded-xl shadow-2xl"
                    controls
                    autoPlay
                  >
                    <source src="/path-to-your-video.mp4" type="video/mp4" />
                    Votre navigateur ne prend pas en charge la lecture vidéo.
                  </video>
                </div>
              </div>
            )}
          </div>

          {/* Stats avec animation - prend 5 colonnes */}
          <div className={`lg:col-span-5 grid grid-cols-2 gap-5 transform transition-all duration-1000 ease-out ${
            isVisible[1] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {stats.map((stat, index) => (
              <div
                key={index}
                className="relative bg-day/5 backdrop-blur-md rounded-2xl p-6 border border-day/10 transform hover:scale-105 transition-all duration-300 hover:bg-day/8 hover:border-day/20 group overflow-hidden"
              >
                {/* Cercle décoratif */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors shadow-inner">
                    {stat.icon}
                  </div>
                </div>
                
                <div className="text-4xl font-display font-semibold text-primary mb-1">
                  {stat.number}
                </div>
                
                <div className="text-day font-medium mb-1">{stat.label}</div>
                
                <div className="text-sm text-day/60 group-hover:text-day/80 transition-colors">
                  {stat.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid avec animation et carte premium */}
      <div className={`relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 transform transition-all duration-1000 ease-out ${
        isVisible[2] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="group relative overflow-hidden rounded-2xl aspect-square sm:aspect-[3/4] hover:shadow-2xl transition-all duration-500 border border-day/5"
            >
              <LazyImage
                src={feature.image}
                alt={feature.title}
                className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 filter contrast-110 saturate-110 brightness-90 scale-105 group-hover:scale-110"
                aspectRatio="3/4"
              />
              
              {/* Overlay de couleur personnalisée par carte */}
              <div className={`absolute inset-0 bg-gradient-to-t ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              {/* Overlay standard */}
              <div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-transparent group-hover:opacity-0 transition-opacity duration-500"></div>
              
              <div className="absolute inset-0 flex flex-col justify-end p-7">
                <div className="transform transition-all duration-500 group-hover:translate-y-0">
                  <h3 className="text-2xl font-display font-semibold text-day mb-3 relative inline-block">
                    {feature.title}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-day group-hover:w-full transition-all duration-500"></span>
                  </h3>
                  
                  <p className="text-day/90 mb-5 opacity-90 transition-all duration-500 max-h-0 overflow-hidden group-hover:max-h-40">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center text-primary group-hover:text-day transition-colors duration-300 opacity-0 group-hover:opacity-100">
                    <span className="text-sm font-medium mr-2">Découvrir</span>
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Éléments décoratifs de premier plan */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
    </div>
  );
}