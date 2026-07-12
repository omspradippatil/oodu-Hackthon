"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const response_1 = require("../utils/response");
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return (0, response_1.error)(res, 'Authentication required.', 401);
        }
        if (!allowedRoles.includes(req.user.role)) {
            return (0, response_1.error)(res, 'Access denied. Insufficient permissions.', 403);
        }
        next();
    };
};
exports.requireRole = requireRole;
