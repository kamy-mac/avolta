/**
 * Documentation des endpoints de l'API
 */

export const API_ENDPOINTS = {
  // Authentification
  AUTH: {
    LOGIN: {
      url: '/auth/login',
      method: 'POST',
      description: 'Authentification utilisateur',
      params: {
        body: {
          email: 'string',
          password: 'string'
        }
      },
      responses: {
        200: 'Authentification réussie',
        401: 'Identifiants invalides',
        500: 'Erreur serveur'
      }
    },
    REGISTER: {
      url: '/auth/register',
      method: 'POST',
      description: 'Création d\'un nouvel administrateur (super admin uniquement)',
      params: {
        body: {
          email: 'string',
          password: 'string',
          role: 'ADMIN'
        }
      },
      responses: {
        201: 'Utilisateur créé',
        400: 'Données invalides',
        403: 'Accès refusé',
        500: 'Erreur serveur'
      }
    }
  },

  // Publications
  PUBLICATIONS: {
    GET_ALL: {
      url: '/publications',
      method: 'GET',
      description: 'Récupérer toutes les publications',
      params: {
        query: {
          page: 'number (optional)',
          size: 'number (optional)',
          sort: 'string (optional)'
        }
      },
      responses: {
        200: 'Liste des publications',
        500: 'Erreur serveur'
      }
    },
    GET_BY_ID: {
      url: '/publications/{id}',
      method: 'GET',
      description: 'Récupérer une publication par son ID',
      params: {
        path: {
          id: 'string'
        }
      },
      responses: {
        200: 'Publication trouvée',
        404: 'Publication non trouvée',
        500: 'Erreur serveur'
      }
    },
    CREATE: {
      url: '/publications',
      method: 'POST',
      description: 'Créer une nouvelle publication',
      params: {
        body: {
          title: 'string',
          content: 'string',
          imageUrl: 'string (optional)',
          validFrom: 'date',
          validTo: 'date',
          category: 'string',
          sendNewsletter: 'boolean (optional)'
        }
      },
      responses: {
        201: 'Publication créée',
        400: 'Données invalides',
        401: 'Non authentifié',
        500: 'Erreur serveur'
      }
    },
    UPDATE: {
      url: '/publications/{id}',
      method: 'PUT',
      description: 'Modifier une publication',
      params: {
        path: {
          id: 'string'
        },
        body: {
          title: 'string (optional)',
          content: 'string (optional)',
          imageUrl: 'string (optional)',
          validFrom: 'date (optional)',
          validTo: 'date (optional)',
          category: 'string (optional)'
        }
      },
      responses: {
        200: 'Publication mise à jour',
        400: 'Données invalides',
        401: 'Non authentifié',
        404: 'Publication non trouvée',
        500: 'Erreur serveur'
      }
    }
  },

  // Newsletter
  NEWSLETTER: {
    SUBSCRIBE: {
      url: '/newsletter/subscribe',
      method: 'POST',
      description: 'S\'abonner à la newsletter',
      params: {
        body: {
          email: 'string',
          firstName: 'string (optional)',
          lastName: 'string (optional)'
        }
      },
      responses: {
        201: 'Abonnement créé',
        400: 'Email invalide',
        409: 'Déjà abonné',
        500: 'Erreur serveur'
      }
    },
    GET_SUBSCRIBERS: {
      url: '/newsletter/subscribers',
      method: 'GET',
      description: 'Récupérer la liste des abonnés (admin uniquement)',
      responses: {
        200: 'Liste des abonnés',
        401: 'Non authentifié',
        403: 'Accès refusé',
        500: 'Erreur serveur'
      }
    }
  },

  // Utilisateurs
  USERS: {
    GET_ALL: {
      url: '/users',
      method: 'GET',
      description: 'Récupérer tous les utilisateurs (super admin uniquement)',
      responses: {
        200: 'Liste des utilisateurs',
        401: 'Non authentifié',
        403: 'Accès refusé',
        500: 'Erreur serveur'
      }
    },
    UPDATE: {
      url: '/users/{id}',
      method: 'PUT',
      description: 'Modifier un utilisateur (super admin uniquement)',
      params: {
        path: {
          id: 'string'
        },
        body: {
          email: 'string (optional)',
          status: 'ACTIVE | INACTIVE (optional)'
        }
      },
      responses: {
        200: 'Utilisateur mis à jour',
        400: 'Données invalides',
        401: 'Non authentifié',
        403: 'Accès refusé',
        404: 'Utilisateur non trouvé',
        500: 'Erreur serveur'
      }
    }
  }
};