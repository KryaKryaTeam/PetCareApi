import { ApiError } from "../../error/ApiError";
import User, { IUserSession } from "../../models/User";
import { IJWTPair, JWTService } from "./JWTService";
import { globalLogger } from "../../utils/logger";
import { master_provider } from "./providers/Provider";

/* TODO:
	- add refresh password function ^
	- add mails integration
	 make mail templates ( in waiting for Bogdan )
	 add google gmail api integration -> changing to mailgun maybe
	 how to write tests for this? >:
	- separate login with google provider
	- make ability to use one login and register endpoint with query params ( in this way we can add some more providers in future )
	 use ?provider="avalible_provider" to select provider
	 add some body pattern for each provider
	 separate auth service to different providers
	- make 2fa with auths codes in mails
	 add mail check (code or generated link)
	- add root user
	-rewrite router validations to ajv
*/

export class AuthServiceSelf {
	static async login(
		data: unknown[],
		device: string,
		ip: string,
		provider: string,
	): Promise<string> {
		globalLogger.logger().setService("auth_service");
		globalLogger.logger().info(`Login started using ${provider}`);
		const provider_class = master_provider.getProvider(provider);

		return (await provider_class.login(data, device, ip)) as string;
	}
	static async register(
		data: unknown[],
		device: string,
		ip: string,
		provider: string,
	): Promise<string> {
		globalLogger.logger().setService("auth_service");
		globalLogger.logger().info(`Registration started using ${provider}`);
		const provider_class = master_provider.getProvider(provider);

		return (await provider_class.register(data, device, ip)) as string;
	}
	static async logout(session: IUserSession) {
		globalLogger.logger().setService("auth_service");
		globalLogger.logger().info(`Logout started for user ${session.user}`);
		const user = await User.findById(session.user);
		if (!user) throw ApiError.badrequest("user to logout undefined");
		user.sessions = user.sessions.splice(
			user.sessions.findIndex((v) => v.sessionId == session.sessionId),
			1,
		);
		await user.save();
		globalLogger.logger().info(`Logout completed for user ${session.user}`);
	}
	static async closeSession(sessionId: string, userId: string) {
		globalLogger.logger().setService("auth_service");
		globalLogger.logger().info(`Close session started for user ${userId}`);
		const user = await User.findById(userId);
		if (!user) throw ApiError.badrequest("undefined user");
		const session = user.sessions.find((a) => a.sessionId == sessionId);
		if (!session) throw ApiError.badrequest("session to close undefined");
		await JWTService.banPairByFamilyId(session.familyId, session.sessionId);
		user.sessions.splice(
			user.sessions.findIndex((a) => a.sessionId == session.sessionId),
			1,
		);
		globalLogger.logger().info(`Close session completed for user ${userId}`);
	}
	static async refresh(refreshToken: string): Promise<IJWTPair> {
		globalLogger.logger().setService("auth_service");
		globalLogger.logger().info(`Refresh started`);
		await JWTService.checkBanByToken(refreshToken);
		const session = await JWTService.validateRefreshToken(refreshToken);

		const user = await User.findById(session.user);
		if (!user) throw ApiError.unauthorized("token is invalid");
		user.sessions.splice(
			user.sessions.findIndex((a) => a.sessionId == session.sessionId),
			1,
		);

		const familyId = JWTService.generateFamilyId();
		session.familyId = familyId;
		session.expiresAt = new Date(
			Date.now() + Number(process.env.SESSION_EXP_TIME),
		);

		user.sessions.push(session);

		await user.save();
		globalLogger.logger().info(`Refresh completed for user ${session.user}`);

		await JWTService.banPairByToken(refreshToken);
		const newPair = JWTService.generatePair(session, familyId);
		return newPair;
	}
	static async getAllSessions(userId: string) {
		globalLogger.logger().setService("auth_service");
		globalLogger.logger().info(`Get all sessions started for user ${userId}`);
		const user = await User.findById(userId);
		if (!user) throw ApiError.badrequest("user undefined");
		globalLogger.logger().info(`Get all sessions completed for user ${userId}`);
		return user.sessions;
	}
}
