// Types
import { AuthForm, Doctor, Patient } from "@/types";

/**
 * Type representing the authentication store.
 *
 * @export
 * @property {boolean} isAuthenticated - Indicates whether a doctor is authenticated.
 * @property {Doctor} currentUser - The currently authenticated user.
 * @property {function(string): Promise<string>} getCurrentUser - Retrieves the current user's information based on their UID.
 * @property {function(): void} clearIsAuthenticated - Clears the authentication status.
 * @property {function(Doctor): void} setIsAuthenticated - Sets the authentication status and the current user.
 * @property {function(AuthForm): Promise<string>} signInUser - Signs in a user with the provided authentication data.
 * @property {function(): Promise<string>} signOutUser - Signs out the currently authenticated user.
 * @property {function(AuthForm): Promise<string>} signUpUser - Signs up a new user with the provided authentication data.
 */
export type AuthStore = {
	/**
	 * Indicates whether a doctor is authenticated.
	 *
	 * @type {boolean}
	 */
	isAuthenticated: boolean;

	/**
	 * The currently authenticated doctor.
	 *
	 * @type {Doctor}
	 */
	currentUser: Doctor;

	/**
	 * The currently authenticated doctor.
	 *
	 * @type {Doctor}
	 */
	currentPatient: Patient;

	/**
	 * Retrieves the current doctor's information based on their UID.
	 *
	 * @param {string} uid - The UID of the doctor.
	 * @returns {Promise<string>} A promise that resolves with a response string.
	 */
	getCurrentUser: (uid: string) => Promise<string>;

	getCurrentPatient: (id: string) => Promise<string>;

	/**
	 * Clears the authentication status.
	 */
	clearIsAuthenticated: () => void;

	/**
	 * Sets the authentication status and the current doctor.
	 *
	 * @param {Doctor} user - The doctor to set as the currently authenticated doctor.
	 */
	setIsAuthenticated: (doctor: Doctor) => void;

	/**
	 * Signs in a doctor with the provided authentication data.
	 *
	 * @param {AuthForm} authData - The authentication data containing the email and password.
	 * @returns {Promise<string>} A promise that resolves with a response string.
	 */
	signInUser: (authData: AuthForm) => Promise<string>;

	/**
	 * Signs out the currently authenticated doctor.
	 *
	 * @returns {Promise<string>} A promise that resolves with a response string.
	 */
	signOutUser: () => Promise<string>;

	/**
	 * Signs up a new doctor with the provided authentication data.
	 *
	 * @param {AuthForm} authData - The authentication data containing the email and password.
	 * @returns {Promise<string>} A promise that resolves with a response string.
	 */
	signUpUser: ({ email, password }: AuthForm) => Promise<string>;
};
