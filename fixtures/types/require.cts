import gen = require('all-str-gen');
const codes: string[] = gen.generateRecoveryCodes({ count: 8 });
const token: string = gen.generateNumericToken(20);
const legacy: string = gen.generateString(10, true, true, true, true);
// @ts-expect-error PIN lengths are numeric.
gen.generatePIN('6');
// @ts-expect-error Unknown token modes are rejected.
gen.generateToken({ type: 'other' });
void [codes, token, legacy];
