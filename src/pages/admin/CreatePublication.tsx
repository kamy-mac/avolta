import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Image as ImageIcon,
  Send,
  Type,
  Bold,
  Italic,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Eye,
  Tag,
  Clock,
  Bell,
  User,
  Mail,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Info,
  Save,
  X,
  ArrowLeft,
  CheckCircle,
  Heading1,
  Heading2,
  Edit2,
  Upload,
} from "lucide-react";
import { Navigation, Pagination } from "swiper/modules";
import publicationService from "../../services/publication.service";
import { useAuth } from "../../context/AuthContext";
import fileUploadService from "../../services/fileUpload.service";
import ImageManager from "../../components/admin/ImageManager";
import { PublicationImage } from "../../types";
import { Swiper } from "swiper/react";

import { SwiperSlide } from "swiper/react";
// Guide d'utilisation pour le créateur de publication
const CreatePublicationGuide = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-sm border border-purple-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left"
      >
        <div className="flex items-center">
          <HelpCircle className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">
            Guide de création d'une publication
          </h3>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-purple-600 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="p-4 pt-0 text-sm text-gray-700 space-y-3">
          <p className="flex items-start">
            <Info className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>
              Utilisez ce formulaire pour créer des publications qui
              apparaîtront sur le site.
            </span>
          </p>

          <div className="pl-6 space-y-2">
            <p className="font-semibold text-purple-800">Instructions :</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <span className="font-medium">Titre et contenu</span> : Donnez
                un titre clair et rédigez un contenu détaillé pour votre
                publication.
              </li>
              <li>
                <span className="font-medium">Formatage</span> : Utilisez les
                outils de formatage (gras, italique, listes) pour améliorer la
                lisibilité.
              </li>
              <li>
                <span className="font-medium">Catégorie et tags</span> :
                Classifiez votre publication pour faciliter la recherche et la
                navigation.
              </li>
              <li>
                <span className="font-medium">Image</span> : Ajoutez une URL
                d'image pour rendre votre publication plus attrayante.
              </li>
              <li>
                <span className="font-medium">Dates de validité</span> :
                Définissez la période pendant laquelle la publication sera
                visible.
              </li>
              <li>
                <span className="font-medium">Newsletter</span> : Cochez
                l'option pour envoyer automatiquement votre publication aux
                abonnés.
              </li>
              <li>
                <span className="font-medium">Prévisualisation</span> : Utilisez
                le bouton <Eye className="h-4 w-4 inline text-purple-600" />{" "}
                pour vérifier l'apparence avant publication.
              </li>
            </ul>
          </div>

          <div className="pl-6 mt-3">
            <p className="font-semibold text-purple-800">
              Processus de validation :
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                Les publications créées par les administrateurs sont soumises à
                validation par un super administrateur.
              </li>
              <li>
                Les publications créées par les super administrateurs sont
                publiées immédiatement.
              </li>
              <li>
                Une fois publiée, votre publication sera visible pendant la
                période définie.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

interface PublicationForm {
  title: string;
  content: string;
  imageUrl: string;
  validFrom: string;
  validTo: string;
  category: string;
  sendNewsletter: boolean;
  tags: string[];
  authorName: string;
  authorEmail: string;
}

