# Pinky Promise
A decentralized application (dApp) that helps you keep track of pinky promises and dares between you and your friends.

![Main Page](/examples/main-page.png?raw=true "Main Page")

### Features
- You can create a *Pinky Promise*, which is like a _verbal contract_ between two users who are registered in the dApp. The idea is to capture real-life scenarios like "I will do it if you will do it too!" in all its digital, immutable glory!
- Once a promise is created between two users (the *sharing* and *receiving* user), each individual can work to complete the promise, and upload an image as proof of completing the task.
- Both people can view the images attached by each other.
- Each promise can also be time-bound, beyond which neither user will be able to mark a promise as complete.

## Table of Contents
- [Pinky Promise](#pinky-promise)
	- [Table of Contents](#table-of-contents)
	- [Screenshots](#screenshots)
	- [Setting up the environment](#setting-up-the-environment)
	- [Running the project](#running-the-project)
	- [Setting up the project](#setting-up-the-project)

## Screenshots
![Create user](/examples/create-user.png?raw=true "Create user")
![Your promises](/examples/your-promises.png?raw=true "Your promises")
![Add new promise](/examples/add-new-promise.png?raw=true "Add new promise")
![View incomplete promises](/examples/incomplete-promises.png?raw=true "View incomplete promises")
![Upload promise image](/examples/upload-promise-image.png?raw=true "Upload promise image")
![Completed pinky promises](/examples/completed-pinky-promises.png?raw=true "Completed pinky promises")

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

## Running the project
- Make sure your ganache instance is running, and you have the Metamask extension installed.
- From the root directory, make a fresh build of the contracts using the following command:
  ```bash
	truffle migrate --reset
	```
- Move into the `client` directory and install the node package dependencies for the front-end code using the following command:
  ```bash
	cd client && npm install
	```
- Run the following command to build and deploy the production front-end code using `live-server`:
  ```bash
	npm run deploy
	```
- This will open the application in your default browser, under the URL [http://127.0.0.1:3000](http://127.0.0.1:3000).
- Connect your local ganache wallet(s) to Metamask for the above URL.
	![Connect with metamask 1](/examples/connect-with-metamask-1.png?raw=true "Connect with metamask 1")
	![Connect with metamask 2](/examples/connect-with-metamask-2.png?raw=true "Connect with metamask 2")
- You should now be able to use the app!
  ![Create user](/examples/create-user.png?raw=true "Create user")

## Setting up the project
- Clone the repository
  ```bash
	git clone git@github.com:2020mt93512/blockchain-assignment-pinky-promise.git
	```
- Make sure your ganache instance is running, and you have the Metamask extension installed.
- From the root of the project, run the following command:
  ```bash
	truffle migrate
	```
	This command will ensure the latest copy of the contracts are deployed in the blockchain. _This needs gas!_
- Install the node package dependencies for the front-end code using the following command:
  ```bash
	cd client && npm install
	```
- From the `client` directory, start the development server for the client dApp by running the following command:
  ```bash
	npm run start
	```
- If you setup is working and the contracts are deployed correctly, you should see a Metamask transaction popup asking you to confirm.
	![Project setup 1](/examples/project-setup-1.png?raw=true "Project setup 1")
	![Project setup 2](/examples/project-setup-2.png?raw=true "Project setup 2")
	![Project setup 3](/examples/project-setup-3.png?raw=true "Project setup 3")
	![Running app](/examples/running-app.png?raw=true "Running app")