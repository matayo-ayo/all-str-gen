const crypto = require('crypto')

function hashGenerator(string) {
    return crypto.createHash('sha256').update(string).digest('hex');
}

module.exports = { hashGenerator }