"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
class SessionService {
    static SessionTimestampStringToDate(session) {
        let session_ = session;
        session_.expiresAt = new Date(session.expiresAt);
        session_.createdAt = new Date(session.createdAt);
        return session_;
    }
    static generateNew(device, ip, provider, user, familyId) {
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
        const allowed = "qwertyuiopasdfghjklzxcvbnm1234567890".split("");
        let header = "";
        for (let i = 0; i < 32; i++) {
            header += allowed[Math.floor(Math.random() * allowed.length)];
        }
        return Date.now() + "-" + header;
    }
}
exports.SessionService = SessionService;
