import { ApiError } from "../../error/ApiError";
import { CodePair } from "../../models/CodePair";
import { MailService } from "../MailService";
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
	static async createCode(data, email) {
		const generateCode = this.generateCode();
		const clientCode = this.generateClientCode();

		const code_pair = new CodePair({
			clientCode: clientCode,
			cookieCode: generateCode,
			data,
		});

		await MailService.sendCode(String(clientCode), email);
		await code_pair.save();
		return await JWTService.signCode(generateCode);
	}
	static async recieveCode<T = unknown>(
		clientCode,
		codeCookie,
		predictedFields: string[],
	): Promise<T> {
		const decoded_cookie = await JWTService.verifyCode(codeCookie);
		const codePair = await CodePair.findOne({
			cookieCode: decoded_cookie,
			clientCode,
		});
		if (!codePair) throw ApiError.badrequest("Code is not accepted");
		if (Array.from(Object.keys(codePair.data)).length != predictedFields.length)
			for (const key in Object.keys(codePair.data)) {
				if (!predictedFields.includes(key))
					throw ApiError.badrequest("This code doesn't contain predicted values");
			}

		await codePair.deleteOne();

		return codePair.data as T;
	}
}
