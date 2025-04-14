// src/components/admin/ImageManager.tsx
import React, { useState, useRef } from "react";
import {
  X,
  Plus,
  Upload,
  Link as LinkIcon,
  RotateCw,
  Move,
  Edit2,
} from "lucide-react";
import fileUploadService from "../../services/fileUpload.service";
import { PublicationImage } from "../../types";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

interface ImageManagerProps {
  images: PublicationImage[];
  onChange: (images: PublicationImage[]) => void;
  maxImages?: number;
}

const ImageManager: React.FC<ImageManagerProps> = ({
  images,
  onChange,
  maxImages = 3,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [driveUrl, setDriveUrl] = useState("");
  const [showDriveInput, setShowDriveInput] = useState(false);
  const [showCaptionInput, setShowCaptionInput] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gérer la sélection de fichier pour upload direct
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      setUploadError("Le fichier doit être une image.");
      return;
    }
    
    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("L'image est trop volumineuse (max 5MB).");
      return;
    }
    
    // Créer une URL de prévisualisation
    const previewUrl = URL.createObjectURL(file);
    
    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      // Créer un objet temporaire avec la prévisualisation
      const tempImage: PublicationImage = {
        imageUrl: previewUrl,
        displayOrder: images.length,
        caption: ""
      };
      
      // Ajouter temporairement l'image pour prévisualisation
      const updatedImagesTemp = [...images, tempImage];
      onChange(updatedImagesTemp);
      
      // Simuler une progression
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(90, prev + 10));
      }, 300);
      
      // Uploader le fichier
      const imageUrl = await fileUploadService.uploadFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Remplacer l'URL temporaire par l'URL réelle
      const finalImages = updatedImagesTemp.map((img, idx) => {
        if (idx === images.length) {
          return {
            ...img,
            imageUrl: imageUrl
          };
        }
        return img;
      });
      
      onChange(finalImages);
      
      // Réinitialiser les états
      setUploadProgress(0);
      setUploadError(null);
      
      // Réinitialiser le champ de fichier
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("Erreur lors du téléchargement. Veuillez réessayer.");
      
      // Annuler l'ajout de l'image temporaire
      onChange(images);
    } finally {
      setIsUploading(false);
    }
  };

  // Gérer l'upload depuis Google Drive
 
const handleDriveUpload = async () => {
  if (!driveUrl) return;
  
  try {
    setIsUploading(true);
    
    // Créer une image temporaire pour l'aperçu
    // Utiliser une image placeholder pour l'aperçu
    const tempImage: PublicationImage = {
      imageUrl: "https://via.placeholder.com/400x300?text=Chargement+de+Google+Drive", // Placeholder
      displayOrder: images.length,
      caption: ""
    };
    
    // Ajouter temporairement l'image pour prévisualisation
    const updatedImagesTemp = [...images, tempImage];
    onChange(updatedImagesTemp);
    
    // Appeler le service pour récupérer l'URL directe
    const imageUrl = await fileUploadService.uploadFromDrive(driveUrl);
    
    // Remplacer l'URL temporaire par l'URL réelle
    const finalImages = updatedImagesTemp.map((img, idx) => {
      if (idx === images.length) {
        return {
          ...img,
          imageUrl: imageUrl
        };
      }
      return img;
    });
    
    onChange(finalImages);
    
    // Réinitialiser les états
    setDriveUrl("");
    setShowDriveInput(false);
    setUploadError(null);
  } catch (error) {
    console.error("Error with Google Drive URL:", error);
    setUploadError("Erreur avec l'URL Google Drive. Vérifiez que l'URL est valide et que l'image est partagée publiquement.");
    
    // Annuler l'ajout de l'image temporaire
    onChange(images);
  } finally {
    setIsUploading(false);
  }
};

  // Supprimer une image
  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);

    // Recalculer l'ordre d'affichage
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      displayOrder: i,
    }));

    onChange(reorderedImages);
  };

  // Gérer le drag & drop pour réordonner les images
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Mettre à jour les indices de l'ordre d'affichage
    const updatedItems = items.map((item, index) => ({
      ...item,
      displayOrder: index,
    }));

    onChange(updatedItems);
  };

  // Gérer la modification de la légende
  const handleSaveCaption = (index: number) => {
    const updatedImages = [...images];
    updatedImages[index] = {
      ...updatedImages[index],
      caption,
    };
    onChange(updatedImages);
    setShowCaptionInput(null);
    setCaption("");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700">
        Images additionnelles
      </h3>
      <p className="text-sm text-gray-500">
        Vous pouvez ajouter jusqu'à {maxImages} images supplémentaires à votre
        publication.
      </p>

      {/* Liste des images avec drag & drop */}
      {images.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="images">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {images.map((image, index) => (
                  <Draggable
                    key={`image-${index}`}
                    draggableId={`image-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
                      >
                        {/* Handle de drag */}
                        <div
                          {...provided.dragHandleProps}
                          className="text-gray-400 hover:text-gray-600 cursor-move p-2"
                        >
                          <Move className="w-5 h-5" />
                        </div>

                        {/* Aperçu de l'image */}
                        <div className="w-16 h-16 rounded-md overflow-hidden mr-4">
                          <img
                            src={image.imageUrl}
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Détails et actions */}
                        <div className="flex-1">
                          <div className="text-sm text-gray-700 truncate">
                            {image.caption || `Image ${index + 1}`}
                          </div>
                          <div className="text-xs text-gray-500">
                            Ordre d'affichage: {index + 1}
                          </div>

                          {/* Actions */}
                          <div className="mt-1 flex space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                setShowCaptionInput(index.toString());
                                setCaption(image.caption || "");
                              }}
                              className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <Edit2 className="w-3 h-3 mr-1" />
                              Légende
                            </button>
                          </div>

                          {/* Éditeur de légende */}
                          {showCaptionInput === index.toString() && (
                            <div className="mt-2 flex items-center">
                              <input
                                type="text"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                className="flex-1 text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-primary focus:border-primary"
                                placeholder="Ajouter une légende..."
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveCaption(index)}
                                className="ml-2 text-xs bg-primary text-white rounded-md px-2 py-1 hover:bg-primary-dark"
                              >
                                Enregistrer
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Bouton de suppression */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="ml-2 text-red-500 hover:text-red-700 p-2"
                          aria-label="Supprimer l'image"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Erreur d'upload */}
      {uploadError && (
        <div className="text-red-500 text-sm flex items-center bg-red-50 p-3 rounded-md">
          <X className="w-4 h-4 mr-2" />
          {uploadError}
        </div>
      )}

      {/* Barre de progression */}
      {isUploading && (
        <div className="mt-2">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 text-center">
            Téléchargement en cours... {uploadProgress}%
          </p>
        </div>
      )}

      {/* Boutons d'upload */}
      {images.length < maxImages && (
        <div className="flex flex-wrap gap-3 mt-4">
          {/* Upload direct */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              <Upload className="h-5 w-5 mr-2" />
              Ajouter une image
            </button>
          </div>

          {/* Google Drive */}
          {showDriveInput ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                placeholder="URL Google Drive"
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
              />
              <button
                type="button"
                onClick={handleDriveUpload}
                disabled={isUploading || !driveUrl}
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {isUploading ? (
                  <RotateCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowDriveInput(false)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowDriveInput(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <LinkIcon className="h-5 w-5 mr-2" />
              Depuis Google Drive
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageManager;
