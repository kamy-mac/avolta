import React, { useState, useEffect } from 'react';
import { Mail, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const teamMembers = [
  {
    id: '1',
    name: 'JOUY Thibault',
    position: 'Directeur Général',
    email: 'thibault.jouy@avolta.be',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
  },
  {
    id: '2',
    name: 'Eddy GRYMONPREZ',
    position: 'Directeur Commercial',
    email: 'eddy.grymonprez@avolta.be',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
  },
  {
    id: '3',
    name: 'Wendy SWINNEN',
    position: 'Directrice Marketing',
    email: 'wendy.swinnen@avolta.be',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2'
  },
  {
    id: '4',
    name: 'PEPIJN Vertoghen',
    position: 'Directeur Technique',
    email: 'pepijn.vertoghen@avolta.be',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7'
  }
];

export default function TeamSection() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('team-section');
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
    <section id="team-section" className="py-24 bg-day">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-1 bg-primary rounded-full" />
            </div>
            <h2 className="style-audacieux text-night mb-4">{t('team.title')}</h2>
            <p className="text-night/60 max-w-2xl mx-auto font-sans">
              Notre équipe de direction passionnée travaille sans relâche pour façonner l'avenir de l'aviation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className={`transform transition-all duration-1000 delay-${index * 200} ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="group relative overflow-hidden rounded-2xl bg-sand">
                  <div className="aspect-w-4 aspect-h-5">
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-night/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-display font-semibold text-day mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-4">{t(`team.positions.${member.position}`)}</p>
                    
                    <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a
                        href={`mailto:${member.email}`}
                        className="p-2 bg-day/10 backdrop-blur-sm rounded-full hover:bg-day/20 transition-colors"
                      >
                        <Mail className="w-5 h-5 text-day" />
                      </a>
                      <a
                        href="#"
                        className="p-2 bg-day/10 backdrop-blur-sm rounded-full hover:bg-day/20 transition-colors"
                      >
                        <Linkedin className="w-5 h-5 text-day" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}