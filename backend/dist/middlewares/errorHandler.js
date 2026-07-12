"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const response_1 = require("../utils/response");
const errorHandler = (err, req, res, next) => {
    console.error('Error occurred:', err);
    if (err instanceof zod_1.ZodError) {
        const formattedErrors = err.errors.reduce((acc, curr) => {
            const path = curr.path.join('.');
            acc[path] = curr.message;
            return acc;
        }, {});
        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            errors: formattedErrors,
        });
    }
    // Prisma unique key violation
    if (err.code === 'P2002') {
        return (0, response_1.error)(res, `Database conflict: Record with unique constraint already exists.`, 409);
    }
    // Prisma record not found
    if (err.code === 'P2025') {
        return (0, response_1.error)(res, 'Requested resource not found.', 404);
    }
    // Custom client errors
    if (err.statusCode) {
        return (0, response_1.error)(res, err.message, err.statusCode);
    }
    return (0, response_1.error)(res, err.message || 'Internal Server Error', 500);
};
exports.errorHandler = errorHandler;
