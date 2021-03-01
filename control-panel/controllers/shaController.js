const crypto = require('crypto');

exports.hash = (pwd) => {
    return crypto.createHash('sha256').update(pwd).digest('base64');
}