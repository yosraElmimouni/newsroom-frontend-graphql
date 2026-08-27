import type { MediaType } from "../../features/capture/types";


export async function uploadToCloudinary(file: File, type: MediaType): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Configuration Cloudinary manquante (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)."
    );
  }

  // Cloudinary n'a que 2 resource_type d'upload : "image" et "video".
  // L'audio passe aussi par "video" ; Cloudinary détecte le format automatiquement.
  const resourceType = type === "Image" ? "image" : "video";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.error?.message ?? "Échec de l'upload du fichier vers Cloudinary.");
  }

  const data = await response.json();
  return data.secure_url as string;
}

