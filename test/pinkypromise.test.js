const PinkyPromise = artifacts.require("./PinkyPromise.sol");

contract("PinkyPromise", accounts => {
	let pinkyPromiseInstance;

	before(async () => {
		pinkyPromiseInstance = await PinkyPromise.deployed();
	});

	describe('deployment', async () => {
		it('deploys successfully', async () => {
			const address = await pinkyPromiseInstance.address
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it('has a name', async () => {
			const name = await pinkyPromiseInstance.name();
      assert.equal(name, 'PinkyPromise');
    });
	});

	describe('user management', async () => {
		before(async () => {
			await pinkyPromiseInstance.addUser('test user', { from: accounts[0] });
			usersCount = await pinkyPromiseInstance.usersCount();
			user = await pinkyPromiseInstance.users(usersCount);
		});

		it("should add a new user", async () => {
			assert.equal(usersCount, 1);
			assert.equal(user.id.toNumber(), usersCount.toNumber());
      assert.equal(user.name, 'test user');
			const userId = await pinkyPromiseInstance.userIdByAddr(accounts[0]);
			assert.equal(userId.toNumber(), 1);
		});

		it('should get all viewable users for given user', async () => {
			let user1ViewableUsers = await pinkyPromiseInstance.getViewableUsers({ from: accounts[0] });
			assert.equal(user1ViewableUsers.length, 0);

			await pinkyPromiseInstance.addUser('test user 2', { from: accounts[1] });
			user1ViewableUsers = await pinkyPromiseInstance.getViewableUsers({ from: accounts[0] });
			assert.equal(user1ViewableUsers.length, 1);
			assert.deepEqual(user1ViewableUsers.map(item => item[0]), ['2']);
		});
	});

	describe('promises management', async () => {
		before(async () => {
			// test user for trying promise addition
			await pinkyPromiseInstance.addUser('test user 3', { from: accounts[2] });
			await pinkyPromiseInstance.addPromise('promise title 1', 'promise description 1', 2, { from: accounts[0] });
			await pinkyPromiseInstance.addPromise('promise title 2', 'promise description 2', 2, { from: accounts[0] });
			await pinkyPromiseInstance.addPromise('promise title 3', 'promise description 3', 1, { from: accounts[2] });
			await pinkyPromiseInstance.addPromise('promise title 4', 'promise description 4', 1, { from: accounts[1] });
		});

		it('should add a new promise for the user', async () => {
			const promisesCount = await pinkyPromiseInstance.promisesCount();
			assert.equal(promisesCount, 4);
			const firstPromise = await pinkyPromiseInstance.promises(1);
			assert.equal(firstPromise.id.toNumber(), 1);
			assert.equal(firstPromise.title, 'promise title 1');
			assert.equal(firstPromise.description, 'promise description 1');
			assert.equal(firstPromise.sharingUserId.toNumber(), 1);
			assert.equal(firstPromise.receivingUserId.toNumber(), 2);

			user = await pinkyPromiseInstance.users(1);
			assert.equal(user.totalPromises, 2);
		});

		it('should return the user promises', async () => {
			const user1Promises = await pinkyPromiseInstance.getPromisesByUserId({ from: accounts[0] });
			assert.equal(user1Promises.length, 2);
			const user2Promises = await pinkyPromiseInstance.getPromisesByUserId({ from: accounts[1] });
			assert.equal(user2Promises.length, 1);
			const user3Promises = await pinkyPromiseInstance.getPromisesByUserId({ from: accounts[2] });
			assert.equal(user3Promises.length, 1);
		});

		it('should return all the promises that should be visible to the user', async () => {
			const user1Promises = await pinkyPromiseInstance.getAllPromisesViewableByUser({ from: accounts[0] });
			assert.equal(user1Promises.length, 4);
			assert.deepEqual(user1Promises.map(item => item[0]), ['1', '2', '3', '4']);
			const user2Promises = await pinkyPromiseInstance.getAllPromisesViewableByUser({ from: accounts[1] });
			assert.equal(user2Promises.length, 3);
			assert.deepEqual(user2Promises.map(item => item[0]), ['1', '2', '4']);
			const user3Promises = await pinkyPromiseInstance.getAllPromisesViewableByUser({ from: accounts[2] });
			assert.equal(user3Promises.length, 1);
			assert.deepEqual(user3Promises.map(item => item[0]), ['3']);
		});
	});
});