export default function CreatePublication() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [publication, setPublication] = useState<PublicationForm>({
    title: "",
    content: "",
    imageUrl: "",
    validFrom: new Date().toISOString().split("T")[0], // Format YYYY-MM-DD
    validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // Par défaut: 30 jours
    category: "news",
    sendNewsletter: false,
    tags: [],
    authorName: user?.username || "",
    authorEmail: user?.email || "",
  });

  // States for image upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [previewMode, setPreviewMode] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [contentWarning, setContentWarning] = useState<string | null>(null);

  // References
  const fileInputRef = useRef<HTMLInputElement>(null);

  //ajouter un état pour les images multiples
  const [publicationImages, setPublicationImages] = useState<
    PublicationImage[]
  >([]);

  // État pour suivre les prévisualisations d'images
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<
    Array<{ url: string; caption?: string }>
  >([]);

  // Effect to redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: { from: "/admin/publications/create" },
      });
    }
  }, [user, navigate]);

  const handleFilePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Créer une URL de prévisualisation
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Garder la référence au fichier pour l'upload ultérieur
    setSelectedFile(file);
  };

  // Fonction pour la prévisualisation d'URL d'image
  const handleUrlPreview = (url: string) => {
    if (!url) return;

    // Vérifier si l'URL est valide
    const img = new Image();
    img.onload = () => {
      setImagePreview(url);
      setPublication((prev) => ({
        ...prev,
        imageUrl: url,
      }));
    };
    img.onerror = () => {
      setError(
        "L'URL d'image fournie n'est pas valide ou n'est pas accessible."
      );
    };
    img.src = url;
  };

  // Handle image file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // D'abord afficher la prévisualisation
    handleFilePreview(e);

    try {
      setIsUploading(true);
      setUploadProgress(10);

      // Simuler une progression
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 300);

      // Upload du fichier
      if (selectedFile) {
        const uploadedUrl = await fileUploadService.uploadFile(selectedFile);

        // Mettre à jour l'URL dans le formulaire
        setPublication((prev) => ({
          ...prev,
          imageUrl: uploadedUrl,
        }));

        setUploadSuccess(true);
        clearInterval(progressInterval);
        setUploadProgress(100);
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setUploadError(
        error.message || "Erreur lors du téléchargement de l'image"
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Handle upload button click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImagePreview(null);
    setUploadProgress(0);
    setUploadSuccess(false);
    setUploadError(null);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Réinitialiser l'URL de l'image
    setPublication((prev) => ({
      ...prev,
      imageUrl: "",
    }));
  };

  // Upload image to server
  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    try {
      setIsUploading(true);
      setUploadProgress(10);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Upload the file using the file upload service
      const imageUrl = await fileUploadService.uploadFile(selectedFile);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadSuccess(true);

      return imageUrl;
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setUploadError(
        "Erreur lors du téléchargement de l'image. Veuillez réessayer."
      );
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Vérification du contenu lors de la modification
  const checkContent = (content: string) => {
    if (content.length > 0 && content.length < 50) {
      setContentWarning(
        "Le contenu est un peu court. Envisagez d'ajouter plus d'informations pour une meilleure communication."
      );
    } else {
      setContentWarning(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setSuccess(null);

    try {
      // Validation des dates
      const validFromDate = new Date(publication.validFrom);
      const validToDate = new Date(publication.validTo);

      if (validToDate <= validFromDate) {
        throw new Error(
          "La date de fin doit être postérieure à la date de début."
        );
      }

      // Formatage au format ISO (YYYY-MM-DDTHH:mm:ss.sssZ) que le backend peut parser en LocalDateTime
      // const formattedValidFrom = validFromDate.toISOString();
      // const formattedValidTo = validToDate.toISOString();

      // D'abord télécharger l'image s'il y en a une sélectionnée
      let finalImageUrl = publication.imageUrl;

      if (selectedFile && !uploadSuccess) {
        const uploadedImageUrl = await uploadImage();
        if (uploadedImageUrl) {
          finalImageUrl = uploadedImageUrl;
        } else if (!publication.imageUrl) {
          // Si le téléchargement a échoué et qu'il n'y a pas d'URL de secours, afficher une erreur
          throw new Error(
            "Le téléchargement de l'image a échoué. Veuillez réessayer."
          );
        }
      }

      console.log("Creating publication with image:", finalImageUrl);

      const createdPublication = await publicationService.createPublication({
        title: publication.title,
        content: publication.content,
        imageUrl: publication.imageUrl || finalImageUrl,

        validFrom: new Date(publication.validFrom).toISOString(),
        validTo: new Date(publication.validTo).toISOString(),
        category: publication.category,
        sendNewsletter: publication.sendNewsletter,
        images: publicationImages,

        // authorName: publication.authorName
      });

      setSuccess("Publication créée avec succès!");
      console.log("Publication created:", createdPublication);

      if (user?.role === "admin") {
        setSuccess(
          "Votre publication a été soumise et est en attente de validation par un super administrateur."
        );
      }

      // Redirection après un court délai
      setTimeout(() => {
        navigate("/admin/publications");
      }, 2000);
    } catch (error: any) {
      console.error("Error creating publication:", error);
      setError(
        error.response?.data?.message ||
          "Une erreur est survenue lors de la création de la publication."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setPublication((prev) => ({ ...prev, [name]: value }));

    if (name === "imageUrl" && value) {
      setImagePreview(value);
    }

    if (name === "content") {
      checkContent(value);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPublication((prev) => ({ ...prev, [name]: checked }));
  };

  // URL input change handler
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPublication((prev) => ({
      ...prev,
      imageUrl: value,
    }));

    // Prévisualiser l'image si l'URL n'est pas vide
    if (value) {
      // Créer une image pour tester l'URL
      const img = new Image();
      img.onload = () => {
        setImagePreview(value);
      };
      img.onerror = () => {
        // Ne pas effacer la prévisualisation actuelle en cas d'erreur
        console.error("Invalid image URL:", value);
      };
      img.src = value;
    } else {
      setImagePreview(null);
    }
  };

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Handle adding a new tag when the user presses Enter.
   *
   * Prevents the default form submission, and adds the new tag to the publication
   * if it's not already there.
   * @param {React.KeyboardEvent<HTMLInputElement>} e
   */
  /*******  cb2cc4c1-4926-48ab-9807-92ba9ef94ae4  *******/
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      if (!publication.tags.includes(newTag.trim())) {
        setPublication((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag.trim()],
        }));
      }
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPublication((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-BE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toolbarButtons = [
    { icon: Bold, label: "Gras", format: "**" },
    { icon: Italic, label: "Italique", format: "*" },
    { icon: Heading1, label: "Titre de niveau 1", format: "# " },
    { icon: Heading2, label: "Titre de niveau 2", format: "## " },
    { icon: Quote, label: "Citation", format: "> " },
    { icon: List, label: "Liste à puces", format: "- " },
    { icon: ListOrdered, label: "Liste numérotée", format: "1. " },
    { icon: LinkIcon, label: "Lien", format: "[texte](url)" },
  ];

  const handleFormat = (format: string) => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let formattedText = "";

    if (format === "[texte](url)") {
      formattedText = selectedText ? `[${selectedText}](url)` : format;
    } else if (format.startsWith("#") || format.endsWith(" ")) {
      // Pour les titres et listes
      formattedText = format + selectedText;
    } else {
      formattedText = `${format}${selectedText}${format}`;
    }

    const newContent =
      textarea.value.substring(0, start) +
      formattedText +
      textarea.value.substring(end);
    setPublication((prev) => ({ ...prev, content: newContent }));

    // Vérifier le contenu
    checkContent(newContent);

    // Reset selection
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + formattedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  // Fonction pour formater le contenu Markdown pour la prévisualisation
  const formatMarkdown = (text: string) => {
    // C'est une version simplifiée, dans un cas réel on utiliserait une bibliothèque comme marked
    let formattedText = text;

    // Gras
    formattedText = formattedText.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

    // Italique
    formattedText = formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Titres
    formattedText = formattedText.replace(
      /^# (.*?)$/gm,
      '<h1 class="text-3xl font-bold mb-4">$1</h1>'
    );
    formattedText = formattedText.replace(
      /^## (.*?)$/gm,
      '<h2 class="text-2xl font-bold mb-3">$1</h2>'
    );

    // Citations
    formattedText = formattedText.replace(
      /^> (.*?)$/gm,
      '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">$1</blockquote>'
    );

    // Liens
    formattedText = formattedText.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" class="text-purple-600 hover:underline">$1</a>'
    );

    // Listes à puces
    formattedText = formattedText.replace(
      /^- (.*?)$/gm,
      '<li class="ml-5">$1</li>'
    );

    // Listes numérotées (simplifié)
    formattedText = formattedText.replace(
      /^\d\. (.*?)$/gm,
      '<li class="ml-5">$1</li>'
    );

    // Sauts de ligne
    formattedText = formattedText.replace(/\n/g, "<br />");

    return formattedText;
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Voulez-vous vraiment annuler ? Les modifications non enregistrées seront perdues."
      )
    ) {
      navigate("/admin/publications");
    }
  };

  const handleSaveDraft = () => {
    // Implémentation fictive pour sauvegarder un brouillon
    localStorage.setItem("publicationDraft", JSON.stringify(publication));
    alert("Brouillon sauvegardé avec succès!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Créer une publication
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 text-sm font-medium text-white bg-[#6A0DAD] rounded-md hover:bg-[#5a0b91] transition-colors flex items-center shadow-sm"
            title={
              previewMode
                ? "Retourner à l'édition"
                : "Prévisualiser la publication"
            }
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? "Éditer" : "Prévisualiser"}
          </button>
        </div>
      </div>

      {/* Guide d'utilisation */}
      <CreatePublicationGuide />

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 flex items-start">
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2" />
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {previewMode ? (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex justify-between">
              <div className="text-gray-500 text-sm flex items-center">
                <Eye className="w-4 h-4 mr-1" /> Mode prévisualisation
              </div>
              <button
                onClick={() => setPreviewMode(false)}
                className="text-[#6A0DAD] hover:text-[#5a0b91] text-sm flex items-center"
              >
                <Edit2 className="w-4 h-4 mr-1" /> Modifier
              </button>
            </div>
          </div>

          {/* En-tête avec catégorie et infos */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-2">
                {publication.category === "news"
                  ? "Actualités"
                  : publication.category === "events"
                  ? "Événements"
                  : "Communiqués de presse"}
              </span>
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {publication.validFrom &&
                    `Du ${formatDate(publication.validFrom)}`}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {publication.validTo &&
                    `au ${formatDate(publication.validTo)}`}
                </span>
                {publication.sendNewsletter && (
                  <span className="flex items-center">
                    <Bell className="w-4 h-4 mr-1" />
                    Newsletter
                  </span>
                )}
              </div>
            </div>
            {publication.authorName && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Publié par:</p>
                <p className="font-medium">{publication.authorName}</p>
              </div>
            )}
          </div>

          {/* Carrousel d'images en prévisualisation */}
          {/* Prévisualisation des images */}
          <div className="relative mb-6">
            {previewMode && (
              <div className="flex justify-between mb-4">
                <div className="text-gray-500 text-sm flex items-center">
                  <Eye className="w-4 h-4 mr-1" /> Mode prévisualisation
                </div>
                <button
                  onClick={() => setPreviewMode(false)}
                  className="text-primary hover:text-primary-dark text-sm flex items-center"
                >
                  <Edit2 className="w-4 h-4 mr-1" /> Modifier
                </button>
              </div>
            )}

            {/* Image principale ou première image additionnelle comme principale */}
            {imagePreview || publicationImages.length > 0 ? (
              <div>
                {publicationImages.length > 1 ? (
                  /* Utiliser Swiper s'il y a plus d'une image */
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    className="rounded-lg overflow-hidden shadow-md h-64"
                  >
                    {/* Image principale d'abord */}
                    {imagePreview && (
                      <SwiperSlide>
                        <img
                          src={imagePreview}
                          alt="Image principale"
                          className="w-full h-full object-cover"
                        />
                      </SwiperSlide>
                    )}

                    {/* Images additionnelles */}
                    {publicationImages.map((image, index) => (
                      <SwiperSlide key={`preview-image-${index}`}>
                        <img
                          src={image.imageUrl}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {image.caption && (
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-sm">
                            {image.caption}
                          </div>
                        )}
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  /* Afficher l'image simple s'il n'y en a qu'une */
                  <div className="relative h-64 rounded-lg overflow-hidden shadow-md">
                    <img
                      src={imagePreview || publicationImages[0]?.imageUrl}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                    />
                    {publicationImages[0]?.caption && (
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-sm">
                        {publicationImages[0]?.caption}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </div>
          {/* Tags */}
          {publication.tags.length > 0 && (
            <div className="flex items-center space-x-2 mb-4">
              {publication.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Titre et contenu */}
          <h2 className="text-2xl font-bold mb-4">
            {publication.title || "Titre de la publication"}
          </h2>
          <div
            className="prose max-w-none mb-6"
            dangerouslySetInnerHTML={{
              __html:
                formatMarkdown(publication.content) ||
                "Contenu de la publication...",
            }}
          ></div>

          {/* Boutons de navigation */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              onClick={() => setPreviewMode(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'édition
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6A0DAD] hover:bg-[#5a0b91] transition-colors disabled:opacity-70"
            >
              <Send className="w-4 h-4 mr-2" />
              Publier
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Nav tabs for form sections */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                type="button"
                className="px-4 py-2 border-b-2 border-[#6A0DAD] text-[#6A0DAD] font-medium"
              >
                Informations générales
              </button>
            </div>

            {/* Author Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="authorName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nom de l'auteur
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="authorName"
                    name="authorName"
                    value={publication.authorName}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#6A0DAD] focus:border-[#6A0DAD] pl-10"
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label
                  htmlFor="authorEmail"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email de l'auteur
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="authorEmail"
                    name="authorEmail"
                    value={publication.authorEmail}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#6A0DAD] focus:border-[#6A0DAD] pl-10 bg-gray-50"
                    readOnly
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  L'email est automatiquement défini par votre compte
                </p>
              </div>
            </div>

            {/* Title Section */}
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Titre <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={publication.title}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#6A0DAD] focus:border-[#6A0DAD] pl-10"
                  required
                  placeholder="Titre de votre publication (obligatoire)"
                />
                <Type className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Category and Tags Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={publication.category}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#6A0DAD] focus:border-[#6A0DAD] pl-10"
                    required
                  >
                    <option value="news">Actualités</option>
                    <option value="events">Événements</option>
                    <option value="press">Communiqués de presse</option>
                  </select>
                  <Tag className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (facultatif)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Appuyez sur Entrée pour ajouter"
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#6A0DAD] focus:border-[#6A0DAD] pl-10"
                  />
                  <Tag className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {publication.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-purple-600 hover:text-purple-900"
                        aria-label={`Supprimer le tag ${tag}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="mb-6">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contenu <span className="text-red-500">*</span>
              </label>
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b">
                  {toolbarButtons.map((button, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleFormat(button.format)}
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title={button.label}
                    >
                      <button.icon className="w-5 h-5" />
                    </button>
                  ))}
                  <div className="h-6 w-px bg-gray-300 mx-2" />
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Aligner à gauche"
                    onClick={() => handleFormat("align-left")}
                  >
                    <AlignLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Centrer"
                    onClick={() => handleFormat("align-center")}
                  >
                    <AlignCenter className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Aligner à droite"
                    onClick={() => handleFormat("align-right")}
                  >
                    <AlignRight className="w-5 h-5" />
                  </button>
                </div>
                <textarea
                  id="content"
                  name="content"
                  rows={12}
                  value={publication.content}
                  onChange={handleInputChange}
                  className="block w-full border-0 focus:ring-0 p-4"
                  required
                  placeholder="Saisissez le contenu de votre publication..."
                />
              </div>
              {contentWarning && (
                <div className="mt-2 text-amber-600 text-sm flex items-start">
                  <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                  {contentWarning}
                </div>
              )}
            </div>

            {/* Image Section with Upload and URL options */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-primary" />
                Images de la publication
              </h3>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-700 mb-2">
                    Image principale
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Cette image sera utilisée comme couverture de votre
                    publication.
                  </p>

                  {/* Options d'upload */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Option 1: Upload direct */}
                    <div className="bg-white p-4 rounded-md border border-gray-200 h-full">
                      <h5 className="font-medium text-gray-700 mb-2">
                        Option 1: Télécharger une image
                      </h5>
                      <div className="space-y-3">
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
                          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <Upload className="h-5 w-5 mr-2 text-gray-500" />
                          Sélectionner un fichier
                        </button>

                        {selectedFile && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                            {selectedFile.name}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Option 2: URL */}
                    <div className="bg-white p-4 rounded-md border border-gray-200 h-full">
                      <h5 className="font-medium text-gray-700 mb-2">
                        Option 2: URL d'image
                      </h5>
                      <div className="space-y-3">
                        <div className="relative">
                          <input
                            type="url"
                            name="imageUrl"
                            id="imageUrl"
                            value={publication.imageUrl}
                            onChange={handleUrlChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            placeholder="https://example.com/image.jpg"
                            disabled={!!selectedFile || isUploading}
                          />
                          <LinkIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleUrlPreview(publication.imageUrl)}
                          disabled={!publication.imageUrl || isUploading}
                          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          <Eye className="h-5 w-5 mr-2 text-gray-500" />
                          Prévisualiser
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Affichage de la prévisualisation */}
                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Prévisualisation:
                      </p>
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={imagePreview}
                          alt="Prévisualisation"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setSelectedFile(null);
                            setPublication((prev) => ({
                              ...prev,
                              imageUrl: "",
                            }));
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                        >
                          <X className="h-5 w-5 text-gray-700" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Indicateurs d'état */}
                  {uploadError && (
                    <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-md flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      {uploadError}
                    </div>
                  )}

                  {isUploading && (
                    <div className="mt-3">
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

                  {uploadSuccess && (
                    <div className="mt-3 text-sm text-green-600 bg-green-50 p-3 rounded-md flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      Image téléchargée avec succès
                    </div>
                  )}
                </div>

                {/* Séparateur */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Images additionnelles */}
                <div>
                  <ImageManager
                    images={publicationImages}
                    onChange={setPublicationImages}
                    maxImages={3}
                  />
                </div>
              </div>
            </div>

            {/* Date Range Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="validFrom"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Date de début <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="validFrom"
                    name="validFrom"
                    value={publication.validFrom}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#6A0DAD] focus:border-[#6A0DAD] pl-10"
                    required
                  />
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label
                  htmlFor="validTo"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Date de fin <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="validTo"
                    name="validTo"
                    value={publication.validTo}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#6A0DAD] focus:border-[#6A0DAD] pl-10"
                    required
                  />
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Newsletter Option */}
            <div className="flex items-center space-x-3 mb-6 p-3 bg-purple-50 rounded-lg">
              <input
                type="checkbox"
                id="sendNewsletter"
                name="sendNewsletter"
                checked={publication.sendNewsletter}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-[#6A0DAD] focus:ring-[#6A0DAD] border-gray-300 rounded"
              />
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-purple-600 mr-2" />
                <div>
                  <label
                    htmlFor="sendNewsletter"
                    className="text-sm font-medium text-gray-700"
                  >
                    Envoyer par newsletter aux abonnés
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Cette option enverra automatiquement un email aux personnes
                    inscrites à la newsletter
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <X className="h-5 w-5 mr-2 text-gray-500" />
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Save className="h-5 w-5 mr-2 text-gray-500" />
                  Sauvegarder brouillon
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Eye className="h-5 w-5 mr-2 text-gray-500" />
                  Prévisualiser
                </button>
                <button
                  type="submit"
                  disabled={isLoading || isUploading}
                  className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6A0DAD] hover:bg-[#5a0b91] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A0DAD] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
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
                      Publication en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Publier
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
