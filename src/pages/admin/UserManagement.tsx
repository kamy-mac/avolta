import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Key,
  Trash2,
  UserCheck,
  UserX,
  Search,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import userService from "../../services/user.service";
import authService from "../../services/auth.service";
import { User } from "../../types";
import { useAuth } from "../../context/AuthContext";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", password: "" });
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const { user, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Chargement des utilisateurs...");
      const data = await userService.getAllUsers();
      console.log("Utilisateurs chargés:", data);
      setUsers(data);
    } catch (error: any) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      setError(
        error.response?.data?.message ||
          "Erreur lors du chargement des utilisateurs"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Vérifier si l'utilisateur existe
    if (!user) {
      console.log("Utilisateur non connecté, redirection vers login");
      navigate("/login");
      return;
    }

    // Utiliser isSuperAdmin comme fourni par le contexte
    console.log("État isSuperAdmin:", isSuperAdmin);

    if (!isSuperAdmin) {
      console.log(
        "L'utilisateur n'est pas superadmin, redirection vers dashboard"
      );
      navigate("/admin");
      return;
    }

    loadUsers();
  }, [user, isSuperAdmin, navigate, loadUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setActionInProgress("create");

    try {
      await authService.register({
        email: newUser.email,
        password: newUser.password,
        role: "admin",
      });

      setNewUser({ email: "", password: "" });
      setShowCreateForm(false);
      setSuccess("Administrateur créé avec succès");

      // Recharger la liste après création
      loadUsers();

      // Effacer le message après quelques secondes
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error("Erreur création utilisateur:", error);
      setError(
        error.response?.data?.message ||
          "Erreur lors de la création de l'utilisateur"
      );
    } finally {
      setActionInProgress(null);
    }
  };

  const handleToggleStatus = async (
    userId: string,
    currentStatus: "ACTIVE" | "INACTIVE" | "active" | "inactive"
  ) => {
    setActionInProgress(userId);
    setError(null);
    setSuccess(null);

    try {
      // Normaliser le statut indépendamment de la casse
      const normalizedStatus = currentStatus.toUpperCase() as
        | "ACTIVE"
        | "INACTIVE";
      const newStatus = normalizedStatus === "ACTIVE" ? "inactive" : "active";

      await userService.updateUserStatus(userId, newStatus as "active" | "inactive");

      // Mettre à jour l'état local sans recharger toute la liste
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus as any } : user
        )
      );

      setSuccess(
        `Status de l'utilisateur changé à ${
          newStatus === "active" ? "actif" : "inactif"
        }`
      );

      // Effacer le message après quelques secondes
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error("Erreur mise à jour statut:", error);
      setError(
        error.response?.data?.message ||
          "Erreur lors de la mise à jour du statut"
      );

      // Recharger en cas d'erreur
      loadUsers();
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      return;
    }

    setActionInProgress(userId);
    setError(null);
    setSuccess(null);

    try {
      await userService.deleteUser(userId);

      // Mettre à jour l'état local sans recharger toute la liste
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      setSuccess("Utilisateur supprimé avec succès");

      // Effacer le message après quelques secondes
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error("Erreur suppression utilisateur:", error);
      setError(
        error.response?.data?.message ||
          "Erreur lors de la suppression de l'utilisateur"
      );

      // Recharger en cas d'erreur
      loadUsers();
    } finally {
      setActionInProgress(null);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isUserRole = (role: string, compareRole: string): boolean => {
    if (!role) return false;
    return role.toLowerCase() === compareRole.toLowerCase();
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Gestion des administrateurs
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={loadUsers}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                title="Rafraîchir"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6A0DAD] hover:bg-[#5a0b91]"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Ajouter un administrateur
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

          {showCreateForm && (
            <form
              onSubmit={handleCreateUser}
              className="mb-6 bg-gray-50 p-4 rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="email"
                      id="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                      required
                    />
                    <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mot de passe
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="password"
                      id="password"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                      required
                    />
                    <Key className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={actionInProgress === "create"}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6A0DAD] hover:bg-[#5a0b91] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionInProgress === "create" ? (
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
                      Création...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5 mr-2" />
                      Créer l'administrateur
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un administrateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <UserX className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {searchTerm
                  ? "Aucun administrateur ne correspond à votre recherche"
                  : "Aucun administrateur trouvé"}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchTerm
                  ? "Essayez d'autres termes de recherche ou supprimez les filtres."
                  : "Ajoutez des administrateurs pour gérer votre site."}
              </p>
              <button
                onClick={loadUsers}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#6A0DAD] hover:bg-[#5a0b91]"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Rôle
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Statut
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date de création
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Dernière connexion
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {user.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "superadmin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role === "superadmin" ? "Super Admin" : "Admin"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status === "active" ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("fr-BE")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString("fr-BE")
                        : "Jamais connecté"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {user.role !== "superadmin" && (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() =>
                              handleToggleStatus(user.id, user.status)
                            }
                            className={`p-2 rounded-full ${
                              user.status === "active"
                                ? "text-green-600 hover:text-green-900"
                                : "text-red-600 hover:text-red-900"
                            } transition-colors`}
                            title={
                              user.status === "active"
                                ? "Désactiver"
                                : "Activer"
                            }
                            aria-label={
                              user.status === "active"
                                ? "Désactiver l'utilisateur"
                                : "Activer l'utilisateur"
                            }
                          >
                            {user.status === "active" ? (
                              <UserCheck className="h-5 w-5" />
                            ) : (
                              <UserX className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 rounded-full text-red-600 hover:text-red-900 transition-colors"
                            title="Supprimer"
                            aria-label="Supprimer l'utilisateur"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
