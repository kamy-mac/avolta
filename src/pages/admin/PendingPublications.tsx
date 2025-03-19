import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, Eye, Calendar, Search, Edit2 } from "lucide-react";
import publicationService from "../../services/publication.service";
import { Post } from "../../types";
import { useAuth } from "../../context/AuthContext";

export default function PendingPublications() {
  const [publications, setPublications] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Create abort controller for cleanup
    const abortController = new AbortController();
    
    const init = async () => {
      // Verify user is superadmin before loading
      if (!user || user.role !== "superadmin") {
        navigate("/admin");
        return;
      }
      
      if (!abortController.signal.aborted) {
        await loadPublications();
      }
    };
    
    init();
    
    // Cleanup function to prevent memory leaks
    return () => {
      abortController.abort();
    };
  }, [user, navigate]);

  const loadPublications = async () => {
    // Use a local variable to track if the component is still mounted
    let isMounted = true;
    
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching pending publications...");
      
      // Implement a timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), 10000);
      });
      
      // Use the service method to get pending publications with a timeout
      const dataPromise = publicationService.getPendingPublications();
      const data = await Promise.race([dataPromise, timeoutPromise]) as Post[];
      
      console.log("Loaded pending publications:", data);
      
      // Only update state if component is still mounted
      if (isMounted) {
        setPublications(
          data.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      }
    } catch (error: any) {
      console.error("Error loading pending publications:", error);
      if (isMounted) {
        setError(error.message || "Error loading pending publications. Please try again.");
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

  const handleApprove = async (id: string) => {
    try {
      setError(null);
      await publicationService.approvePublication(id);
      // Remove the approved publication from the list
      setPublications((prev) => prev.filter((pub) => pub.id !== id));
    } catch (error: any) {
      console.error("Error approving publication:", error);
      setError(error.message || "Error approving publication. Please try again.");
    }
  };

  const handleReject = async (id: string) => {
    if (
      window.confirm("Are you sure you want to reject this publication?")
    ) {
      try {
        setError(null);
        await publicationService.rejectPublication(id);
        // Remove the rejected publication from the list
        setPublications((prev) => prev.filter((pub) => pub.id !== id));
      } catch (error: any) {
        console.error("Error rejecting publication:", error);
        setError(error.message || "Error rejecting publication. Please try again.");
      }
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/publications/edit/${id}`);
  };

  const handlePreview = (id: string) => {
    navigate(`/news/${id}`);
  };

  const filteredPublications = publications.filter(
    (pub) =>
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Pending Publications
            </h1>
            <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              {publications.length} pending
            </span>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="relative">
            <input
              type="text"
              placeholder="Search for a publication..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {filteredPublications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {searchTerm
              ? "No publications match your search"
              : "No pending publications"}
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
                        {new Date(publication.createdAt).toLocaleDateString(
                          "fr-BE"
                        )}
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
                        Preview
                      </button>
                      <button
                        onClick={() => handleEdit(publication.id)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleApprove(publication.id)}
                        className="inline-flex items-center text-green-600 hover:text-green-800"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(publication.id)}
                        className="inline-flex items-center text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                  {publication.imageUrl && (
                    <img
                      src={publication.imageUrl}
                      alt={publication.title}
                      className="w-32 h-32 object-cover rounded-lg ml-4"
                    />
                  )}
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span>
                    Valid from{" "}
                    {new Date(publication.validFrom).toLocaleDateString(
                      "fr-BE"
                    )}
                  </span>
                  <span className="mx-2">to</span>
                  <span>
                    {new Date(publication.validTo).toLocaleDateString("fr-BE")}
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