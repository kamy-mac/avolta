/**
 * Documentation des endpoints de l'API
 */

export const API_ENDPOINTS = {
  // Authentification
  AUTH: {
    LOGIN: {
      url: "/auth/login",
      method: "POST",
      description: "Authentification utilisateur",
      params: {
        body: {
          email: "string",
          password: "string",
        },
      },
      responses: {
        200: "Authentification réussie",
        401: "Identifiants invalides",
        500: "Erreur serveur",
      },
    },
    REGISTER: {
      url: "/auth/register",
      method: "POST",
      description:
        "Création d'un nouvel administrateur (super admin uniquement)",
      params: {
        body: {
          email: "string",
          password: "string",
          role: "ADMIN",
        },
      },
      responses: {
        201: "Utilisateur créé",
        400: "Données invalides",
        403: "Accès refusé",
        500: "Erreur serveur",
      },
    },
  },

  // Publications
  PUBLICATIONS: {
    GET_ALL: {
      url: "/publications",
      method: "GET",
      description: "Récupérer toutes les publications",
      params: {
        query: {
          page: "number (optional)",
          size: "number (optional)",
          sort: "string (optional)",
        },
      },
      responses: {
        200: "Liste des publications",
        500: "Erreur serveur",
      },
    },
    GET_ACTIVE: {
      url: "/publications/public/active",
      method: "GET",
      description: "Récupérer les publications actives (endpoint public)",
      responses: {
        200: "Liste des publications actives",
        500: "Erreur serveur",
      },
    },
    GET_BY_CATEGORY: {
      url: "/publications/public/category/{category}",
      method: "GET",
      description:
        "Récupérer les publications actives par catégorie (endpoint public)",
      params: {
        path: {
          category: "string",
        },
      },
      responses: {
        200: "Liste des publications de la catégorie",
        500: "Erreur serveur",
      },
    },
    GET_PENDING: {
      url: "/publications/pending",
      method: "GET",
      description:
        "Récupérer les publications en attente (superadmin uniquement)",
      responses: {
        200: "Liste des publications en attente",
        401: "Non authentifié",
        403: "Accès refusé",
        500: "Erreur serveur",
      },
    },
    GET_BY_ID: {
      url: "/publications/public/{id}",
      method: "GET",
      description: "Récupérer une publication par son ID (endpoint public)",
      params: {
        path: {
          id: "string",
        },
      },
      responses: {
        200: "Publication trouvée",
        404: "Publication non trouvée",
        500: "Erreur serveur",
      },
    },
    CREATE: {
      url: "/publications",
      method: "POST",
      description: "Créer une nouvelle publication",
      params: {
        body: {
          title: "string",
          content: "string",
          imageUrl: "string (optional)",
          validFrom: "date",
          validTo: "date",
          category: "string",
          sendNewsletter: "boolean (optional)",
        },
      },
      responses: {
        201: "Publication créée",
        400: "Données invalides",
        401: "Non authentifié",
        500: "Erreur serveur",
      },
    },
    UPDATE: {
      url: "/publications/{id}",
      method: "PUT",
      description: "Modifier une publication",
      params: {
        path: {
          id: "string",
        },
        body: {
          title: "string (optional)",
          content: "string (optional)",
          imageUrl: "string (optional)",
          validFrom: "date (optional)",
          validTo: "date (optional)",
          category: "string (optional)",
        },
      },
      responses: {
        200: "Publication mise à jour",
        400: "Données invalides",
        401: "Non authentifié",
        404: "Publication non trouvée",
        500: "Erreur serveur",
      },
    },
    APPROVE: {
      url: "/publications/{id}/approve",
      method: "PUT",
      description: "Approuver une publication (superadmin uniquement)",
      params: {
        path: {
          id: "string",
        },
      },
      responses: {
        200: "Publication approuvée",
        401: "Non authentifié",
        403: "Accès refusé",
        404: "Publication non trouvée",
        500: "Erreur serveur",
      },
    },
    REJECT: {
      url: "/publications/{id}/reject",
      method: "DELETE",
      description: "Rejeter une publication (superadmin uniquement)",
      params: {
        path: {
          id: "string",
        },
      },
      responses: {
        204: "Publication rejetée",
        401: "Non authentifié",
        403: "Accès refusé",
        404: "Publication non trouvée",
        500: "Erreur serveur",
      },
    },
    DELETE: {
      url: "/publications/{id}",
      method: "DELETE",
      description: "Supprimer une publication",
      params: {
        path: {
          id: "string",
        },
      },
      responses: {
        204: "Publication supprimée",
        401: "Non authentifié",
        404: "Publication non trouvée",
        500: "Erreur serveur",
      },
    },
    LIKE: {
      url: "/publications/public/{id}/like",
      method: "POST",
      description: "Aimer une publication (endpoint public)",
      params: {
        path: {
          id: "string",
        },
      },
      responses: {
        200: "Publication aimée",
        404: "Publication non trouvée",
        500: "Erreur serveur",
      },
    },
  },

  // Commentaires
  COMMENTS: {
    GET_BY_PUBLICATION: {
      url: "/publications/{id}/comments",
      method: "GET",
      description: "Récupérer tous les commentaires d'une publication",
      params: {
        path: {
          id: "string",
        },
      },
      responses: {
        200: "Liste des commentaires",
        404: "Publication non trouvée",
        500: "Erreur serveur",
      },
    },
    CREATE: {
      url: "/publications/{id}/comments",
      method: "POST",
      description: "Ajouter un commentaire à une publication",
      params: {
        path: {
          id: "string",
        },
        body: {
          content: "string",
        },
      },
      responses: {
        201: "Commentaire créé",
        400: "Données invalides",
        401: "Non authentifié",
        404: "Publication non trouvée",
        500: "Erreur serveur",
      },
    },
    DELETE: {
      url: "/publications/{publicationId}/comments/{commentId}",
      method: "DELETE",
      description: "Supprimer un commentaire",
      params: {
        path: {
          publicationId: "string",
          commentId: "string",
        },
      },
      responses: {
        204: "Commentaire supprimé",
        401: "Non authentifié",
        404: "Commentaire non trouvé",
        500: "Erreur serveur",
      },
    },
  },

  // Newsletter
  NEWSLETTER: {
    SUBSCRIBE: {
      url: "/newsletter/subscribe",
      method: "POST",
      description: "S'abonner à la newsletter",
      params: {
        body: {
          email: "string",
          firstName: "string (optional)",
          lastName: "string (optional)",
        },
      },
      responses: {
        201: "Abonnement créé",
        400: "Email invalide",
        409: "Déjà abonné",
        500: "Erreur serveur",
      },
    },
    GET_SUBSCRIBERS: {
      url: "/newsletter/subscribers",
      method: "GET",
      description: "Récupérer la liste des abonnés (admin uniquement)",
      responses: {
        200: "Liste des abonnés",
        401: "Non authentifié",
        403: "Accès refusé",
        500: "Erreur serveur",
      },
    },
    UNSUBSCRIBE: {
      url: "/newsletter/unsubscribe",
      method: "DELETE",
      description: "Se désabonner de la newsletter",
      params: {
        query: {
          email: "string",
        },
      },
      responses: {
        204: "Désabonnement réussi",
        404: "Abonné non trouvé",
        500: "Erreur serveur",
      },
    },
    DELETE_SUBSCRIBER: {
      url: "/newsletter/subscribers/{id}",
      method: "DELETE",
      description: "Supprimer un abonné (admin uniquement)",
      params: {
        path: {
          id: "string",
        },
      },
      responses: {
        204: "Abonné supprimé",
        401: "Non authentifié",
        403: "Accès refusé",
        404: "Abonné non trouvé",
        500: "Erreur serveur",
      },
    },
    SEND_TEST: {
      url: "/newsletter/test",
      method: "POST",
      description: "Envoyer un email de test (admin uniquement)",
      params: {
        query: {
          email: "string",
        },
      },
      responses: {
        200: "Email envoyé",
        400: "Email invalide",
        401: "Non authentifié",
        500: "Erreur serveur",
      },
    },
  },

  // Utilisateurs
  USERS: {
    GET_ALL: {
      url: "/users",
      method: "GET",
      description: "Récupérer tous les utilisateurs (super admin uniquement)",
      responses: {
        200: "Liste des utilisateurs",
        401: "Non authentifié",
        403: "Accès refusé",
        500: "Erreur serveur",
      },
    },
    GET_BY_ID: {
      url: "/users/{id}",
      method: "GET",
      description:
        "Récupérer un utilisateur par son ID (super admin uniquement)",
      params: {
        path: {
          id: "string",
        },
      },
      responses: {
        200: "Utilisateur trouvé",
        401: "Non authentifié",
        403: "Accès refusé",
        404: "Utilisateur non trouvé",
        500: "Erreur serveur",
      },
    },
    UPDATE: {
      url: "/users/{id}",
      method: "PUT",
      description: "Modifier un utilisateur (super admin uniquement)",
      params: {
        path: {
          id: "string",
        },
        body: {
          email: "string (optional)",
          status: "ACTIVE | INACTIVE (optional)",
        },
      },
      responses: {
        200: "Utilisateur mis à jour",
        400: "Données invalides",
        401: "Non authentifié",
        403: "Accès refusé",
        404: "Utilisateur non trouvé",
        500: "Erreur serveur",
      },
    },
    UPDATE_STATUS: {
      url: "/users/{id}/status",
      method: "PUT",
      description:
        "Mettre à jour le statut d'un utilisateur (super admin uniquement)",
      params: {
        path: {
          id: "string",
        },
        query: {
          status: "ACTIVE | INACTIVE",
        },
      },
      responses: {
        200: "Statut mis à jour",
        400: "Statut invalide",
        401: "Non authentifié",
        403: "Accès refusé",
        404: "Utilisateur non trouvé",
        500: "Erreur serveur",
      },
    },
    DELETE: {
      url: "/users/{id}",
      method: "DELETE",
      description: "Supprimer un utilisateur (super admin uniquement)",
      params: {
        path: {
          id: "string",
        },
      },
      responses: {
        204: "Utilisateur supprimé",
        401: "Non authentifié",
        403: "Accès refusé",
        404: "Utilisateur non trouvé",
        500: "Erreur serveur",
      },
    },
  },
};
