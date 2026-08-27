import {
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type SyntheticEvent,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../core/auth/useAuth";
import {
  useCreateMedia,
  useMediaById,
  useUpdateMedia,
} from "../data/mediasData";
import { useArticles } from "../../articles/data/articlesData";
import { uploadToCloudinary } from "../../../core/api/cloudinary";

type MediaType = "Image" | "Video" | "Audio";

const TYPE_OPTIONS: {
  value: MediaType;
  label: string;
  accept: string;
  hint: string;
}[] = [
  {
    value: "Image",
    label: "Image",
    accept: "image/*",
    hint: "JPG, PNG ou WEBP — 20 Mo max",
  },
  {
    value: "Video",
    label: "Vidéo",
    accept: "video/*",
    hint: "MP4 ou MOV — 500 Mo max",
  },
  {
    value: "Audio",
    label: "Audio",
    accept: "audio/*",
    hint: "MP3 ou WAV — 100 Mo max",
  },
];

function toInputDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fromInputDate(value: string): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function AddMediaPage() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { articles } = useArticles();

  const [type, setType] = useState<MediaType>("Image");
  const [file, setFile] = useState<File | null>(null);
  const [urlFichier, setUrlFichier] = useState("");
  const [titre, settitre] = useState("");
  const [description, setDescription] = useState("");
  const [linkedArticleId, setLinkedArticleId] = useState<number | "">("");
  const [localisation, setLocalisation] = useState("");
  const [dateCapture, setDateCapture] = useState<Date | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const {
    media,
    loading: mediaLoading,
    error: mediaError,
  } = useMediaById(Number(id));
  const [createMedia, { loading: creating, error: createError }] =
    useCreateMedia();
  const [updateMedia, { loading: updating, error: updateError }] =
    useUpdateMedia();

  const saving = creating || updating;
  const currentTypeOption = TYPE_OPTIONS.find(
    (option) => option.value === type,
  )!;

  useEffect(() => {
    if (!media) return;
    setType(media.type as MediaType);
    setUrlFichier(media.urlFichier ?? "");
    settitre(media.titre ?? "");
    setDescription(media.description ?? "");
    setLocalisation(media.localisation ?? "");
    setDateCapture(media.dateCapture ? new Date(media.dateCapture) : null);
    setLinkedArticleId(media.article?.id ?? "");
  }, [media]);

  useEffect(() => {
    if (!file) {
      setFilePreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setFilePreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  function handleTypeChange(nextType: MediaType) {
    setType(nextType);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  }

  async function saveMedia() {
    setFormError("");

    if (!user?.id) {
      setFormError(
        "Utilisateur non identifié — impossible d'enregistrer le média.",
      );
      return;
    }
    if (!isEditMode && !file) {
      setFormError("Veuillez sélectionner un fichier.");
      return;
    }

    try {
      let finalUrl = urlFichier;

      if (file) {
        setUploading(true);
        finalUrl = await uploadToCloudinary(file, type);
        setUploading(false);
      }

      const payload = {
        type,
        urlFichier: finalUrl,
        titre,
        description,
        localisation,
        dateCapture,
        articleId: linkedArticleId || null,
        userId: user.id,
      };

      if (isEditMode) {
        await updateMedia({
          variables: { updateMediaInput: { id: Number(id), ...payload } },
        });
      } else {
        await createMedia({ variables: { createMediaInput: payload } });
      }
      setIsSubmitted(true);
    } catch (err) {
      setUploading(false);
      console.error("Erreur lors de l'enregistrement du média", err);
      setFormError(
        err instanceof Error
          ? err.message
          : "L'enregistrement a échoué. Veuillez réessayer.",
      );
    }
  }

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    saveMedia();
  }

  function resetForm() {
    setIsSubmitted(false);
    settitre("");
    setDescription("");
    setLinkedArticleId("");
    setLocalisation("");
    setDateCapture(null);
    setFile(null);
    setUrlFichier("");
  }
  function toDownloadUrl(url: string): string {
    if (!url) return url;
    if (url.includes("/upload/") && !url.includes("fl_attachment")) {
      return url.replace("/upload/", "/upload/fl_attachment/");
    }
    return url;
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
            {isEditMode ? "Média mis à jour" : "Média ajouté"}
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            « {titre || "Sans titre"} » a été enregistré dans la médiathèque.
          </p>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/medias")}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Retour à la médiathèque
            </button>
            {!isEditMode && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Ajouter un autre média
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isEditMode && mediaLoading) {
    return <div className="page">Chargement du média...</div>;
  }

  if (isEditMode && mediaError) {
    return (
      <div className="page">
        Erreur lors du chargement du média : {mediaError.message}
      </div>
    );
  }

  return (
    <div className="page">
      <div>
        <Link
          to="/medias"
          className="mb-1 inline-block text-xs font-medium text-gray-500 hover:text-gray-700"
        >
          ← Retour à la médiathèque
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">
          {isEditMode ? "Modifier le média" : "Ajouter un média"}
        </h1>
        <p className="text-sm text-gray-500">
          Image, vidéo ou audio capturé sur le terrain.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6"
      >
        {/* Sélecteur de type */}
        <div className="mb-5">
          <span className="mb-2 block text-sm font-medium text-gray-700">
            Type de média
          </span>
          <div className="inline-flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
            {TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleTypeChange(option.value)}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                  type === option.value
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Zone de dépôt */}
        <div className="mb-5">
          <span className="mb-2 block text-sm font-medium text-gray-700">
            Fichier
          </span>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 px-6 py-8 text-center transition-colors hover:border-blue-500 hover:bg-blue-50/40"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={currentTypeOption.accept}
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            {file ? (
              <div onClick={(e) => e.stopPropagation()}>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(1)} Mo
                </p>

                {filePreviewUrl && (
                  <div className="media-viewer-player mt-3">
                    {type === "Image" && (
                      <img src={filePreviewUrl} alt={file.name} />
                    )}

                    {type === "Video" && (
                      <video
                        src={filePreviewUrl}
                        controls
                        className="media-viewer-video"
                      >
                        Votre navigateur ne prend pas en charge la lecture
                        vidéo.
                      </video>
                    )}

                    {type === "Audio" && (
                      <div className="media-viewer-audio-wrap">
                        <div className="media-viewer-audio-art">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          >
                            <path d="M4 10v4M8 6v12M12 3v18M16 6v12M20 10v4" />
                          </svg>
                        </div>
                        <audio
                          src={filePreviewUrl}
                          controls
                          className="media-viewer-audio"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : isEditMode && urlFichier ? (
              <div>
                <div className="media-viewer-player">
                  {type === "Image" && <img src={urlFichier} alt={titre} />}

                  {type === "Video" && (
                    <video
                      key={id}
                      src={urlFichier}
                      poster={urlFichier}
                      controls
                      autoPlay
                      className="media-viewer-video"
                    >
                      Votre navigateur ne prend pas en charge la lecture vidéo.
                    </video>
                  )}

                  {type === "Audio" && (
                    <div className="media-viewer-audio-wrap">
                      <div className="media-viewer-audio-art">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        >
                          <path d="M4 10v4M8 6v12M12 3v18M16 6v12M20 10v4" />
                        </svg>
                      </div>
                      <audio
                        key={id}
                        src={urlFichier}
                        controls
                        autoPlay
                        className="media-viewer-audio"
                      >
                        Votre navigateur ne prend pas en charge la lecture
                        audio.
                      </audio>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Fichier actuel conservé
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Cliquez pour le remplacer
                    </p>
                  </div>
                  <a
                    href={toDownloadUrl(urlFichier)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-3.5 w-3.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
                      />
                    </svg>
                    Télécharger
                  </a>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Glisser un fichier ici ou cliquer pour parcourir
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {currentTypeOption.hint}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Titre */}
        <div className="mb-4">
          <label htmlFor="title" className="mb-1 block text-sm text-gray-700">
            Titre
          </label>
          <input
            id="title"
            type="text"
            required
            value={titre}
            onChange={(e) => settitre(e.target.value)}
            placeholder="Ex. Cortège du départ — manifestation étudiante"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Légende */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="mb-1 block text-sm text-gray-700"
          >
            Légende / description
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Contexte de la prise de vue, lieu, éléments à retenir..."
            className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Article associé */}
          <div>
            <label
              htmlFor="article"
              className="mb-1 block text-sm text-gray-700"
            >
              Associer à un article
            </label>
            <select
              id="article"
              value={linkedArticleId}
              onChange={(e) =>
                setLinkedArticleId(e.target.value ? Number(e.target.value) : "")
              }
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Aucun</option>
              {articles.map((art) => (
                <option key={art.id} value={art.id}>
                  {art.titre}
                </option>
              ))}
            </select>
          </div>

          {/* Localisation */}
          <div>
            <label
              htmlFor="localisation"
              className="mb-1 block text-sm text-gray-700"
            >
              Localisation
            </label>
            <input
              id="localisation"
              type="text"
              value={localisation}
              onChange={(e) => setLocalisation(e.target.value)}
              placeholder="Ex. Place du Capitole, Toulouse"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Date de capture */}
          {/* <div>
            <label
              htmlFor="dateCapture"
              className="mb-1 block text-sm text-gray-700"
            >
              Date de capture
            </label>
            <input
              id="dateCapture"
              type="date"
              value={dateCapture ? toInputDate(dateCapture) : ""}
              onChange={(e) => setDateCapture(fromInputDate(e.target.value))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div> */}
        </div>

        {(formError || createError || updateError) && (
          <p className="mb-4 text-sm text-red-600">
            {formError || createError?.message || updateError?.message}
          </p>
        )}

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving
              ? "Enregistrement..."
              : isEditMode
                ? "Enregistrer les modifications"
                : "Enregistrer le média"}
          </button>
          <Link
            to="/medias"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
