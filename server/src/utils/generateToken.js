const jwt = require('jsonwebtoken')

function generateToken(payload) {
    jwt.sign(
        payload,
        secretKey,
        {
            expiresIn: '1h'
        }
    );
}
module.exports = generateToken;