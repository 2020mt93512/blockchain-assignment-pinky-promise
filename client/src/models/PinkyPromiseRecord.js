const PinkyPromiseRecord = {
	toJson(params) {
		return {
			id: +params[0],
			title: params[1],
			description: params[2],
			createdAt: (+params[3]) * 1000,
			sharingUserId: +params[4],
			completedBySharingUserAt: (+params[5]) * 1000,
			receivingUserId: +params[6],
			completedByReceivingUserAt: (+params[7]) * 1000,
			expiresIn: (+params[8]) * 1000,
			sharingUserImgHash: params[9] ? params[9] : '',
			receivingUserImgHash: params[10] ? params[10] : '',
		};
	}
}

export { PinkyPromiseRecord };