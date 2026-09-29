import api from './index.js';

export const {
    generateString, generatePassword, generatePassphrase, generateHash,
    generateUsername, generatePIN, generateToken, generateNumber, generateUUID,
    generateRecoveryCodes, generatePattern,
    generateAlphanumericToken, generateNumericToken, generateAlphabeticToken
} = api;

export default api;
