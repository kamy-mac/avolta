import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Info } from 'lucide-react';

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Observer pour l'animation à l'entrée
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoContainerRef.current) {
      if (!document.fullscreenElement) {
        videoContainerRef.current.requestFullscreen().catch(err => {
          console.error(`Erreur lors de la tentative de passage en plein écran: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  // Mettre à jour l'état du plein écran
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-10 lg:py-10 bg-gradient-to-b from-sand to-white relative overflow-hidden"
    >
      {/* Éléments décoratifs */}
      <div className="absolute top-0 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-primary/30 rounded-full blur-sm"></div>
      <div className="absolute bottom-1/4 left-1/3 w-6 h-6 bg-primary/20 rounded-full blur-sm"></div>
      
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div 
          className={`text-center mb-16 transition-all duration-1000 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center justify-center px-12 py-2 mb-6 bg-primary/10 rounded-full">
            <span className="text-primary font-medium text-sm">Notre vision</span>
          </div>
          <div></div>
          <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold text-night mb-8 relative inline-block">
            Découvrez Avolta Belgique
            <div className="absolute -bottom-5 right-1 transform -translate-x-1 w-60 h-1 bg-primary rounded-full"></div>
          </h2>
          
          <p className="text-night/60 max-w-3xl mx-auto text-lg mt-3">
            Plongez dans l'univers d'Avolta et découvrez comment nous façonnons l'avenir 
            des aéroports avec des solutions innovantes et une expertise inégalée.
          </p>
        </div>

        {/* Container pour la vidéo en pleine largeur */}
        <div 
          className={`w-full transition-all duration-1000 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          } transition-delay-200`}
        >
          <div 
            ref={videoContainerRef}
            className="relative aspect-video rounded-3xl overflow-hidden shadow-xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            
            {/* Vidéo */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover rounded-2xl"
              autoPlay
              muted={isMuted}
              loop
              playsInline
              webkit-playsinline="true"
              onCanPlay={(e) => {
                const video = e.target as HTMLVideoElement;
                video.muted = true;
              }}
            >
              <source src="https://www.avoltaworld.com/sites/default/files/2023-10/Hero-video-with-centred-text_compressed.mp4" type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
            
            {/* Léger overlay pour améliorer la visibilité des contrôles */}
            <div className="absolute inset-0 bg-gradient-to-t from-night/50 via-night/20 to-transparent pointer-events-none"></div>
            
            {/* Contrôles vidéo */}
            <div 
              className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-between bg-night/40 backdrop-blur-md rounded-full px-6 py-3 transition-all duration-500 w-auto min-w-[280px] sm:min-w-[340px] ${
                isHovered || !isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <button 
                onClick={togglePlay}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-primary transition-colors text-white"
                aria-label={isPlaying ? "Mettre en pause" : "Lire"}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              
              <div className="hidden sm:block text-white text-sm font-medium mx-3">
                Avolta Belgique
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleMute}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-primary transition-colors text-white"
                  aria-label={isMuted ? "Activer le son" : "Couper le son"}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={toggleFullscreen}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-primary transition-colors text-white"
                  aria-label="Plein écran"
                >
                  <Maximize className="w-5 h-5" />
                </button>
                
                <button
                  className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full bg-white/10 hover:bg-primary transition-colors text-white"
                  aria-label="Informations"
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Badge de qualité */}
            <div className="absolute top-6 right-6 px-4 py-2 bg-night/40 backdrop-blur-md rounded-full text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              HD
            </div>
          </div>
        
          {/* Crédits vidéo */}
          <div className="text-center mt-4 text-night/40 text-sm">
            © 2023 Avolta World - Tous droits réservés
          </div>
        </div>
        
      </div>
      
      {/* Vague décorative au fond */}
      <div className="absolute -bottom-1 left-0 right-0 h-32 overflow-hidden">
        <svg viewBox="0 0 1440 320" className="w-full h-full text-white absolute bottom-0" preserveAspectRatio="none">
          <path 
            fill="currentColor" 
            fillOpacity="1" 
            d="M0,288L40,267,1056,245,1152,208C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
          </path>
        </svg>
      </div>
    </section>
  );
}