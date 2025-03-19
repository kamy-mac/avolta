import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import newsletterService from '../../services/newsletter.service';

function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await newsletterService.subscribe({ 
        email, 
        firstName, 
        lastName 
      });
      
      setSuccess("Merci de vous être abonné à notre newsletter !");
      setEmail("");
      setFirstName("");
      setLastName("");
    } catch (err: any) {
      console.error("Erreur d'inscription à la newsletter :", err);
      setError(
        err.response?.data?.message || 
        "Échec de l'inscription. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`space-y-4 ${className}`}
    >
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}

      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre email professionnel"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Prénom"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Nom"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50"
      >
        {isLoading ? 'Inscription en cours...' : 'Je m\'abonne'}
      </button>
    </form>
  );
}

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
                src="src\images\newsletter1.png" 
                alt="Newsletter Avolta" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-day/90 backdrop-blur-sm rounded-2xl p-8 max-w-xs text-center">
                  <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-display font-semibold mb-2">
                    Pourquoi s'abonner ?
                  </h3>
                  <ul className="text-left space-y-2 text-night/70">
                    {[
                      "Actualités exclusives",
                      "Événements à venir", 
                      "Offres spéciales", 
                      "Contenu exclusif"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-4 h-4 bg-primary rounded-full mt-1 mr-2"></span>
                        {item}
                      </li>
                    ))}
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