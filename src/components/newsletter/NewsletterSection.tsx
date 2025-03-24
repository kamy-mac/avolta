import React, { useState } from "react";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import newsletterService from "../../services/newsletter.service";

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
        lastName,
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
      aria-labelledby="newsletter-form-title"
    >
      {error && (
        <div
          className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          className="flex items-center p-3 bg-green-50 border border-green-200 rounded-md text-green-600 text-sm"
          role="alert"
        >
          <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-night/80">
          Email professionnel *
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
          required
          aria-required="true"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label
            htmlFor="firstName"
            className="text-sm font-medium text-night/80"
          >
            Prénom
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Prénom"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
          />
        </div>
        <div className="space-y-1">
          <label
            htmlFor="lastName"
            className="text-sm font-medium text-night/80"
          >
            Nom
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Nom"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 px-4 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Inscription en cours...
          </span>
        ) : (
          "Je m'abonne"
        )}
      </button>

      <p className="text-xs text-night/50 mt-2">
        * Champ obligatoire. En vous inscrivant, vous acceptez notre politique
        de confidentialité.
      </p>
    </form>
  );
}

export default function NewsletterSection() {
  return (
   
    // <!-- Container Avolta Stratégie avec dégradé deux tons sur fond violet -->
    <section className="py-10 bg-gradient-to-br from-sand to-sand/70 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row rounded-lg overflow-hidden shadow-md ">
          {/* <!-- Côté gauche - Fond violet avec dégradé deux tons --> */}
          <div className="w-full md:w-2/5 relative flex items-center">
            {/* <!-- Premier ton de violet (plus foncé) --> */}
            <div className="absolute inset-0 bg-primary"></div>
            
            {/* <!-- Deuxième ton de violet (plus clair) --> */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light opacity-100 "></div>
            
            {/* <!-- Effet de vagues ou courbes subtiles --> */}
            <div className="absolute right-0 h-full w-2/4 bg-gradient-to-l from-primary-light to-transparent rounded-l-[80px] "></div>
            
            {/* <!-- Contenu texte --> */}
            <div className="p-8 md:p-10 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Notre stratégie :<br />
                Destination 2027
              </h2>
              <a 
                href="https://www.avoltaworld.com/en/meet-avolta/our-strategy" 
                className="inline-flex items-center text-white mt-6 hover:underline"
              >
                En savoir plus
                <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
    
          {/* <!-- Côté droit - Image --> */}
          <div className="w-full md:w-3/5 h-72 md:h-96 relative">
            <img
              src="src/images/Destination 2027_composant .jpeg"
              alt="Personne au sommet d'une montagne contemplant le paysage"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    


      {/* Decorative Elements */}
      <div
        className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="p-8 lg:p-12 lg:col-span-7">
              <div className="flex items-center mb-6">
                <div
                  className="w-12 h-1 bg-primary rounded-full mr-4"
                  aria-hidden="true"
                />
                <span className="text-primary font-medium uppercase tracking-wider text-sm">
                  Newsletter
                </span>
              </div>

              <h2
                id="newsletter-section-title"
                className="style-audacieux text-night text-3xl font-bold mb-6"
              >
                Restez connecté avec Avolta
              </h2>

              <p className="text-night/70 mb-8 max-w-md text-lg">
                Inscrivez-vous à notre newsletter pour recevoir les dernières
                actualités, événements et informations d'Avolta Belgique
                directement dans votre boîte de réception.
              </p>

              <NewsletterForm className="max-w-md" />

              <div className="mt-6 text-sm text-night/50 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m0 0v2m0-2h2m-2 0H9m1-4a1 1 0 100-2 1 1 0 000 2z"
                  />
                </svg>
                Nous respectons votre vie privée. Vous pouvez vous désabonner à
                tout moment.
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-5 relative">
              <img
                src="/src/images/newsletter1.png"
                alt="Newsletter Avolta"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/30 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 max-w-xs shadow-lg transform transition-all duration-500 hover:scale-105">
                  <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-4 text-center">
                    Pourquoi s'abonner ?
                  </h3>
                  <ul className="space-y-3 text-night/80">
                    {[
                      "Actualités exclusives du secteur",
                      "Invitations aux événements à venir",
                      "Offres spéciales et promotions",
                      "Contenu premium et analyses",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
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
