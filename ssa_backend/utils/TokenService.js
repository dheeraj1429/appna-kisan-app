const jwt = require('jsonwebtoken');

class TokenService {
  static signToken(payload, secret, options = {}) {
    const token = jwt.sign(payload, secret, options);

    return token;
  }

  static verifyToken(token, secret, options) {
    const decodedPayload = jwt.verify(token, secret, options);

    return decodedPayload;
  }
}

module.exports = TokenService;
