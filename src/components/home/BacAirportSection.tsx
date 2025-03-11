/**
 * BAC Airport Section Component
 * 
 * This component displays a section on the homepage for BAC Airport personnel
 * with a link to a protected area.
 * 
 * @module components/home/BacAirportSection
 */

import React from 'react';
import { Building2, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LazyImage } from '../../utils/lazyLoad';

export default function BacAirportSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full -translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-1 bg-primary rounded-full mr-4" />
              <span className="text-primary font-medium">Espace Réservé</span>
            </div>
            
            <h2 className="style-audacieux text-night mb-6">
              BAC Airport <span className="text-primary">Personnel</span>
            </h2>
            
            <p className="text-night/70 mb-8 max-w-lg">
              Un espace dédié aux employés de Brussels Airport Company avec des actualités, 
              des événements et des informations exclusives pour le personnel de BAC.
            </p>
            
            <Link
              to="/bac-airport"
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-day font-medium rounded-full transition-colors"
            >
              Accéder à l'espace BAC
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <LazyImage
              src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d"
              alt="Brussels Airport"
              className="w-full h-full"
              aspectRatio="4/3"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night/70 to-transparent flex items-end">
              <div className="p-8 w-full">
                <div className="flex items-center text-day mb-2">
                  <Lock className="w-5 h-5 mr-2" />
                  <span className="font-medium">Accès sécurisé</span>
                </div>
                <p className="text-day/80 text-sm">
                  Cet espace est réservé au personnel de Brussels Airport Company.
                  Un code d'accès est requis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}