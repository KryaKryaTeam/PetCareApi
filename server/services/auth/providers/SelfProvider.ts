import User, { IAuthSource } from "../../../models/User";
import { globalLogger } from "../../../utils/logger";
import { Provider } from "./Provider";
import { ApiError } from "../../../error/ApiError";
import { HashService } from "../HashService";
import { JWTService } from "../JWTService";
import { SessionService } from "../SessionService";
import { CodeService } from "../CodeService";

type TSelfProviderAuthSourceData = {
	hash: string;
};
type TSelfProviderAuthSource = IAuthSource<TSelfProviderAuthSourceData>;

export class SelfProvider extends Provider {
	constructor() {
		super({ username: { type: "string" }, password: { type: "string" } }, "self");
	}
	async login(
		{ username, password }: { username: string; password: string },
		device: string,
		ip: string,
	): Promise<string> {
		globalLogger.logger().setService("auth_service.self_provider");
		globalLogger.logger().info("Start login by self provider");
		const user = await User.findOne({ username });
		if (!user)
			throw ApiError.badrequest(
				"Login is failed, user with this username is undefined",
			);

		const authSource = user.authSources.find(
			(a) => a.provider == "self",
		) as TSelfProviderAuthSource | null;

		if (!authSource)
			throw ApiError.badrequest(
				"User is not have auth source for this provider: self",
			);

		console.log(authSource.data.hash, password);
		const hash_check = await HashService.check(authSource.data.hash, password);
		if (!hash_check) throw ApiError.badrequest("Password is inccorect");

		const familyId = await JWTService.generateFamilyId();
		const session = await SessionService.generateNew(
			device,
			ip,
			authSource.provider,
			user.id,
			familyId,
		);
		const tokens = await JWTService.generatePair(session, familyId);
		user.sessions = [...user.sessions, session];

		const code = await CodeService.createCode(tokens, user.email);
		return code;
	}
	async register(
		{
			username,
			password,
			email,
		}: { username: string; password: string; email: string },
		device: string,
		ip: string,
	): Promise<string> {
		globalLogger.logger().setService("auth_service.self_provider");
		globalLogger.logger().info("Start register by self provider");
		const user = new User({ username, email });

		const hash = await HashService.hash(password);

		user.authSources = [{ provider: "self", data: { password: hash } }];

		const familyId = await JWTService.generateFamilyId();
		const session = await SessionService.generateNew(
			device,
			ip,
			"self",
			user.id,
			familyId,
		);
		const tokens = await JWTService.generatePair(session, familyId);
		user.sessions = [...user.sessions, session];

		const code = await CodeService.createCode(tokens, user.email);
		await user.save();
		return code;
	}
	async refreshPassword(username: string, new_password: string): Promise<void> {
		globalLogger.logger().setService("auth_service.self_provider");
		globalLogger.logger().info("Start refresh password by self provider");
		const user = await User.findOne({ username });
		if (!user)
			throw ApiError.badrequest(
				"Login is failed, user with this username is undefined",
			);

		const authSource = user.authSources.find(
			(a) => a.provider == "self",
		) as TSelfProviderAuthSource | null;

		if (!authSource)
			throw ApiError.badrequest(
				"User is not have auth source for this provider: self",
			);

		user.authSources = user.authSources.splice(
			user.authSources.findIndex((a) => a.provider == "self"),
			1,
		);

		const hash = await HashService.hash(new_password);

		user.authSources = [{ provider: "self", data: { password: hash } }];

		await user.save();
	}
}
