const PinkyUserRecord = {
	toJson(params) {
		return {
			id: +params[0],
			addr: params[1],
			name: params[2],
			totalPromises: +params[3]
		};
	}
}

export { PinkyUserRecord };