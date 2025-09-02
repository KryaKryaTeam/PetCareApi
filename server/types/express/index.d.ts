import { Logger } from "../../utils/logger";
import { IUserSession, IUserModel } from "../../models/User";

export {}; // Make this file an external module

declare global {
	namespace Express {
		interface Request {
			logger: Logger;
			session?: IUserSession;
			user?: IUserModel;
		}
	}
}
