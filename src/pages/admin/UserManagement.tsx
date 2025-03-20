import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Key,
  Trash2,
  UserCheck,
  UserX,
  Search,
} from "lucide-react";
import userService from "../../services/user.service";
import authService from "../../services/auth.service";
import { User } from "../../types";
import { useAuth } from "../../context/AuthContext";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", password: "" });
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Create abort controller for cleanup
    const abortController = new AbortController();

    const init = async () => {
      // Check if user is superadmin before loading data
      if (!currentUser || currentUser.role.toLowerCase() !== "superadmin") {
        navigate("/admin");
        console.log("User object:", currentUser);
        console.log("JWT token:", localStorage.getItem("token"));
        return;
      }

      if (!abortController.signal.aborted) {
        await loadUsers();
      }
    };

    init();

    // Cleanup function to prevent memory leaks
    return () => {
      abortController.abort();
    };
  }, [currentUser, navigate]);

  const loadUsers = async () => {
    // Use a local variable to track if the component is still mounted
    let isMounted = true;

    try {
      if (isMounted) setIsLoading(true);
      if (isMounted) setError(null);
      console.log("Fetching all users...");

      // Implement a timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), 10000);
      });

      // Use the service method with a timeout
      const dataPromise = userService.getAllUsers();
      const data = (await Promise.race([
        dataPromise,
        timeoutPromise,
      ])) as User[];

      console.log("Loaded users:", data);

      // Only update state if component is still mounted
      if (isMounted) {
        setUsers(data);
      }
    } catch (error: any) {
      console.error("Error loading users:", error);
      if (isMounted) {
        setError(error.message || "Error loading users. Please try again.");
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }

    // Cleanup function
    return () => {
      isMounted = false;
    };
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Use the register method from authService
      await authService.register({
        email: newUser.email,
        password: newUser.password,
        role: "admin",
      });
      setNewUser({ email: "", password: "" });
      setShowCreateForm(false);
      loadUsers();
    } catch (error: any) {
      console.error("Error creating user:", error);
      setError(error.message || "Failed to create user. Please try again.");
    }
  };

  const handleToggleStatus = async (
    userId: string,
    currentStatus: "active" | "inactive"
  ) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await userService.updateUserStatus(userId, newStatus);
      loadUsers();
    } catch (error: any) {
      console.error("Error updating user status:", error);
      setError(
        error.message || "Failed to update user status. Please try again."
      );
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      loadUsers();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      setError(error.message || "Failed to delete user. Please try again.");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              User Management
            </h1>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6A0DAD] hover:bg-[#5a0b91]"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Add Administrator
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
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
                    Password
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6A0DAD] hover:bg-[#5a0b91]"
                >
                  Create Administrator
                </button>
              </div>
            </form>
          )}

          <div className="relative">
            <input
              type="text"
              placeholder="Search for an administrator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
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
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Registration Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Login
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
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
                        {user.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("fr-BE")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString("fr-BE")
                        : "Never logged in"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {user.role !== "superadmin" && (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() =>
                              handleToggleStatus(
                                user.id,
                                user.status as "active" | "inactive"
                              )
                            }
                            className={`p-2 rounded-full ${
                              user.status === "active"
                                ? "text-green-600 hover:text-green-900"
                                : "text-red-600 hover:text-red-900"
                            }`}
                            title={
                              user.status === "active"
                                ? "Deactivate"
                                : "Activate"
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
                            className="p-2 rounded-full text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                          
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
