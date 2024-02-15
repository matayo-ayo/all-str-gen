const hashGenerator = require('./lib/hashGenerator');
const passphraseGenerator = require('./lib/passphraseGenerator');
const stringGenerator = require('./lib/stringGenerator');

module.exports = {
    generateHash: function (string) {
        return hashGenerator.generateHash(string);
    },

    generatePassphrase: function (count) {
        return passphraseGenerator.generatePassphrase(count);
    },

    generateString: function (count, cap, low, num, sym) {
        return stringGenerator.stringGenerator(count, cap, low, num, sym);
    }
};