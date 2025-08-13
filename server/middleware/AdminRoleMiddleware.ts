import { ApiError } from "../error/ApiError";
import User from "../models/User";
import { globalLogger } from "../utils/logger";

export async function AdminRoleMiddleware(req, res, next) {
  //@ts-ignore
  const session = req.session;

  const user = await User.findById(session.user);
  if (!user) throw ApiError.forbidden("no access");
  if (!user.roles.includes("admin")) throw ApiError.forbidden("no access");
  globalLogger.logger().info("administrator role confirmed");
  next();
}
