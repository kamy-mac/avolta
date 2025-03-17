import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  Image as ImageIcon,
  Save,
  Type,
  Bold,
  Italic,
  Underline,
  ArrowLeft,
} from "lucide-react";
import publicationService from "../../services/publication.service";
import { useTranslation } from "react-i18next";
import { Post } from "../../types";

export default function EditPublication() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [publication, setPublication] = useState<Post | null>(null);

  useEffect(() => {
    const loadPublication = async () => {
      try {
        const publications = await publicationService.getAllPublications();
        const found = publications.find((p) => p.id === id);
        if (found) {
          setPublication(found);
        } else {
          navigate("/admin/publications");
        }
      } catch (error) {
        console.error("Error loading publication:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPublication();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publication) return;

    try {
      await publicationService.updatePublication(publication.id, {
        title: publication.title,
        content: publication.content,
        imageUrl: publication.imageUrl,
        validFrom: publication.validFrom.toString(),
        validTo: publication.validTo.toString(),
        category: publication.category,
      });
      navigate("/admin/publications");
    } catch (error) {
      console.error("Error updating publication:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setPublication((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleFormat = (format: string) => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement;
    if (!textarea || !publication) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let formattedText = "";

    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        break;
      case "underline":
        formattedText = `_${selectedText}_`;
        break;
      default:
        return;
    }

    const newContent =
      textarea.value.substring(0, start) +
      formattedText +
      textarea.value.substring(end);
    setPublication((prev) => (prev ? { ...prev, content: newContent } : null));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, end + 2);
    }, 0);
  };

  if (isLoading || !publication) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate("/admin/publications")}
          className="mr-4 text-gray-600 hover:text-[#6A0DAD]"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          Modifier la publication
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white rounded-lg shadow-lg p-6"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Titre
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Type className="h-5 w-5" />
            </span>
            <input
              type="text"
              id="title"
              name="title"
              value={publication.title}
              onChange={handleInputChange}
              className="flex-1 block w-full rounded-none rounded-r-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Catégorie
          </label>
          <select
            id="category"
            name="category"
            value={publication.category}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
          >
            <option value="news">{t("news.category.news")}</option>
            <option value="events">{t("news.category.events")}</option>
            <option value="press">{t("news.category.press")}</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Contenu
          </label>
          <div className="mb-2 flex space-x-2">
            <button
              type="button"
              onClick={() => handleFormat("bold")}
              className="p-2 rounded hover:bg-gray-100"
              title="Gras"
            >
              <Bold className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleFormat("italic")}
              className="p-2 rounded hover:bg-gray-100"
              title="Italique"
            >
              <Italic className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleFormat("underline")}
              className="p-2 rounded hover:bg-gray-100"
              title="Souligné"
            >
              <Underline className="w-5 h-5" />
            </button>
          </div>
          <textarea
            id="content"
            name="content"
            rows={6}
            value={publication.content}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            required
          />
        </div>

        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-gray-700"
          >
            URL de l'image
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <ImageIcon className="h-5 w-5" />
            </span>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={publication.imageUrl}
              onChange={handleInputChange}
              className="flex-1 block w-full rounded-none rounded-r-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="validFrom"
              className="block text-sm font-medium text-gray-700"
            >
              Date de début
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                <Calendar className="h-5 w-5" />
              </span>
              <input
                type="date"
                id="validFrom"
                name="validFrom"
                value={
                  new Date(publication.validFrom).toISOString().split("T")[0]
                }
                onChange={handleInputChange}
                className="flex-1 block w-full rounded-none rounded-r-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="validTo"
              className="block text-sm font-medium text-gray-700"
            >
              Date de fin
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                <Calendar className="h-5 w-5" />
              </span>
              <input
                type="date"
                id="validTo"
                name="validTo"
                value={
                  new Date(publication.validTo).toISOString().split("T")[0]
                }
                onChange={handleInputChange}
                className="flex-1 block w-full rounded-none rounded-r-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6A0DAD] hover:bg-[#5a0b91] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A0DAD]"
          >
            <Save className="h-5 w-5 mr-2" />
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
}
