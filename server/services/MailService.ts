import Mailgun from "mailgun.js";
import FormData from "form-data";

export class MailService {
	static async sendCode(code: string, email: string) {
		console.log(process.env.MAILGUN_KEY, email);
		const mailgun = new Mailgun(FormData);
		const client = mailgun.client({
			key: process.env.MAILGUN_KEY,
			username: "api",
		});

		await client.messages.create(process.env.MAILGUN_DOMAIN, {
			from: `Krya Krya Team Support <support.krya.krya.team@${process.env.MAILGUN_DOMAIN}>`,
			to: [email],
			text: `Hello here is your code: ${code}`,
			html: `<h1>Hello here is your code: ${code}</h1>`,
			subject: "Activate your account!",
		});
	}
}
