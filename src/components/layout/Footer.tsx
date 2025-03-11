import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react';
import NewsletterForm from '../newsletter/NewsletterForm';

export default function Footer() {
  return (
    <footer className="bg-night text-day/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Contact */}
          <div>
            <h3 className="text-day text-lg font-display font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-primary" />
                <a href="mailto:contact@avolta.be" className="hover:text-day transition-colors">
                  contact@avolta.be
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-primary" />
                <a href="tel:+32123456789" className="hover:text-day transition-colors">
                  +32 123 456 789
                </a>
              </li>
              <li className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary" />
                <span>Brussels Airport, Belgium</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="text-day text-lg font-display font-semibold mb-4">Newsletter</h3>
            <p className="text-day/60 mb-4">
              Restez informé des dernières actualités et événements d'Avolta Belgique.
            </p>
            <NewsletterForm />
          </div>

          {/* Links */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-day text-lg font-display font-semibold mb-4">À propos</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/about" className="hover:text-day transition-colors">Notre histoire</Link>
                  </li>
                  <li>
                    <Link to="/team" className="hover:text-day transition-colors">Notre équipe</Link>
                  </li>
                  <li>
                    <Link to="/careers" className="hover:text-day transition-colors">Carrières</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-day text-lg font-display font-semibold mb-4">Légal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/privacy" className="hover:text-day transition-colors">Confidentialité</Link>
                  </li>
                  <li>
                    <Link to="/terms" className="hover:text-day transition-colors">Conditions</Link>
                  </li>
                  <li>
                    <Link to="/cookies" className="hover:text-day transition-colors">Cookies</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-night-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="flex items-center justify-center">
                <Link to="/" className="flex items-center">
                  <img
                    src="/src/images/LOGO_AVOLTA_FL_CORE_RGB.jpg"
                    alt="Logo Avolta"
                    className="w-25 h-10"
                  />
                </Link>
              </div>
            </div>

            <div className="flex space-x-6">
              <a href="#" className="text-day/60 hover:text-day transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-day/60 hover:text-day transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-day/60 hover:text-day transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-day/40">
            © {new Date().getFullYear()} Avolta Belgique. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
}