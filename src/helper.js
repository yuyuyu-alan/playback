import Config from "./config";

export default class Helper {
	static toHump(name) {
		return name.replace(/_(\w)/g, function (all, letter) {
			return letter.toUpperCase();
		});
	}

	static toLine(name) {
		return name.replace(/([A-Z])/g, "_$1").toLowerCase();
	}

	static optionsToForm(options) {
		let params = {};
		let properties = Object.getOwnPropertyNames(options);
		properties.forEach(property => {
			let value = options[property];
			if (value != null) {
				if (typeof value === 'boolean') {
					params[Helper.toLine(property)] = value ? 1 : 0;
				} else {
					params[Helper.toLine(property)] = value;
				}
			}
		});
		return params;
	}

	static getAccept(version = 'v2') {
		const _default = Config.api.accept;
		const v3 = Config.api.acceptV3;
		return version === 'v3' ? v3 : _default;
	}

	static deepCopy(data) {
		try {
			return JSON.parse(JSON.stringify(data));
		} catch (e) {
			return data;
		}
	}
}
