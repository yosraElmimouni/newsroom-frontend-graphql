import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { MediaItem, MediaType } from "../types";
import { useDeleteMedia, useUpdateMedia } from "../data/mediasData";

interface MediaViewerModalProps {
  media: {
    id: number;
    type: MediaType;
    urlFichier: string;
    titre: string;
    user: { nom: string; prenom: string };
    dateCapture: string;
    description: string;
    article: { id: number; titre: string } | null;
    localisation: string;
  };
  onClose: () => void;
}

const TYPE_LABEL: Record<MediaItem["type"], string> = {
  Image: "Image",
  Video: "Vidéo",
  Audio: "Audio",
};

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function ArticleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h9l5 5v13H6z" />
      <path d="M14 3v5h5M8 12h8M8 16h8M8 8h3" />
    </svg>
  );
}

export default function MediaViewerModal({
  media,
  onClose,
}: MediaViewerModalProps) {
  const navigate = useNavigate();
  const id = media.id;
  const handleModifierMedia = () => {
    if (id) {
      navigate(`/medias/modifier/${id}`);
    }
  };
  const [deleteEvent, { loading: deleting }] = useDeleteMedia();
  const [modifierEvent, { loading: modifing }] = useUpdateMedia();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const handleDelete = async () => {
    setDeleteError(null);
    try {
      await deleteEvent({ variables: { id: media.id } });
      onClose(); // Fermer le modal après la suppression
    } catch (err) {
      setDeleteError("La suppression a échoué. Veuillez réessayer.");
      console.error(err);
    }
  };

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="media-viewer-backdrop" onClick={onClose}>
      <div className="media-viewer-panel" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="media-viewer-close"
          onClick={onClose}
          aria-label="Fermer"
        >
          <CloseIcon />
        </button>

        <div className="media-viewer-player">
          {media.type === "Image" && (
            <img src={media.urlFichier || media.urlFichier} alt={media.titre} />
          )}

          {media.type === "Video" && (
            <video
              key={media.id}
              src={media.urlFichier}
              poster={media.urlFichier}
              controls
              autoPlay
              className="media-viewer-video"
            >
              Votre navigateur ne prend pas en charge la lecture vidéo.
            </video>
          )}

          {media.type === "Audio" && (
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
                key={media.id}
                src={media.urlFichier}
                controls
                autoPlay
                className="media-viewer-audio"
              >
                Votre navigateur ne prend pas en charge la lecture audio.
              </audio>
            </div>
          )}
        </div>

        <div className="media-viewer-details">
          <div className="media-viewer-header">
            <span className={`media-type-badge badge-${media.type}`}>
              {TYPE_LABEL[media.type]}
            </span>
            {/* {media.duration && <span className="media-viewer-duration">{media.duration}</span>} */}
          </div>

          <h2 className="media-viewer-title">{media.titre}</h2>

          {media.description && (
            <p className="media-viewer-description">{media.description}</p>
          )}

          <div className="media-viewer-meta">
            {media.localisation && (
              <div className="media-viewer-meta-row">
                <PinIcon />
                <span>{media.localisation}</span>
              </div>
            )}

            {media.article && (
              <div className="media-viewer-meta-row">
                <ArticleIcon />
                <span>
                  Associé à :{" "}
                  <Link
                    to={`/article/${media.article.id}`}
                    className="media-viewer-article-link"
                  >
                    {media.article.titre}
                  </Link>
                </span>
              </div>
            )}

            <div>
              <button
                type="button"
                onClick={handleModifierMedia}
                className="btn-primary"
              >
                Modifier l'article
              </button>

              <button
                type="button"
                className="evenement-liste-footer-btn evenement-liste-footer-btn--delete"
                disabled={deleting || modifing}
                onClick={() => {
                  if (
                    window.confirm(
                      "Êtes-vous sûr de vouloir supprimer cet événement ?",
                    )
                  ) {
                    handleDelete();
                  }
                }}
              >
                {deleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>

          <div className="media-viewer-capturer-row">
            <span className="media-avatar">
              {media.user.nom
                .split(" ")
                .map((part) => part[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </span>
            <div className="media-capturer-info">
              <span className="media-capturer-name">
                {media.user.nom} {media.user.prenom}
              </span>
              <span className="media-capturer-date">
                Capturé le {media.dateCapture}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
