import React, { Component } from "react";
import { AppBar, Toolbar, Box, Typography, CircularProgress } from '@mui/material';

import PinkyPromiseContract from "./contracts/PinkyPromise.json";
import getWeb3 from "./getWeb3";
import { PinkyUserRecord } from "./models/PinkyUserRecord";

import NewUser from './components/NewUser';
import { Dashboard } from "./components/Dashboard";
import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null, contract: null, account: null, pinkyUser: null };

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
          this.setState({ web3, accounts, account, contract: instance }, this.initApp);
        }
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert('Failed to load web3, accounts, or contract. Check console for details.');
      console.error(error);
    }
  };

  initApp = async () => {
    const { contract } = this.state;
    try {
      const response = await contract.methods.getCurrentUser().call({ from: this.state.account });
      const user = PinkyUserRecord.toJson(response);
      console.log(user);
      if (user.id !== 0) {
        this.setState({ pinkyUser: user });
      } else {
        this.setState({ pinkyUser: null });
      }
    } catch (error) {
      console.error(error);
      this.setState({ pinkyUser: null });
    } finally {
    }
  }

  loadPinkyPromises = async () => {
    const { contract } = this.state;
    const response = await contract.methods.getAllPromisesViewableByUser().call({ from: this.state.account });
    console.log(response);
    this.setState({ allPinkyPromises: response });
  };

  addNewUser = async (name) => {
    const { contract } = this.state;
    try {
      await contract.methods.addUser(name).send({ from: this.state.account });
      console.log('user added');
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <Box height="100vh">
        {!this.state.web3 ? <CircularProgress /> :
        (<>
          <AppBar position="static">
            <Toolbar style={{display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'column' }}>
              <span style={{float: 'left'}}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Pinky Promise
                </Typography>
              </span>
              <span style={{float: 'right'}}>
                <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1 }}>
                  {this.state.account}
                </Typography>
              </span>
            </Toolbar>
          </AppBar>
          {this.state.pinkyUser ?
            <Dashboard account={this.state.account} user={this.state.pinkyUser} web3={this.state.web3} contract={this.state.contract} /> :
            <NewUser addNewUser={this.addNewUser} />
          }
        </>)}
      </Box>
    );
  }
}

export default App;
