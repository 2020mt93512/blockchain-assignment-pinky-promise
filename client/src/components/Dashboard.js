import React, { Component } from 'react';
import { Tabs, Tab, Typography, Stack, Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import TabPanel from './TabPanel';
import ViewAllPromises from './ViewAllPromises';
import ViewMyPromises from './ViewMyPromises';
import AddPromiseModal from './AddPromiseModal';

import { PinkyPromiseRecord } from '../models/PinkyPromiseRecord';
import { PinkyUserRecord } from '../models/PinkyUserRecord';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

class Dashboard extends Component {
	state = { currentTabIdx : 0, promisesList: [], addPromiseFormOpen: false, usersList: [] };

	componentDidMount() {
		this.getUsersList();
		this.getAllPinkyPromises();
	}

	getUsersList = async () => {
		const { contract } = this.props;
		try {
      const response = await contract.methods.getViewableUsers().call({ from: this.props.account });
      console.log(response.map(PinkyUserRecord.toJson));
			this.setState({ usersList: response.map(PinkyUserRecord.toJson) });
    } catch (error) {
      console.error(error);
    }
	}

	getAllPinkyPromises = async () => {
		const { contract } = this.props;
		try {
      const response = await contract.methods.getAllPromisesViewableByUser().call({ from: this.props.account });
      this.setState({ promisesList: response.map(PinkyPromiseRecord.toJson) });
    } catch (error) {
      console.error(error);
    }
	}

  handleTabChange = (_, newValue) => {
    this.setState({ currentTabIdx: newValue });
  };

	handleAddPromiseFormOpen = () => {
		this.setState({ addPromiseFormOpen: true });
	};

	handleAddPromiseFormClose = () => {
		this.setState({ addPromiseFormOpen: false });
	};

	addNewPromise = async (title, description, receivingUserId) => {
		const { contract } = this.props;
		try {
      await contract.methods.addPromise(title, description, receivingUserId).send({ from: this.props.account });
			this.handleAddPromiseFormClose();
    } catch (error) {
      console.error(error);
    }
	}

	render() {
		return (
			<Box padding={8}>
				<Stack spacing={2} direction="column" justifyContent="center" alignItems="center">
					<Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
            Hello, {this.props.user.name}
          </Typography>
					<Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
						<Tabs
							value={this.state.currentTabIdx}
							onChange={this.handleTabChange}
							variant="fullWidth"
						>
							<Tab label="All Promises" {...a11yProps(0)} />
							<Tab label="Your Promises" {...a11yProps(1)} />
						</Tabs>
					</Box>
					<TabPanel value={this.state.currentTabIdx} index={0}>
						<ViewAllPromises {...this.props} promisesList={this.state.promisesList} />
					</TabPanel>
					<TabPanel value={this.state.currentTabIdx} index={1}>
						<ViewMyPromises {...this.props} />
					</TabPanel>
				</Stack>
				<Fab color="primary" aria-label="add" sx={{ position: 'absolute', right: 16, bottom: 16 }} onClick={this.handleAddPromiseFormOpen}>
					<AddIcon />
				</Fab>
				<AddPromiseModal open={this.state.addPromiseFormOpen} handleAddPromiseFormClose={this.handleAddPromiseFormClose} usersList={this.state.usersList} addNewPromise={this.addNewPromise} />
			</Box>
		)
	}
}

export { Dashboard };