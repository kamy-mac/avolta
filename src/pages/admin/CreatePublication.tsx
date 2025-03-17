import React, { useState } from "react";
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
} from "lucide-react";
import publicationService from "../../services/publication.service";
import { useAuth } from "../../context/AuthContext";

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
    validFrom: "",
    validTo: "",
    category: "news",
    sendNewsletter: false,
    tags: [],
    authorName: "",
    authorEmail: user?.email || "",
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await publicationService.createPublication({
        title: publication.title,
        content: publication.content,
        imageUrl: publication.imageUrl,
        validFrom: publication.validFrom,
        validTo: publication.validTo,
        category: publication.category,
        sendNewsletter: publication.sendNewsletter,
      });
      if (user?.role === "admin") {
        alert(
          "Votre publication a été soumise et est en attente de validation par un super administrateur."
        );
      }
      navigate("/admin/publications");
    } catch (error) {
      console.error("Error creating publication:", error);
      alert("Une erreur est survenue lors de la création de la publication.");
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
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPublication((prev) => ({ ...prev, [name]: checked }));
  };

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
    } else if (format.endsWith(" ")) {
      // For lists
      formattedText = format + selectedText;
    } else {
      formattedText = `${format}${selectedText}${format}`;
    }

    const newContent =
      textarea.value.substring(0, start) +
      formattedText +
      textarea.value.substring(end);
    setPublication((prev) => ({ ...prev, content: newContent }));

    // Reset selection
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + formattedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Créer une publication
        </h1>
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className="px-4 py-2 text-sm font-medium text-white bg-[#6A0DAD] rounded-md hover:bg-[#5a0b91] transition-colors flex items-center"
        >
          <Eye className="w-4 h-4 mr-2" />
          {previewMode ? "Éditer" : "Prévisualiser"}
        </button>
      </div>

      {previewMode ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          {imagePreview && (
            <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
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
          <h2 className="text-2xl font-bold mb-4">
            {publication.title || "Titre de la publication"}
          </h2>
          <div className="prose max-w-none mb-6">
            {publication.content || "Contenu de la publication..."}
          </div>
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {publication.validFrom &&
                `Du ${formatDate(publication.validFrom)}`}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {publication.validTo && `au ${formatDate(publication.validTo)}`}
            </span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
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
                    required
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
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#6A0DAD] focus:border-[#6A0DAD] pl-10"
                    required
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Title Section */}
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Titre
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
                  Catégorie
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={publication.category}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#6A0DAD] focus:border-[#6A0DAD] pl-10"
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
                  Tags
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
                Contenu
              </label>
              <div className="border rounded-lg overflow-hidden">
                <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b">
                  {toolbarButtons.map((button, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleFormat(button.format)}
                      className="p-2 hover:bg-gray-200 rounded"
                      title={button.label}
                    >
                      <button.icon className="w-5 h-5" />
                    </button>
                  ))}
                  <div className="h-6 w-px bg-gray-300 mx-2" />
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Aligner à gauche"
                  >
                    <AlignLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Centrer"
                  >
                    <AlignCenter className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Aligner à droite"
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
                />
              </div>
            </div>

            {/* Image Section */}
            <div className="mb-6">
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Image
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={publication.imageUrl}
                  onChange={handleInputChange}
                  placeholder="URL de l'image"
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#6A0DAD] focus:border-[#6A0DAD] pl-10"
                />
                <ImageIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {imagePreview && (
                <div className="mt-2 relative h-40 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Date Range Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="validFrom"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Date de début
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
                  Date de fin
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
            <div className="flex items-center space-x-3 mb-6">
              <input
                type="checkbox"
                id="sendNewsletter"
                name="sendNewsletter"
                checked={publication.sendNewsletter}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-[#6A0DAD] focus:ring-[#6A0DAD] border-gray-300 rounded"
              />
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-gray-400 mr-2" />
                <label
                  htmlFor="sendNewsletter"
                  className="text-sm text-gray-700"
                >
                  Envoyer par newsletter aux abonnés
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#6A0DAD] hover:bg-[#5a0b91] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A0DAD] transition-colors"
              >
                <Send className="h-5 w-5 mr-2" />
                Publier
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
