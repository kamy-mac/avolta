import  { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Liste des marques/logos 
const brands = [
  {
    name: 'Java Coffee',
    logo: 'http://jobs.autogrill.be/sites/jobs.autogrill.be/files/styles/logo_thumbnail/public/javakeyline_cmyk.jpg?itok=M7Og7wfX',
    alt: 'Java Coffee Brussels Airport'
  },
  {
    name: 'Starbucks',
    logo: 'https://s.yimg.com/fz/api/res/1.2/vSzBUgjEuxzcf57I4S_rAA--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTEyMDtxPTgwO3c9MTE5/https://s.yimg.com/zb/imgv1/54ed3502-992d-3841-a701-b66bc76f9ae7/t_500x300',
    alt: 'Starbucks at Brussels Airport'
  },
  {
    name: 'Autogrill',
    logo: 'https://www.autogrill.com/themes/autogrill_theme/images/logo_2.jpg',
    alt: 'Autogrill Brussels Airport'
  },
  {
    name: 'Pain Quotidien',
    logo: 'https://tse1.mm.bing.net/th?id=OIP.JN3vgBaj5NfzJ-hG1SK-WAHaHa&pid=Api&P=0&h=180',
    alt: 'Pain Quotidien Italian Food'
  },
  {
    name: 'Quick',
    logo: 'http://jobs.autogrill.be/sites/jobs.autogrill.be/files/styles/logo_thumbnail/public/quick.jpg?itok=h7CPaqE5',
    alt: 'Quick Brussels Airport'
  },
  {
    name: 'Belle&Belle',
    logo: 'http://jobs.autogrill.be/sites/jobs.autogrill.be/files/styles/logo_thumbnail/public/belle_and_belge.jpg?itok=312hCtxw1-a701-b66bc76f9ae7/t_500x300',
    alt: 'Belle&Belle at Brussels Airport'
  },
  {
    name: 'Amo',
    logo: 'http://jobs.autogrill.be/sites/jobs.autogrill.be/files/styles/logo_thumbnail/public/brands/4ee1e82b-5f40-4f37-b16a-3298b03ea08a.jpg?itok=G30qhkZ2',
    alt: ' Amo Brussels Airport'
  },
  {
    name: 'Hi Brussels',
    logo: 'http://jobs.autogrill.be/sites/jobs.autogrill.be/files/styles/logo_thumbnail/public/brands/568e3f80-fd78-4216-8544-3103b03ea08a.jpg?itok=dLGwfe31',
    alt: 'HI Brussels Italian Food'
  },
  {
    name: 'Burger King',
    logo: 'https://tse4.mm.bing.net/th?id=OIP.sALR_WfsFv1WwmggILsLeQHaHe&pid=Api&P=0&h=180',
    alt: 'Burger King at Brussels Airport'
  },
  {
    name: 'Panos',
    logo: 'http://jobs.autogrill.be/sites/jobs.autogrill.be/files/styles/logo_thumbnail/public/panos.jpg?itok=Ffh--epW',
    alt: 'Panos at Brussels Airport'
  },
  {
    name: 'Exkki',
    logo: 'http://jobs.autogrill.be/sites/jobs.autogrill.be/files/styles/logo_thumbnail/public/brands/56dfd764-39c0-4a72-9cd4-31dab03ea08a.jpg?itok=j-scmREd',
    alt: 'Exkki at Brussels Airport'
  },
  {
    name: 'Belgorama',
    logo: 'http://jobs.autogrill.be/sites/jobs.autogrill.be/files/styles/logo_thumbnail/public/brands/54cb8e21-9084-472f-ad1d-6915b03ea08a.jpg?itok=6guP3Y2Q',
    alt: 'Belgorama at Brussels Airport'
  },
  {
    name: 'Grab and Fly',
    logo: 'http://jobs.autogrill.be/sites/jobs.autogrill.be/files/styles/logo_thumbnail/public/grabandfly.jpg?itok=DUqXI-GC',
    alt: 'Grab and Fly at Brussels Airport'
  }
];

const BrandCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const scrollCarousel = useCallback((direction: 'next' | 'prev') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth;
      carouselRef.current.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  // Automatic scrolling effect
  useEffect(() => {
    if (isPaused) return;

    const intervalId = setInterval(() => {
      scrollCarousel('next');
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(intervalId);
  }, [scrollCarousel, isPaused]);

  // Scroll tracking
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollPosition = carousel.scrollLeft;
      const itemWidth = carousel.children[0].clientWidth;
      const newIndex = Math.round(scrollPosition / itemWidth);
      setCurrentIndex(newIndex);
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      className="pb-4 pt-0 bg-gradient-to-br from-[#F5F3ED] to-[#F5F3ED]/70"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <div className="w-12 h-1 bg-[#8F53F0] rounded-full mr-4" aria-hidden="true" />
          <h2 className="text-3xl font-display font-semibold text-primary">
            Nos partenaires
          </h2>
        </div>

        <div className="relative group">
          {/* Bouton précédent */}
          <button
            onClick={() => scrollCarousel('prev')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
              bg-white shadow-lg rounded-full p-3 
              opacity-0 group-hover:opacity-100 transition-all duration-300
              hover:bg-[#8F53F0]/10 
              disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentIndex === 0}
            aria-label="Voir les marques précédentes"
          >
            <ChevronLeft className="h-6 w-6 text-[#8F53F0]" />
          </button>

          {/* Carrousel de marques */}
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto scrollbar-hide space-x-6 
              pb-5 pt-0 px-2 scroll-smooth"
            style={{ 
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {brands.map((brand) => (
              <div 
                key={brand.name}
                className="flex-shrink-0 w-36 h-36 flex items-center justify-center 
                  bg-white rounded-xl shadow-md p-4 
                  transition-all duration-300 
                  hover:shadow-xl hover:scale-105"
                style={{ scrollSnapAlign: 'center' }}
              >
                <img 
                  src={brand.logo} 
                  alt={brand.alt} 
                  className="max-w-full max-h-full transition-all duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Bouton suivant */}
          <button
            onClick={() => scrollCarousel('next')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
              bg-white shadow-lg rounded-full p-3 
              opacity-0 group-hover:opacity-100 transition-all duration-300
              hover:bg-[#8F53F0]/10
              disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentIndex >= brands.length - 3}
            aria-label="Voir les marques suivantes"
          >
            <ChevronRight className="h-6 w-6 text-[#8F53F0]" />
          </button>
        </div>

        {/* Indicateur de progression */}
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            {brands.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all duration-300 
                  ${index === currentIndex 
                    ? 'bg-[#8F53F0] w-8' 
                    : 'bg-gray-300 w-2 hover:bg-[#8F53F0]/50'}`}
                onClick={() => {
                  if (carouselRef.current) {
                    const itemWidth = carouselRef.current.children[0].clientWidth;
                    carouselRef.current.scrollTo({
                      left: index * itemWidth,
                      behavior: 'smooth'
                    });
                  }
                }}
                aria-label={`Aller à la marque ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandCarousel;