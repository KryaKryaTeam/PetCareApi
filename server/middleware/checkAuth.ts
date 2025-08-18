import express, { Request as ExpressRequest } from "express";
import { ApiError } from "../error/ApiError";
import { JWTService } from "../services/auth/JWTService";
import User from "../models/User";
import { globalLogger } from "../utils/logger";

export async function checkAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  globalLogger.logger().info("User authorization is starts");
  let authorization;
  try {
    authorization = req.headers.authorization.split(" ");
  } catch (err) {
    throw ApiError.unauthorized("Auth token is empty!");
  }

  if (authorization[0] != "Bearer")
    throw ApiError.badrequest(
      "Authorization token is not Bearer! If you send JWT without Bearer prefix add this."
    );

  let session: any = await JWTService.validateToken(authorization[1]);

  const user = await User.findById(session.user);

  if (!user) throw ApiError.badrequest("User to login undefined");

  if (!user.sessions.find((v) => v.sessionId == session.sessionId))
    throw ApiError.unauthorized("session not allowed");

  globalLogger.logger().info(`Session ${session.sessionId} is authicated!`);
  req.session = session;
  req.user = user;

  next();
}
