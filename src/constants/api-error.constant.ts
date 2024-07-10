/**
 * Represents authentication error messages.
 *
 * @property {string} EmailAlreadyInUse - Error message for when the email is already in use.
 * @property {string} InvalidCredential - Error message for when the provided credential is invalid.
 */
type AuthError = {
	/**
	 * Error message for when the email is already in use.
	 *
	 * @type {string}
	 */
	EmailAlreadyInUse: string;

	/**
	 * Error message for when the provided credential is invalid.
	 *
	 * @type {string}
	 */
	InvalidCredential: string;
};

/**
 * Represents the error messages for different error categories.
 */
type Error = {
	/**
	 * Authentication error messages.
	 *
	 * @type {AuthError}
	 */
	Auth: AuthError;
};

/**
 * Contains predefined error messages for API responses.
 *
 * @type {Error}
 */
export const ApiErrors: Error = {
	Auth: {
		EmailAlreadyInUse: "auth/email-already-in-use",
		InvalidCredential: "auth/invalid-credential"
	}
};
