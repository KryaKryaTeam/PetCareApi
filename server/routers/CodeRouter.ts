import express from "express";
import { cookie, query } from "express-validator";
import { CodeService } from "../services/auth/CodeService";
const router = express.Router();

router.get(
	"/recive/auth",
	cookie("code").notEmpty(),
	query("code").notEmpty(),
	async (req, res) => {
		const clientCode = req.query.code;
		const { code } = req.cookies;
		const res_ = await CodeService.recieveCode<{
			accessToken: string;
			refreshToken: string;
		}>(clientCode, code, ["accessToken", "refreshToken"]);

		res.cookie("refresh", res_.refreshToken, {
			sameSite: "lax",
			secure: true,
			httpOnly: true,
			domain: process.env.COOKIE_DOMAIN,
		});
		res.json({ auth: res_.accessToken }).status(200);
	},
);

export default router;
