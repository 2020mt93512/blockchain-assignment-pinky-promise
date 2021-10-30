const GlobalState = {
	init() {
		this._web3 = null;
		this._accounts = null;
		this._account = null;
		this._contract = null;
	},
	getWeb3() {
		return this._web3;
	},
	getAccounts() {
		return this._accounts;
	},
	getAccount() {
		return this._account;
	},
	getContract() {
		return this._contract;
	},
	setWeb3(newWeb3) {
		this._web3 = newWeb3;
	},
	setAccounts(newAccounts) {
		this._accounts = newAccounts;
	},
	setAccount(newAccount) {
		this._account = newAccount;
	},
	setContract(newContract) {
		this._contract = newContract;
	}
};

export default GlobalState;