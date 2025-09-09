import { ApiError } from "../../error/ApiError";
import { CodePair } from "../../models/CodePair";
import { JWTService } from "./JWTService";

export class CodeService {
	private static generateCode() {
		const allowed_str =
			"1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM-_&*@#!";
		let return_str = "";
		for (let x = 32; x > 0; x--) {
			return_str += allowed_str[Math.floor(Math.random() * allowed_str.length)];
		}
		return return_str;
	}
	private static generateClientCode() {
		return Math.floor(Math.random() * 899999) + 100000;
	}
	static async createCode(data) {
		const generateCode = this.generateCode();
		const clientCode = this.generateClientCode();

		const code_pair = new CodePair({
			clientCode: clientCode,
			cookieCode: generateCode,
			data,
		});

		await code_pair.save();
		return generateCode;
	}
	static async recieveCode(clientCode, codeCookie) {
		const decoded_cookie = await JWTService.verifyCode(codeCookie);
		const codePair = await CodePair.findOne({
			cookieCode: decoded_cookie,
			clientCode,
		});
		if (!codePair) throw ApiError.badrequest("Code is not accepted");

		return codePair.data;
	}
}
