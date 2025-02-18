/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Agrega aquí más variables si las necesitas
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
