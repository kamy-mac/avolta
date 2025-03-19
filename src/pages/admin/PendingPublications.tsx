import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, Eye, Calendar, Search, Edit2, AlertCircle, RefreshCw } from "lucide-react";
import publicationService from "../../services/publication.service";
import { Post } from "../../types";
import { useAuth } from "../../context/AuthContext";

export default function PendingPublications() {
  const [publications, setPublications] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const { user, isSuperAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  // Fonction pour formater les erreurs du backend
  const formatErrorMessage = (error: any): string => {
    if (error.response && error.response.data && error.response.data.message) {
      return error.response.data.message;
    }
    return error.message || "Une erreur inattendue s'est produite.";
  };

  // Fonction pour charger les publications en attente
  const loadPublications = useCallback(async () => {
    if (!isSuperAdmin) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await publicationService.getPendingPublications();
      
      // Vérification pour s'assurer que data est un tableau
      if (!Array.isArray(data)) {
        console.error("Format de données inattendu:", data);
        setError("Format de données inattendu reçu du serveur.");
        setPublications([]);
        return;
      }
      
      // Tri par date de création (plus récente en premier)
      const sortedData = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setPublications(sortedData);
    } catch (error: any) {
      console.error("Erreur lors du chargement des publications en attente:", error);
      setError(formatErrorMessage(error));
      setPublications([]);
    } finally {
      setIsLoading(false);
    }
  }, [isSuperAdmin]);

  // Vérification de l'authentification et chargement initial
  useEffect(() => {
    // Attendre que le statut d'authentification soit déterminé
    if (authLoading) {
      return;
    }
    setAuthChecked(true);
    
    // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Si l'utilisateur n'est pas superadmin, rediriger vers le tableau de bord
    if (!isSuperAdmin) {
      navigate("/admin");
      return;
    }
    
    // Charger les publications en attente
    loadPublications();
  }, [user, isSuperAdmin, authLoading, navigate, loadPublications]);

  // Et dans votre rendu conditionnel
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Fonction pour approuver une publication
  const handleApprove = async (id: string) => {
    if (!id) return;
    
    setActionInProgress(id);
    setError(null);
    setSuccess(null);
    
    try {
      await publicationService.approvePublication(id);
      
      // Mise à jour optimiste de l'interface
      setPublications((prev) => prev.filter((pub) => pub.id !== id));
      setSuccess("Publication approuvée avec succès");
      
      // Effacer le message de succès après quelques secondes
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error("Erreur lors de l'approbation de la publication:", error);
      setError(formatErrorMessage(error));
      
      // Rafraîchir les données
      await loadPublications();
    } finally {
      setActionInProgress(null);
    }
  };

  // Fonction pour rejeter une publication
  const handleReject = async (id: string) => {
    if (!id || !window.confirm("Êtes-vous sûr de vouloir rejeter cette publication ?")) {
      return;
    }
    
    setActionInProgress(id);
    setError(null);
    setSuccess(null);
    
    try {
      await publicationService.rejectPublication(id);
      
      // Mise à jour optimiste de l'interface
      setPublications((prev) => prev.filter((pub) => pub.id !== id));
      setSuccess("Publication rejetée avec succès");
      
      // Effacer le message de succès après quelques secondes
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error("Erreur lors du rejet de la publication:", error);
      setError(formatErrorMessage(error));
      
      // Rafraîchir les données
      await loadPublications();
    } finally {
      setActionInProgress(null);
    }
  };

  // Gérer l'édition d'une publication
  const handleEdit = (id: string) => {
    if (id) navigate(`/admin/publications/edit/${id}`);
  };

  // Gérer la prévisualisation d'une publication
  const handlePreview = (id: string) => {
    if (id) navigate(`/news/${id}`);
  };

  // Formater une date en format local
  const formatDate = (dateString: string | Date) => {
    try {
      return new Date(dateString).toLocaleDateString("fr-BE");
    } catch {
      return "Date invalide";
    }
  };

  // Filtrer les publications par terme de recherche
  const filteredPublications = publications.filter(
    (pub) =>
      pub.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Afficher un état de chargement pendant la vérification de l'authentification
  if (!authChecked || (user === null && !authChecked)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Afficher un état de chargement pendant le chargement des données
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Afficher le composant principal
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Publications en attente
            </h1>
            <div className="flex items-center space-x-3">
              <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                {publications.length} en attente
              </span>
              <button 
                onClick={loadPublications}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Rafraîchir"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une publication..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
              aria-label="Rechercher une publication"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Contenu principal - publications ou message vide */}
        {filteredPublications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <X className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {searchTerm
                ? "Aucune publication ne correspond à votre recherche"
                : "Aucune publication en attente"}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm
                ? "Essayez d'autres termes de recherche ou supprimez les filtres."
                : "Toutes les publications ont été traitées ou aucune publication n'a été soumise pour approbation."}
            </p>
            <button
              onClick={loadPublications}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#6A0DAD] hover:bg-[#5a0b91]"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPublications.map((publication) => (
              <div key={publication.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">
                        {formatDate(publication.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {publication.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {publication.content}
                    </p>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handlePreview(publication.id)}
                        className="inline-flex items-center text-gray-600 hover:text-[#6A0DAD]"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Prévisualiser
                      </button>
                      <button
                        onClick={() => handleEdit(publication.id)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleApprove(publication.id)}
                        disabled={actionInProgress === publication.id}
                        className="inline-flex items-center text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionInProgress === publication.id ? (
                          <>
                            <svg className="animate-spin h-4 w-4 mr-1 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Approbation...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Approuver
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(publication.id)}
                        disabled={actionInProgress === publication.id}
                        className="inline-flex items-center text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionInProgress === publication.id ? (
                          <>
                            <svg className="animate-spin h-4 w-4 mr-1 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Rejet...
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4 mr-1" />
                            Rejeter
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  {publication.imageUrl && (
                    <img
                      src={publication.imageUrl}
                      alt={publication.title}
                      className="w-32 h-32 object-cover rounded-lg ml-4"
                      onError={(e) => {
                        // Gérer les erreurs de chargement d'image
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/150?text=Image+non+disponible';
                      }}
                    />
                  )}
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span>
                    Valide du{" "}
                    {formatDate(publication.validFrom)}
                  </span>
                  <span className="mx-2">au</span>
                  <span>
                    {formatDate(publication.validTo)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}