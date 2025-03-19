import React from 'react';
import { Mail, Linkedin } from 'lucide-react';

// Importation dynamique des images
import jouyImage from '/src/images/jouy.jpg';
import stevenImage from '/src/images/Steven.jpg';
import wendyImage from '/src/images/Wendy.jpg';
import pepijnImage from '/src/images/Pepijn.jpg';
import magalieImage from '/src/images/Magalie.jpg';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  email: string;
  imageUrl: string;
  linkedinUrl?: string;
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Thibault JOUY',
    position: 'Directeur Général',
    email: 'thibault.jouy@avolta.be',
    imageUrl: jouyImage,
    linkedinUrl: '#' // Ajouter l'URL LinkedIn réelle
  },
  {
    id: '2',
    name: 'Steven CORNEILLIE',
    position: 'Directeur Marketing',
    email: 'steven.corneillie@autogrill.net',
    imageUrl: stevenImage,
    linkedinUrl: '#'
  },
  {
    id: '3',
    name: 'Wendy SWINNEN',
    position: 'Responsable Production',
    email: 'wendy.swinnen@avolta.be',
    imageUrl: wendyImage,
    linkedinUrl: '#'
  },
  {
    id: '4',
    name: 'Pepijn VERTOGHEN',
    position: 'Responsable Développement',
    email: 'pepijn.vertoghen@avolta.be',
    imageUrl: pepijnImage,
    linkedinUrl: '#'
  },
  {
    id: '5',
    name: 'Magalie VERTOGHEN',
    position: 'Responsable Communication',
    email: 'magalie@avolta.be',
    imageUrl: magalieImage,
    linkedinUrl: '#'
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
            Une équipe passionnée qui façonne l'avenir de Avolta et de l'Aeroport de Bruxelles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {teamMembers.map((member) => (
            <div 
              key={member.id} 
              className="group relative overflow-hidden rounded-2xl bg-sand shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-w-3 aspect-h-4 overflow-hidden">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'src/images/LOGO_AVOLTA_FL_CORE_RGB.jpg'; // Chemin vers une image de remplacement
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="absolute bottom-1 left-0 right-0 p-6 translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-bold text-day mb-2">{member.name}</h3>
                <p className="text-primary font-medium mb-1">{member.position}</p>
                
                <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  
                  <a
                    href={`mailto:${member.email}`}
                    className="p-2 bg-day/10 backdrop-blur-sm rounded-full hover:bg-day/20 transition-colors"
                    aria-label={`Envoyer un email à ${member.name}`}
                  >
                    <Mail className="w-5 h-5 text-day" />
                  </a>
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-day/10 backdrop-blur-sm rounded-full hover:bg-day/20 transition-colors"
                      aria-label={`Profil LinkedIn de ${member.name}`}
                    >
                      <Linkedin className="w-5 h-5 text-day" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}