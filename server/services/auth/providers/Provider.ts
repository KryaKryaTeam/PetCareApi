import { ApiError } from "../../../error/ApiError";

export class Provider {
	private schema;

	constructor(shema, name: string) {
		this.schema = shema;

		master_provider.addProvider(this, name);
	}
	async login(..._args: unknown[]): Promise<unknown> {
		throw ApiError.badrequest("This function for this provider is unavalible");
	}
	async register(..._args: unknown[]): Promise<unknown> {
		throw ApiError.badrequest("This function for this provider is unavalible");
	}
	async refreshPassword(..._args: unknown[]): Promise<unknown> {
		throw ApiError.badrequest("This function for this provider is unavalible");
	}
}

class MasterProvider {
	private avalible_providers: Map<string, Provider>;

	constructor() {
		this.avalible_providers = new Map();
	}

	addProvider(provider: Provider, name: string) {
		this.avalible_providers.set(name, provider);
	}

	isAvalibleProvider(name: string): boolean {
		return this.avalible_providers.has(name);
	}

	getProvider(name: string) {
		console.log(name, this.avalible_providers.get("self"));
		return this.avalible_providers.get(name);
	}
}

export const master_provider = new MasterProvider();
