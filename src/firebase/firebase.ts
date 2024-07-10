// Firebase
import { FirebaseApp, initializeApp } from "firebase/app";

// Types
import { FirebaseConfig } from "@/types";

/**
 * Firebase environment variables imported from meta environment.
 * Replace with actual environment variables.
 *
 * @type {Object}
 */
const { VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGEING_SENDER_ID, VITE_FIREBASE_APP_ID, VITE_FIREBASE_MEASUREMENT_ID } = import.meta.env;

/**
 * Configuration object for Firebase initialization.
 *
 * @type {Object}
 * @property {string} apiKey - The API key for your Firebase project.
 * @property {string} authDomain - The Auth domain for your Firebase project.
 * @property {string} projectId - The project ID for your Firebase project.
 * @property {string} storageBucket - The storage bucket URL for your Firebase project.
 * @property {string} messagingSenderId - The sender ID for Firebase Cloud Messaging.
 * @property {string} appId - The app ID for your Firebase project.
 */
const firebaseConfig: FirebaseConfig = {
	apiKey: VITE_FIREBASE_API_KEY,
	authDomain: VITE_FIREBASE_AUTH_DOMAIN,
	projectId: VITE_FIREBASE_PROJECT_ID,
	storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: VITE_FIREBASE_MESSAGEING_SENDER_ID,
	appId: VITE_FIREBASE_APP_ID,
	measurementId: VITE_FIREBASE_MEASUREMENT_ID
};

/**
 * Initializes the Firebase application with the provided configuration.
 *
 * @type {FirebaseApp}
 */
const app: FirebaseApp = initializeApp(firebaseConfig);

export { app };
