package com.avolta.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @SuppressWarnings("null")
    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Vérifier si le fichier est une image
            if (!file.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest().body("Seules les images sont autorisées");
            }

            // Créer le répertoire de téléchargement s'il n'existe pas
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Générer un nom de fichier unique
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = UUID.randomUUID().toString() + extension;
            
            // Chemin complet du fichier
            Path filePath = Paths.get(uploadDir, newFilename);
            
            // Enregistrer le fichier
            Files.write(filePath, file.getBytes());
            
            // Construire l'URL d'accès au fichier
            String fileUrl = "/api/uploads/" + newFilename;
            
            Map<String, String> response = new HashMap<>();
            response.put("fileUrl", fileUrl);
            
            return ResponseEntity.ok(response);
    } catch (IOException e) {
        System.err.println("Erreur lors du téléchargement: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors du téléchargement du fichier: " + e.getMessage());
    }
    }

    @PostMapping("/drive")
    public ResponseEntity<?> uploadFromDrive(@RequestBody Map<String, String> request) {
        try {
            // Vérifier que le paramètre driveUrl est présent
            if (!request.containsKey("driveUrl")) {
                return ResponseEntity.badRequest().body("Le paramètre driveUrl est requis");
            }
            
            String driveUrl = request.get("driveUrl");
            
            // Valider l'URL Google Drive
            if (!driveUrl.contains("drive.google.com")) {
                return ResponseEntity.badRequest().body("L'URL doit être une URL Google Drive valide");
            }
            
            // Extraire l'ID du fichier à partir de l'URL
            String fileId = extractGoogleDriveFileId(driveUrl);
            
            if (fileId == null) {
                return ResponseEntity.badRequest().body("Impossible d'extraire l'ID du fichier à partir de l'URL");
            }
            
            // Générer l'URL d'accès direct à l'image
            String directUrl = "https://drive.google.com/uc?export=view&id=" + fileId;
            
            Map<String, String> response = new HashMap<>();
            response.put("fileUrl", directUrl);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors du traitement de l'URL du Drive: " + e.getMessage());
        }
    }
    
    private String extractGoogleDriveFileId(String url) {
        String fileId = null;
        
        // Format standard de partage
        if (url.contains("/d/")) {
            int startIndex = url.indexOf("/d/") + 3;
            int endIndex = url.indexOf("/", startIndex);
            if (endIndex == -1) {
                endIndex = url.length();
            }
            fileId = url.substring(startIndex, endIndex);
        } 
        // Format pour les liens ouverts
        else if (url.contains("id=")) {
            int startIndex = url.indexOf("id=") + 3;
            int endIndex = url.indexOf("&", startIndex);
            if (endIndex == -1) {
                endIndex = url.length();
            }
            fileId = url.substring(startIndex, endIndex);
        }
        
        return fileId;
    }


}