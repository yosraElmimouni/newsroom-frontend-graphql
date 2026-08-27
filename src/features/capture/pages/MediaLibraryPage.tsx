import "../style/media.css";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { MediaItem, MediaType } from "../types";
import MediaViewerModal from "../composants/MediaViewerModal";
import { useMedias } from "../data/mediasData";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.5v13l11-6.5-11-6.5z" />
    </svg>
  );
}

function WaveformIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className="media-thumb-icon"
    >
      <path d="M4 10v4M8 6v12M12 3v18M16 6v12M20 10v4" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />
    </svg>
  );
}

export default function MediaLibraryPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<MediaType | "ALL">("ALL");
  const [selectedMedia, setSelectedMedia] = useState<{
    id: number;
    type: MediaType;
    urlFichier: string;
    titre: string;
    user: { nom: string; prenom: string };
    dateCapture: string;
    description: string;
    article: { id: number; titre: string } | null;
    localisation: string;
  } | null>(null);

  const { medias, loading, error } = useMedias();

  const filteredMedia = useMemo(() => {
    return medias.filter(
      (media: {
        id: number;
        type: MediaType;
        urlFichier: string;
        titre: string;
        user: { nom: string; prenom: string };
        dateCapture: string;
        description: string;
        article: { id: number; titre: string } | null;
        localisation: string;
      }) => {
        const matchesSearch =
          media.titre.toLowerCase().includes(search.toLowerCase()) ||
          media.user.nom.toLowerCase().includes(search.toLowerCase()) ||
          media.user.prenom.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === "ALL" || media.type === typeFilter;
        return matchesSearch && matchesType;
      },
    );
  }, [search, typeFilter]);

  if (loading) return <div className="page">Chargement des articles...</div>;
  if (error)
    return (
      <div className="page">
        Erreur lors du chargement des articles : {error.message}
      </div>
    );

  return (
    <div className="page">
      <div className="media-header-row">
        <div>
          <h1
            style={{ fontSize: "1.25rem", fontWeight: 600, color: "#111827" }}
          >
            Médias
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            {medias.length} médias enregistrés
          </p>
        </div>
        <Link to="/medias/nouveau" className="btn-primary">
          <UploadIcon />
          Ajouter un média
        </Link>
      </div>

      <div className="card">
        <div className="filters-bar">
          <input
            type="text"
            placeholder="Rechercher un titre ou un contributeur..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as MediaType | "ALL")}
          >
            <option value="ALL">Tous les types</option>
            <option value="image">Image</option>
            <option value="video">Vidéo</option>
            <option value="audio">Audio</option>
          </select>
          <span className="filter-count">
            {filteredMedia.length} résultat{filteredMedia.length > 1 ? "s" : ""}
          </span>
        </div>

        <div style={{ marginTop: "1rem" }}>
          {filteredMedia.length === 0 ? (
            <div className="empty-state">
              Aucun média ne correspond à votre recherche.
            </div>
          ) : (
            <div className="media-grid">
              {filteredMedia.map(
                (media: {
                  id: number;
                  type: MediaType;
                  urlFichier: string;
                  titre: string;
                  user: { nom: string; prenom: string };
                  dateCapture: string;
                  description: string;
                  article: { id: number; titre: string } | null;
                  localisation: string;
                }) => (
                  <article
                    key={media.id}
                    className="media-card media-card-clickable"
                    onClick={() => setSelectedMedia(media)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        setSelectedMedia(media);
                    }}
                  >
                    <div className={`media-thumb type-${media.type}`}>
                      {media.type === "Image" && (
                        <img src={media.urlFichier} alt="" loading="lazy" />
                      )}

                      {media.type === "Video" && (
                        <>
                          <img src={media.urlFichier} alt="" loading="lazy" />
                          <div className="media-play-overlay">
                            <span className="media-play-circle">
                              <PlayIcon />
                            </span>
                          </div>
                        </>
                      )}

                      {media.type === "Audio" && <WaveformIcon />}

                      <span className={`media-type-badge ${media.type}`}>
                        {media.type}
                      </span>

                      {/* {media.duration && <span className="media-duration">{media.duration}</span>} */}
                    </div>

                    <div className="media-card-body">
                      <h3 className="media-title">{media.titre}</h3>
                      {media.article && (
                        <span className="media-article-tag">
                          Pour : {media.article.titre}
                        </span>
                      )}

                      <div className="media-capturer-row">
                        <span className="media-avatar">
                          {initials(media.user.nom)}
                        </span>
                        <div className="media-capturer-info">
                          <span className="media-capturer-name">
                            {media.user.nom}
                          </span>
                          <span className="media-capturer-date">
                            Capturé le {media.dateCapture}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </div>
      </div>

      {selectedMedia && (
        <MediaViewerModal
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </div>
  );
}
