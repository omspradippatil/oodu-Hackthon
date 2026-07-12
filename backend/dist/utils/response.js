"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginated = exports.error = exports.success = void 0;
const success = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};
exports.success = success;
const error = (res, message = 'Internal Server Error', statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
};
exports.error = error;
const paginated = (res, data, total, page, limit, message = 'Success') => {
    return res.status(200).json({
        success: true,
        message,
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1,
        },
    });
};
exports.paginated = paginated;
