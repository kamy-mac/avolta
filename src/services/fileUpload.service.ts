/**
 * File Upload Service
 *
 * This module provides functionality for uploading files to the server.
 *
 * @module services/fileUpload
 */

import api from "./api";

/**
 * File upload service
 */
class FileUploadService {
  /**
   * Upload file to server
   * @param file File to upload
   * @returns URL of the uploaded file
   */
  public async uploadFile(file: File): Promise<string> {
    try {
      // Create form data
      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading file:", file.name);
      
      // Make the API call
      const response = await api.uploadFile(formData);
      
      console.log("Upload response:", response.data);
      
      // Return the URL of the uploaded file
      // Adaptez cette ligne selon la structure réelle de votre réponse
       // Extract the file URL from the response
       // Vérifier la structure de la réponse et extraire l'URL correctement
       if (response && response.data) {
        if (response.data.fileUrl) {
          return response.data.fileUrl;
        } else if (response.data.data && response.data.data.fileUrl) {
          return response.data.data.fileUrl;
        }
      }
      
      throw new Error("Format de réponse inattendu de l'API: " + JSON.stringify(response));
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

   /**
   * Upload image from Google Drive
   * @param driveUrl Google Drive URL
   * @returns Direct URL to the image
   */
   public async uploadFromDrive(driveUrl: string): Promise<string> {
    try {
      console.log("Processing Google Drive URL:", driveUrl);
      
      // Make API call to process Drive URL
      const response = await api.uploadFromDrive({ driveUrl });
      
      console.log("Drive upload response:", response.data);
      
      // Return the direct URL
      if (response.data && response.data.fileUrl) {
        return response.data.fileUrl;
      } else {
        throw new Error("Unexpected response format: " + JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Error processing Drive URL:", error);
      throw error;
    }
  }
}




// Create and export a singleton instance
const fileUploadService = new FileUploadService();
export default fileUploadService;