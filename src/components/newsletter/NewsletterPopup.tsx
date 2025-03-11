import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import NewsletterForm from './NewsletterForm';

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Check if the user has already closed the popup
    const hasClosedPopup = localStorage.getItem('newsletterPopupClosed');
    
    if (!hasClosedPopup) {
      // Show popup after 10 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleClose = () => {
    setIsOpen(false);
    // Remember that the user closed the popup
    localStorage.setItem('newsletterPopupClosed', 'true');
  };
  
  const handleSuccess = () => {
    // Close the popup after successful subscription
    setTimeout(() => {
      setIsOpen(false);
      // Remember that the user subscribed
      localStorage.setItem('newsletterPopupClosed', 'true');
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