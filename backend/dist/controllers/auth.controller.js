"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileController = exports.getProfileController = exports.refreshController = exports.logoutController = exports.registerController = exports.loginController = void 0;
const authService = __importStar(require("../services/auth.service"));
const validators_1 = require("../validators");
const response_1 = require("../utils/response");
const env_1 = require("../config/env");
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: env_1.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
const loginController = async (req, res, next) => {
    try {
        const data = validators_1.loginSchema.parse(req.body);
        const result = await authService.login(data);
        res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);
        (0, response_1.success)(res, { accessToken: result.accessToken, user: result.user }, 'Login successful');
    }
    catch (err) {
        next(err);
    }
};
exports.loginController = loginController;
const registerController = async (req, res, next) => {
    try {
        const data = validators_1.registerSchema.parse(req.body);
        const user = await authService.register(data);
        (0, response_1.success)(res, user, 'Registration successful', 201);
    }
    catch (err) {
        next(err);
    }
};
exports.registerController = registerController;
const logoutController = async (req, res, next) => {
    try {
        res.clearCookie('refreshToken');
        (0, response_1.success)(res, null, 'Logged out successfully');
    }
    catch (err) {
        next(err);
    }
};
exports.logoutController = logoutController;
const refreshController = async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) {
            (0, response_1.error)(res, 'Refresh token not provided', 401);
            return;
        }
        const result = await authService.refreshTokenService(token);
        (0, response_1.success)(res, result, 'Token refreshed');
    }
    catch (err) {
        next(err);
    }
};
exports.refreshController = refreshController;
const getProfileController = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await authService.getProfile(userId);
        (0, response_1.success)(res, user, 'Profile fetched');
    }
    catch (err) {
        next(err);
    }
};
exports.getProfileController = getProfileController;
const updateProfileController = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = validators_1.updateProfileSchema.parse(req.body);
        const user = await authService.updateProfile(userId, data);
        (0, response_1.success)(res, user, 'Profile updated');
    }
    catch (err) {
        next(err);
    }
};
exports.updateProfileController = updateProfileController;
