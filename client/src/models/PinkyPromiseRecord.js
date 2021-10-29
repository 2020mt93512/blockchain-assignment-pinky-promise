const PinkyPromiseRecord = {
	toJson(params) {
		return {
			id: +params[0],
			title: params[1],
			description: params[2],
			createdAt: (+params[3]) * 1000,
			sharingUserId: +params[4],
			completedBySharingUser: !!params[5],
			completedBySharingUserAt: (+params[6]) * 1000,
			receivingUserId: +params[7],
			completedByReceivingUser: !!params[8],
			completedByReceivingUserAt: (+params[9]) * 1000,
			expiresIn: (+params[10]) * 1000
		};
	}
}

export { PinkyPromiseRecord };