import type { Types } from "mongoose";
import { IUserSession } from "../../models/User";
import { generateId } from "../../utils/id_generateor";
import { globalLogger } from "../../utils/logger";

export class SessionService {
  static SessionTimestampStringToDate(session) {
    let session_ = session;
    session_.expiresAt = new Date(session.expiresAt);
    session_.createdAt = new Date(session.createdAt);
    return session_;
  }
  static generateNew(
    device: string,
    ip: string,
    provider: "google" | "self",
    user: Types.ObjectId,
    familyId: string
  ) {
    globalLogger.logger().info("Session is created");
    const session: IUserSession = {
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
    return generateId("session");
  }
}
