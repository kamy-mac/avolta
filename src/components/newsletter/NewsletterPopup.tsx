import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import newsletterService from '../../services/newsletter.service';

interface NewsletterFormProps {
  buttonText?: string;
  placeholder?: string;
  onSuccess?: () => void;
}

function NewsletterForm({ 
  buttonText = "Je m'abonne", 
  placeholder = "Votre email professionnel",
  onSuccess 
}: NewsletterFormProps) {
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
      await newsletterService.subscribe({ email, firstName, lastName });
      setSuccess("Merci de vous être abonné à notre newsletter !");
      setEmail("");
      setFirstName("");
      setLastName("");
      
      // Appel de la fonction onSuccess si fournie
      if (onSuccess) {
        onSuccess();
      }
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}

      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Prénom"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Nom de famille"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Inscription en cours...
          </>
        ) : (
          buttonText
        )}
      </button>
    </form>
  );
}

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fermé la popup ou s'est abonné
    const hasClosedPopup = localStorage.getItem('newsletterPopupClosed');
    const hasSubscribed = localStorage.getItem('newsletterSubscribed');
    
    if (!hasClosedPopup && !hasSubscribed) {
      // Afficher la popup après 10 secondes
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleClose = () => {
    setIsOpen(false);
    // Mémoriser que l'utilisateur a fermé la popup
    localStorage.setItem('newsletterPopupClosed', 'true');
  };
  
  const handleSuccess = () => {
    // Fermer la popup après un abonnement réussi
    setTimeout(() => {
      setIsOpen(false);
      setIsSubscribed(true);
      // Mémoriser que l'utilisateur s'est abonné
      localStorage.setItem('newsletterSubscribed', 'true');
    }, 3000);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night/70">
      <div className="relative bg-day rounded-2xl shadow-xl max-w-md w-full p-8 animate-fadeIn">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-night"
          aria-label="Fermer"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-day font-display text-2xl">A</span>
          </div>
          <h3 className="text-2xl font-display font-semibold text-night mb-2">
            Restez informé
          </h3>
          <p className="text-night/70">
            Abonnez-vous à notre newsletter pour recevoir les dernières actualités d'Avolta Belgique.
          </p>
        </div>
        
        <NewsletterForm 
          buttonText="Je m'abonne"
          placeholder="Votre email professionnel"
          onSuccess={handleSuccess}
        />
        
        <div className="mt-4 text-center text-xs text-night/50">
          En vous inscrivant, vous acceptez de recevoir nos communications par email.
          Vous pourrez vous désabonner à tout moment.
        </div>
      </div>
    </div>
  );
}