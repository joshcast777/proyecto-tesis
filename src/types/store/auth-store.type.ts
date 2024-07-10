// Types
import { AuthForm, Doctor } from "@/types";

/**
 * Type representing the authentication store.
 *
 * @export
 * @property {boolean} isAuthenticated - Indicates whether a doctor is authenticated.
 * @property {Doctor} currentDoctor - The currently authenticated doctor.
 * @property {function(string): Promise<string>} getCurrentDoctor - Retrieves the current doctor's information based on their UID.
 * @property {function(): void} clearIsAuthenticated - Clears the authentication status.
 * @property {function(Doctor): void} setIsAuthenticated - Sets the authentication status and the current doctor.
 * @property {function(AuthForm): Promise<string>} signInDoctor - Signs in a doctor with the provided authentication data.
 * @property {function(): Promise<string>} signOutDoctor - Signs out the currently authenticated doctor.
 * @property {function(AuthForm): Promise<string>} signUpDoctor - Signs up a new doctor with the provided authentication data.
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
	currentDoctor: Doctor;

	/**
	 * Retrieves the current doctor's information based on their UID.
	 *
	 * @param {string} uid - The UID of the doctor.
	 * @returns {Promise<string>} A promise that resolves with a response string.
	 */
	getCurrentDoctor: (uid: string) => Promise<string>;

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
	signInDoctor: (authData: AuthForm) => Promise<string>;

	/**
	 * Signs out the currently authenticated doctor.
	 *
	 * @returns {Promise<string>} A promise that resolves with a response string.
	 */
	signOutDoctor: () => Promise<string>;

	/**
	 * Signs up a new doctor with the provided authentication data.
	 *
	 * @param {AuthForm} authData - The authentication data containing the email and password.
	 * @returns {Promise<string>} A promise that resolves with a response string.
	 */
	signUpDoctor: ({ email, password }: AuthForm) => Promise<string>;
};
