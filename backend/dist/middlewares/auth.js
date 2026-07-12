"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const response_1 = require("../utils/response");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return (0, response_1.error)(res, 'Authentication required. No token provided.', 401);
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        req.user = { id: decoded.id, role: decoded.role };
        next();
    }
    catch (err) {
        return (0, response_1.error)(res, 'Invalid or expired access token.', 401);
    }
};
exports.authenticate = authenticate;
