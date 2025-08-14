"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const id_generateor_1 = require("../../utils/id_generateor");
const logger_1 = require("../../utils/logger");
class SessionService {
    static SessionTimestampStringToDate(session) {
        let session_ = session;
        session_.expiresAt = new Date(session.expiresAt);
        session_.createdAt = new Date(session.createdAt);
        return session_;
    }
    static generateNew(device, ip, provider, user, familyId) {
        logger_1.globalLogger.logger().setService("session_service");
        logger_1.globalLogger.logger().info("Session is created");
        const session = {
            sessionId: SessionService.generateSessionId(),
            familyId,
            provider,
            createdAt: new Date(),
            device,
            ip,
            expiresAt: new Date(Date.now() + Number(process.env.SESSION_EXP_TIME)),
            user,
        };
        return session;
    }
    static generateSessionId() {
        return (0, id_generateor_1.generateId)("session");
    }
}
exports.SessionService = SessionService;
