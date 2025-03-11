import React from 'react';
import { Mail } from 'lucide-react';
import NewsletterForm from './NewsletterForm';

export default function NewsletterSection() {
  return (
    <section className="py-24 bg-sand relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-1 bg-primary rounded-full mr-4" />
                <span className="text-primary font-medium">Newsletter</span>
              </div>
              
              <h2 className="style-audacieux text-night mb-6">
                Restez connecté avec Avolta
              </h2>
              
              <p className="text-night/70 mb-8 max-w-md">
                Inscrivez-vous à notre newsletter pour recevoir les dernières actualités, 
                événements et informations d'Avolta Belgique directement dans votre boîte de réception.
              </p>
              
              <NewsletterForm className="max-w-md" />
              
              <div className="mt-6 text-sm text-night/50">
                Nous respectons votre vie privée. Vous pouvez vous désabonner à tout moment.
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <img 
                src="https://images.unsplash.com/photo-1573164574572-cb89e39749b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="Newsletter" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-day/90 backdrop-blur-sm rounded-2xl p-8 max-w-xs text-center">
                  <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-display font-semibold mb-2">
                    Pourquoi s'abonner ?
                  </h3>
                  <ul className="text-left space-y-2 text-night/70">
                    <li className="flex items-start">
                      <span className="inline-block w-4 h-4 bg-primary rounded-full mt-1 mr-2"></span>
                      Actualités exclusives
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-4 h-4 bg-primary rounded-full mt-1 mr-2"></span>
                      Événements à venir
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-4 h-4 bg-primary rounded-full mt-1 mr-2"></span>
                      Offres spéciales
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-4 h-4 bg-primary rounded-full mt-1 mr-2"></span>
                      Contenu exclusif
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}