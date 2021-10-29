# Pinky Promise
A decentralized application (dApp) that helps you keep track of pinky promises between you and your friends.

## Setting up the environment
- You need to have NodeJS installed (use the latest LTS version, but anything above 12.x.x should be good)
- Install [truffle](https://www.trufflesuite.com/docs/truffle/getting-started/installation) globally.
  ```bash
	npm install -g truffle
	```
-	Install [ganache](https://www.trufflesuite.com/ganache). Follow the steps based on your OS.
	![Ganache installer](/examples/install-ganache.png?raw=true "Ganache installer")
	* Use the quick setup option to have a test blockchain running with a single click.
	![Ganache running](/examples/ganache-running.png?raw=true "Ganache running")
	* If you want more ether to work with, you can go to Settings > Accounts & Keys, and update the Account Default Balance value. Please note that this will reset your blockchain and you will have to redeploy your contracts.
  ![Increasing starting eth](/examples/increase-starting-eth.png?raw=true "Increasing starting eth")
- Install the [Metamask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en) browser extension.
  * Modify the Localhost server config to point to your ganache instance. In my case, I had to change the port to 7545, and verify that the Client ID is 1337. (which are the defaults for the quick setup ganache blockchain)
  ![Metamask server update](/examples/metamask-server-update.png?raw=true "Metamask server update")
  * Select "Localhost 7545" server and import few accounts from ganache into Metamask.
  ![Import account metamask](/examples/import-account-metamask.png?raw=true "Import account metamask")
	![Get private key](/examples/get-private-key.png?raw=true "Get private key")
	![Add private key](/examples/paste-private-key.png?raw=true "Add private key")

## Setting up the project
- Clone the repository
  ```bash
	git clone git@github.com:2020mt93512/blockchain-assignment-pinky-promise.git
	```
- Make sure your ganache instance is running.
- From the root of the project, run the following command:
  ```bash
	truffle migrate
	```
	This command will ensure the latest copy of the contracts are deployed in the blockchain. _This needs gas!_
- Start the development server for the client dApp by running the following command:
  ```bash
	cd client && npm run start
	```
- If you setup is working and the contracts are deployed correctly, you should see a Metamask transaction popup asking you to confirm.
	![Project setup 1](/examples/project-setup-1.png?raw=true "Project setup 1")
	![Project setup 2](/examples/project-setup-2.png?raw=true "Project setup 2")
	![Project setup 3](/examples/project-setup-3.png?raw=true "Project setup 3")
	![Running app](/examples/running-app.png?raw=true "Running app")