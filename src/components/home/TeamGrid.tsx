import React from 'react';
import { Mail, Linkedin } from 'lucide-react';

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

export default function TeamGrid() {
  return (
    <section className="py-24 bg-day">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-1 bg-primary rounded-full" />
          </div>
          <h2 className="text-4xl font-bold text-night mb-4">Notre Équipe de Direction</h2>
          <p className="text-night/60 max-w-2xl mx-auto">
            Une équipe passionnée qui façonne l'avenir de l'aviation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="group relative overflow-hidden rounded-2xl bg-sand">
              <div className="aspect-w-3 aspect-h-4">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-bold text-day mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-4">{member.position}</p>
                
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
          ))}
        </div>
      </div>
    </section>
  );
}