import { ApiError } from "../../error/ApiError";
import { GoogleBannedToken } from "../../models/BannedToken";
import { globalLogger } from "../../utils/logger";

export class GoogleTokenBanService {
  static async banToken(token: string, sessionId: string) {
    globalLogger.logger().info(`${token} is banned by GoogleTokenBanService`);
    const ban_record = new GoogleBannedToken({ token, sessionId });
    await ban_record.save();
  }
  static async checkBan(token: string) {
    globalLogger.logger().info(`Token check is starts for ${token}`);
    const ban_record = await GoogleBannedToken.findOne({ token });
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
      globalLogger
        .logger()
        .info("Token ban is expired. Service has deleted the record!");
      await ban_record.deleteOne();
    }
  }
}
