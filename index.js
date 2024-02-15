const passphrase = require('./lib/passphraseGenerator');
const hash = require('./lib/hashGenerator');
const string = require('./lib/stringGenerator');

module.exports = {
    generateString: function (count, uppercase, lowcase, numbers, symbols) {
        return string.stringGenerator(count, uppercase, lowcase, numbers, symbols);
    },
    generateHash: function (string) {
        return hash.hashGenerator(string);
    },
    generatePassphrase: function (count) {
        return passphrase.passphraseGenerator(count);
    }
};