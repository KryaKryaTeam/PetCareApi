import { Provider } from "./Provider";

new (class GoogleProvider extends Provider {
	constructor() {
		super({ token: { type: "string" } }, "google");
	}
	async login() {}
	async register() {}
})();
