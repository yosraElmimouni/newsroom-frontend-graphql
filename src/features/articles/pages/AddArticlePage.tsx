import { useState, type SyntheticEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../core/auth/useAuth";
import type { ArticleStatus } from "../types";
import {
  CATEGORY_OPTIONS,
  STATUS_LABEL,
} from "../data/mockArticle";

import {
  useArticleById,
  useCreateArticle,
  useUpdateArticle,
} from "../data/articlesData";
function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function AddArticlePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { article, error } = useArticleById(Number(id));
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState(article?.titre ?? "");
  const [category, setCategory] = useState(article?.categorie ?? "");
  const [status, setStatus] = useState<ArticleStatus>("Brouillon");
  const [publishDate, setPublishDate] = useState(todayIso());
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState(article?.contenu ?? "");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tags, setTags] = useState<string[]>(article?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [createArticle, { loading: creating, error: createError }] =
    useCreateArticle();
  const [updateArticle, { loading: updating, error: updateError }] =
    useUpdateArticle();
  const loading = creating || updating;
  const mutationError = createError || updateError;

  async function saveArticle(targetStatus: ArticleStatus) {
    try {
      if (isEditMode) {
        await updateArticle({
          variables: {
            updateArticleInput: {
              id: Number(id),
              titre: title,
              contenu: content,
              statut: targetStatus,
              categorie: category || null,
              tags,
              datePublication:
                targetStatus === "Publié"
                  ? new Date()
                  : publishDate
                    ? new Date(publishDate)
                    : undefined,
            },
          },
        });
      } else {
        if (!user?.id) {
          console.error(
            "Utilisateur non identifié — impossible de créer un article",
          );
          return;
        }
        await createArticle({
          variables: {
            createArticleInput: {
              titre: title,
              contenu: content,
              statut: targetStatus,
              categorie: category || null,
              tags,
              auteurId: user.id,
            },
          },
        });
      }
      setStatus(targetStatus);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de l'article", err);
    }
  }

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    saveArticle("Brouillon");
  }

  // function handlePublish() {
  //   saveArticle("Publié");
  // }

  function handleSendForReview() {
    saveArticle("EnCoursDeValidation");
  }

  function addTag() {
    const tag = tagInput.trim();
    if (!tag) return;
    if (tags.includes(tag)) return;
    setTags([...tags, tag]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  }

  if (isSubmitted) {
    return (
      <div className="page">
        <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="mb-1 text-base font-semibold text-gray-900">
            Article créé
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            « {title || "Sans titre"} » a été enregistré en tant que{" "}
            {STATUS_LABEL[status].toLowerCase()}.
          </p>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/articles")}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Retour aux articles
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setTitle("");
                setCategory("");
                setSummary("");
                setContent("");
                setStatus("Brouillon");
                setPublishDate(todayIso());
                setTags([]);
              }}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Ajouter un autre article
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div>
        <Link
          to="/articles"
          className="mb-1 inline-block text-xs font-medium text-gray-500 hover:text-gray-700"
        >
          ← Retour aux articles
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Nouvel article</h1>
        <p className="text-sm text-gray-500">
          Rédiger et classer un nouvel article dans le pipeline éditorial.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="article-form-layout">
        {/* Colonne principale : contenu rédactionnel */}
        <div className="article-form-main">
          <div className="mb-4">
            <label htmlFor="title" className="mb-1 block text-sm text-gray-700">
              Titre
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex. Rentrée scolaire en Occitanie"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* <div className="mb-4">
            <label htmlFor="summary" className="mb-1 block text-sm text-gray-700">
              Chapô / résumé
            </label>
            <textarea
              id="summary"
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Un court résumé accrocheur de l'article"
              className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div> */}

          <div>
            <label
              htmlFor="content"
              className="mb-1 block text-sm text-gray-700"
            >
              Contenu
            </label>
            <textarea
              id="content"
              rows={14}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Corps de l'article..."
              className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Sidebar : métadonnées de classement */}
        <aside className="article-form-sidebar">
          <div className="form-sidebar-card">
            <h2 className="sidebar-card-title">Classement</h2>

            <div className="mb-3">
              <label
                htmlFor="category"
                className="mb-1 block text-xs text-gray-500"
              >
                Catégorie
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Non classé</option>
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* <div className="mb-3">
              <label htmlFor="status" className="mb-1 block text-xs text-gray-500">
                Statut
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ArticleStatus)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {STATUS_LABEL[option]}
                  </option>
                ))}
              </select>
            </div> */}

            {/* <div className="mb-3">
              <label htmlFor="publishDate" className="mb-1 block text-xs text-gray-500">
                Date de publication prévue
              </label>
              <input
                id="publishDate"
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div> */}

            {/* <div>
              <label htmlFor="author" className="mb-1 block text-xs text-gray-500">
                Auteur
              </label>
              <input
                id="author"
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div> */}
          </div>

          <div className="form-sidebar-card">
            <h2 className="sidebar-card-title">Tags</h2>
            <div className="flex gap-2">
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Ajouter un tag"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addTag}
                className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
              >
                +
              </button>
            </div>

            {tags.length > 0 && (
              <div className="mt-3 tag-pill-list">
                {tags.map((tag) => (
                  <span key={tag} className="tag-pill-editable">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      aria-label={`Retirer ${tag}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </aside>

        <div className="article-form-actions">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Enregistrement..." : "Enregistrer comme brouillon"}
          </button>

          <button
            type="button"
            onClick={handleSendForReview}
            disabled={loading}
            className="rounded-md border border-amber-500 px-4 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 disabled:opacity-50"
          >
            Envoyer pour révision
          </button>
          <Link
            to="/articles"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
