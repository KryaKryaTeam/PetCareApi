import { ApiError } from "../../error/ApiError";
import { IUserSession } from "../../models/User";
import { decode, JwtPayload, sign, verify } from "jsonwebtoken";
import { SessionService } from "./SessionService";
import { SelfBannedToken, IBannedTokenModel } from "../../models/BannedToken";
import { globalLogger } from "../../utils/logger";
import { generateId } from "../../utils/id_generateor";

export interface IJWTPair {
  accessToken: string;
  refreshToken: string;
}

export interface IJWTPayload {
  familyId: string;
  session: IUserSession;
}

export class JWTService {
  static generatePair(session: IUserSession, familyId?: string): IJWTPair {
    globalLogger.logger().info("JWT pair generate is starts");
    //@ts-ignore
    const accessToken = sign(
      { session, familyId: familyId || JWTService.generateFamilyId() },
      process.env.JWT_SECRET_ACCESS,
      {
        expiresIn: process.env.JWT_ACCESS_EXP || "3h",
      }
    );
    globalLogger.logger().info("Access token is signed");
    //@ts-ignore
    const refreshToken = sign(
      { session, familyId: familyId || JWTService.generateFamilyId() },
      process.env.JWT_SECRET_REFRESH,
      {
        expiresIn: process.env.JWT_REFRESH_EXP || "3d",
      }
    );
    globalLogger.logger().info("Refresh token is signed");

    return { accessToken, refreshToken };
  }
  static async validateToken(token: string): Promise<IUserSession> {
    globalLogger.logger().info("JWT token validation is starts");
    const decode = verify(token, process.env.JWT_SECRET_ACCESS) as JwtPayload &
      IJWTPayload;
    await JWTService.checkBan(decode.familyId);
    globalLogger.logger().info("JWT token is succesfuly validated");
    return SessionService.SessionTimestampStringToDate(decode.session);
  }
  static async validateRefreshToken(token: string): Promise<IUserSession> {
    globalLogger.logger().info("JWT refresh token validation is starts");
    const decode = verify(token, process.env.JWT_SECRET_REFRESH) as JwtPayload &
      IJWTPayload;
    await JWTService.checkBan(decode.familyId);
    globalLogger.logger().info("JWT refresh token is successfully validated");
    return SessionService.SessionTimestampStringToDate(decode.session);
  }
  static async validatePair(pair: IJWTPair): Promise<IUserSession> {
    globalLogger.logger().info("JWT pair validation is starts");
    const decode1: any = verify(
      pair.accessToken,
      process.env.JWT_SECRET_ACCESS
    );
    globalLogger.logger().info("Access token is validated");
    const decode2: any = verify(
      pair.refreshToken,
      process.env.JWT_SECRET_REFRESH
    );
    globalLogger.logger().info("Refresh token is validated");

    if (decode1.familyId != decode2.familyId)
      throw ApiError.unauthorized("pair is not accepted");
    await JWTService.checkBan(decode1.familyId);

    globalLogger.logger().info("JWT pair is successfully validated!");

    return SessionService.SessionTimestampStringToDate(decode1.session);
  }
  static generateFamilyId(): string {
    return generateId("jwt");
  }
  static async banPairByToken(token: string): Promise<IBannedTokenModel> {
    globalLogger.logger().info("Ban pair is starts");
    const decode_ = decode(token) as JwtPayload & IJWTPayload;
    const ban_record = new SelfBannedToken({
      familyId: decode_.familyId,
      sessionId: decode_.session.sessionId,
    });
    await ban_record.save();
    return ban_record;
  }
  static async banPairByFamilyId(familyId: string, sessionId: string) {
    globalLogger.logger().info("Ban pair is starts");
    const ban_record = new SelfBannedToken({
      familyId: familyId,
      sessionId: sessionId,
    });
    await ban_record.save();
    return ban_record;
  }
  static async checkBan(familyId) {
    globalLogger.logger().info("Check ban of token is starts");
    const ban_record = await SelfBannedToken.findOne({ familyId });
    if (!ban_record) return;
    if (
      ban_record &&
      ban_record.createdAt.getTime() + Number(process.env.SESSION_EXP_TIME) >
        Date.now()
    )
      throw ApiError.unauthorized("token is banned");
    if (
      ban_record.createdAt.getTime() + Number(process.env.SESSION_EXP_TIME) <
      Date.now()
    ) {
      await ban_record.deleteOne();
      globalLogger.logger().info("Ban record is deleted");
    }
    globalLogger.logger().info("Check ban is successfully");
  }
  static async checkBanByToken(token: string) {
    const decode_ = decode(token) as JwtPayload & IJWTPayload;
    this.checkBan(decode_.familyId);
  }
}
