import React, { Component } from "react";
import { AppBar, Toolbar, Box, Typography, CircularProgress } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import PinkyPromiseContract from "./contracts/PinkyPromise.json";
import GlobalState from "./utils/GlobalState";
import getWeb3 from "./getWeb3";
import { PinkyPromiseContext, PinkyPromiseProvider } from "./context/PinkyPromiseContext";

import NewUser from './components/NewUser';
import { Dashboard } from "./components/Dashboard";
import "./App.css";

class App extends Component {
	static contextType = PinkyPromiseContext;
  state = { web3: null, accounts: null, contract: null, account: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PinkyPromiseContract.networks[networkId];
      const instance = new web3.eth.Contract(
        PinkyPromiseContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      web3.eth.getCoinbase((err, account) => {
        if (err === null) {
          GlobalState.setWeb3(web3);
          GlobalState.setAccounts(accounts);
          GlobalState.setAccount(account);
          GlobalState.setContract(instance);
          this.setState({ web3, accounts, account, contract: instance }, this.initApp);
        }
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert('Failed to load web3, accounts, or contract. Check console for details.');
      console.error(error);
    }
  };

  initApp = () => {
    this.context.getCurrentUser();
  }

  render() {
    return (
      <Box height="100vh">
        {!this.state.web3 ? <CircularProgress /> :
        (<>
          <AppBar position="static">
            <Toolbar style={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'column' }}>
              <span style={{ float: 'left', display: 'flex', flex: 1, flexGrow: 1 }}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Pinky Promise
                </Typography>
              </span>
              <span style={{ float: 'right', display: 'flex', flexDirection: 'row' }}>
                <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1 }} marginRight={2}>
                  {this.state.account}
                </Typography>
                <AccountCircleIcon />
              </span>
            </Toolbar>
          </AppBar>
          {this.context.user ?
            <Dashboard /> :
            !this.context.loading ? <NewUser /> : null
          }
        </>)}
      </Box>
    );
  }
}

const RootApp = () => (
  <PinkyPromiseProvider>
    <App />
  </PinkyPromiseProvider>
)

export default RootApp;
