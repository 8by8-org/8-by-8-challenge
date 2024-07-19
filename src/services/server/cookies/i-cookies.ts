/**
 * Provides a mechanism for setting cookies to track various settings, such as
 * the email address to which a one-time passcode was sent. This improves user
 * experience by allowing certain components to be rendered on the server with
 * the user's information pre-populated.
 */
export interface ICookies {
  setEmailForSignIn(email: string): Promise<void>;
  loadEmailForSignIn(): Promise<string>;
  clearEmailForSignIn(): void;
}
