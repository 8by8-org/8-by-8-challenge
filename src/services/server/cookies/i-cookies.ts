export interface ICookies {
  setEmailForSignIn(email: string): void;
  loadEmailForSignIn(): string;
  clearEmailForSignIn(): void;
}
