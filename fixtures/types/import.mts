import api, { generateRecoveryCodes, generateToken, type RecoveryCodeOptions } from 'all-str-gen';
const options: RecoveryCodeOptions = { count: 8 };
const codes: string[] = generateRecoveryCodes(options);
const token: string = generateToken({ type: 'numeric', length: 20 });
const password: string = api.generatePassword({ length: 24 });
const username: string = api.generateUsername({ alphabet: 'abeklmno', length: 8 });
api.generateUsername('abeklmno');
// @ts-expect-error Custom alphabets cannot be mixed with numeric suffixes.
api.generateUsername({ alphabet: 'ab', digits: 4 });
// @ts-expect-error Byte encodings cannot be combined with character token modes.
generateToken({ type: 'numeric', bytes: 32 });
void [codes, token, password];
