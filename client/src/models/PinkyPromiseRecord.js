const PinkyPromiseRecord = {
	toJson(params) {
		return {
			id: +params[0],
			title: params[1],
			description: params[2],
			createdAt: +params[3],
			completedBySharingUser: !!params[4],
			completedByReceivingUser: !!params[5],
			sharingUserId: +params[6],
			receivingUserId: +params[7]
		};
	}
}

export { PinkyPromiseRecord };