export interface StringOptions {
    length?: number;
    uppercase?: boolean;
    lowercase?: boolean;
    numbers?: boolean;
    symbols?: boolean;
    exclude?: string;
    excludeSimilar?: boolean;
    alphabet?: string;
}
export interface PassphraseOptions {
    length?: number;
    separator?: string;
    capitalize?: boolean;
    words?: string[];
}
export function generateString(options?: StringOptions): string;
export function generateString(length: number, uppercase?: boolean, lowercase?: boolean, numbers?: boolean, symbols?: boolean): string;
export function generatePassword(options?: number | Omit<StringOptions, 'alphabet'>): string;
export function generatePassphrase(options?: number | PassphraseOptions): string;
export function generateHash(value: string | Uint8Array): string;
export type UsernameOptions =
    | { alphabet: string; length?: number; separator?: never; prefix?: never; digits?: never }
    | { alphabet?: never; length?: never; separator?: '' | '_' | '-'; prefix?: string; digits?: number };
export function generateUsername(options?: UsernameOptions): string;
/** Shorthand for { alphabet }; generates eight alternating consonant/vowel letters. */
export function generateUsername(alphabet: string): string;
export function generatePIN(length?: number): string;
export type TokenOptions =
    | { bytes?: number; encoding?: 'hex' | 'base64' | 'base64url'; type?: never; length?: never }
    | { type: 'alphanumeric' | 'numeric' | 'alphabetic'; length?: number; bytes?: never; encoding?: never };
export function generateToken(options?: TokenOptions): string;
export function generateAlphanumericToken(length?: number): string;
export function generateNumericToken(length?: number): string;
export function generateAlphabeticToken(length?: number): string;
export interface RecoveryCodeOptions {
    count?: number;
    length?: number;
    groupSize?: number;
    separator?: '-' | ' ' | '';
}
export function generateRecoveryCodes(options?: RecoveryCodeOptions): string[];
export function generatePattern(pattern: string): string;
/** Both bounds are inclusive. */
export function generateNumber(min?: number, max?: number): number;
export function generateUUID(): string;
