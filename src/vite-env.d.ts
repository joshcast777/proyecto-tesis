/// <reference types="vite/client" />

type ImportMetaEnv = {
	readonly VITE_FIREBASE_API_KEY: string;
	readonly VITE_FIREBASE_AUTH_DOMAIN: string;
	readonly VITE_FIREBASE_PROJECT_ID: string;
	readonly VITE_FIREBASE_STORAGE_BUCKET: string;
	readonly VITE_FIREBASE_MESSAGEING_SENDER_ID: string;
	readonly VITE_FIREBASE_APP_ID: string;
	readonly VITE_FIREBASE_MEASUREMENT_ID: string;
	readonly VITE_ADMIN_EMAIL: string;
	readonly VITE_POSE_ESTIMATION_API: string;
	readonly VITE_CLOUDINARY_CLOUD_NAME: string;
	readonly VITE_CLOUDINARY_API_KEY: string;
	readonly VITE_CLOUDINARY_APPI_SECRET: string;
	readonly VITE_CLOUDINARY_UPLOAD_PRESSET: string;
};

type ImportMeta = {
	readonly env: ImportMetaEnv;
};
