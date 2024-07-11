export interface ICookies {
  setEmailForSignIn(email: string): Promise<void>;
  loadEmailForSignIn(): Promise<string>;
  clearEmailForSignIn(): void;
}
