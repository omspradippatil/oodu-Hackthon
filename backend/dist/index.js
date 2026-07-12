"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const env_1 = require("./config/env");
const api_routes_1 = __importDefault(require("./routes/api.routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const rateLimiter_1 = require("./middlewares/rateLimiter");
const app = (0, express_1.default)();
// ============================================================================
// SECURITY & BASIC MIDDLEWARE
// ============================================================================
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false, // for loading local media if needed
}));
// CORS Configuration
const allowedOrigins = env_1.env.ALLOWED_ORIGINS.split(',');
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || env_1.env.NODE_ENV === 'development') {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use((0, morgan_1.default)('dev'));
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Custom Simple Cookie Parser Middleware (removes reliance on external package)
app.use((req, res, next) => {
    const cookieHeader = req.headers.cookie;
    req.cookies = {};
    if (cookieHeader) {
        cookieHeader.split(';').forEach((cookie) => {
            const parts = cookie.split('=');
            const name = parts[0].trim();
            const value = parts.slice(1).join('=').trim();
            req.cookies[name] = decodeURIComponent(value);
        });
    }
    next();
});
// Create uploads directory if it doesn't exist
const uploadsDir = path_1.default.join(__dirname, '../uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express_1.default.static(uploadsDir));
// ============================================================================
// RATE LIMITING & ROUTING
// ============================================================================
app.use('/api', rateLimiter_1.generalLimiter);
app.use('/api', api_routes_1.default);
// Root route health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date(), env: env_1.env.NODE_ENV });
});
// ============================================================================
// GLOBAL ERROR HANDLER
// ============================================================================
app.use(errorHandler_1.errorHandler);
// ============================================================================
// SERVER BOOT
// ============================================================================
const PORT = env_1.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Vadhvan Port backend running in ${env_1.env.NODE_ENV} mode`);
    console.log(`🔌 Listening on port ${PORT}`);
    console.log(`==================================================`);
});
exports.default = app;
