import express from "express";
import { AuthServiceSelf } from "../services/auth/AuthService";
import { checkAuth } from "../middleware/checkAuth";
import { cookie, param, query } from "express-validator";
import { validationMiddleware } from "../middleware/validationMiddleware";
import { master_provider } from "../services/auth/providers/Provider";
const router = express.Router();

router.post(
	// #swagger.tags = ["Auth"]
	/*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
					$ref: "#/components/schemas/something"
				}
            }
        } 
    */
	"/login",
	query("provider").custom(async (value) =>
		master_provider.isAvalibleProvider(value),
	),
	validationMiddleware,
	async (req, res) => {
		const data = req.body;
		const ip = req.ip;
		const userAgent = req.headers["user-agent"];
		const { provider } = req.query;

		const cookieCode = await AuthServiceSelf.login(data, userAgent, ip, provider);

		res.cookie("code", cookieCode, {
			httpOnly: true,
			sameSite: "lax",
			secure: true,
			domain: process.env.COOKIE_DOMAIN,
			expires: new Date(Date.now() + 100 * 60 * 5),
		});
		res.status(200).json({ message: "Ok!" });
	},
);

router.post(
	// #swagger.tags = ["Auth"]
	/*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
					$ref: "#/components/schemas/something"
				}
            }
        } 
    */
	"/register",
	query("provider").custom(async (value) =>
		master_provider.isAvalibleProvider(value),
	),
	validationMiddleware,
	async (req, res) => {
		const data = req.body;
		const ip = req.ip;
		const userAgent = req.headers["user-agent"];
		const { provider } = req.query;

		const cookieCode = await AuthServiceSelf.register(
			data,
			userAgent,
			ip,
			provider,
		);

		res.cookie("code", cookieCode, {
			httpOnly: true,
			sameSite: "lax",
			secure: true,
			domain: process.env.COOKIE_DOMAIN,
			expires: new Date(Date.now() + 100 * 60 * 5),
		});
		res.status(200).json({ message: "Ok!" });
	},
);

router.get("/logout", checkAuth, async (req, res) => {
	// #swagger.tags = ["Auth"]
	// #swagger.security = [{ "bearerAuth": [] }]
	await AuthServiceSelf.logout(req.session);
	res.status(200).json({ message: "Success!" });
});

router.get("/check", checkAuth, (_req, res) => {
	// #swagger.tags = ["Auth"]
	// #swagger.security = [{ "bearerAuth": [] }]
	res.status(200).json({ message: "OK!" });
});

router.post(
	"/refresh",
	cookie("refresh").notEmpty().isJWT(),
	validationMiddleware,
	async (req, res) => {
		// #swagger.tags = ["Auth"]
		// #swagger.security = [{ "bearerAuth": [] }]
		const { refresh } = req.cookies;

		const result = await AuthServiceSelf.refresh(refresh);
		res.cookie("refresh", result.refreshToken, {
			domain: process.env.COOKIE_DOMAIN,
			sameSite: "lax",
			httpOnly: true,
			secure: true,
		});
		res.status(200).json({ authorization: result.accessToken });
	},
);

// router.post(
// 	// #swagger.tags = ["Auth"]
// 	"/login/google",
// 	body("accessToken").notEmpty().isJWT(),
// 	validationMiddleware,
// 	async (req, res) => {
// 		const { accessToken } = req.body;
// 		const ip = req.ip;
// 		const userAgent = req.headers["user-agent"];

// 		const result = await AuthServiceSelf.loginUsingGoogle(
// 			accessToken,
// 			userAgent,
// 			ip,
// 		);

// 		res.cookie("refresh", result.refreshToken, {
// 			domain: process.env.COOKIE_DOMAIN,
// 			sameSite: "lax",
// 			httpOnly: true,
// 			secure: true,
// 		});
// 		res.status(200).json({ authorization: result.accessToken });
// 	},
// );

router.get(
	// #swagger.tags = ["Auth"]
	// #swagger.security = [{ "bearerAuth": [] }]
	"/sesssion/close/:session",
	param("session")
		.notEmpty()
		.matches(/^\d+[-]\w{32}/),
	validationMiddleware,
	checkAuth,
	async (req, res) => {
		const { session } = req.params;
		const user = req.session.user;

		await AuthServiceSelf.closeSession(session, user.toString());

		res.json({ message: "Ok!" }).status(200);
	},
);

router.get("/session/all", checkAuth, async (req, res) => {
	// #swagger.tags = ["Auth"]
	// #swagger.security = [{ "bearerAuth": [] }]
	const user = req.session.user;

	const result = await AuthServiceSelf.getAllSessions(user.toString());

	res.json({ sessions: result }).status(200);
});

export default router;
