import React, { Component } from 'react';
import { Tabs, Tab, Typography, Stack, Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import TabPanel from './TabPanel';
import ViewAllPromises from './ViewAllPromises';
import ViewMyPromises from './ViewMyPromises';
import AddPromiseModal from './AddPromiseModal';
import GlobalState from '../utils/GlobalState';
import { PinkyPromiseContext } from '../context/PinkyPromiseContext';

const a11yProps = (index) => ({
	id: `simple-tab-${index}`,
	'aria-controls': `simple-tabpanel-${index}`,
});

class Dashboard extends Component {
	static contextType = PinkyPromiseContext;
	state = { currentTabIdx : 0, addPromiseFormOpen: false };

	addNewPromise = async (title, description, receivingUserId, expiresIn) => {
		const contract = GlobalState.getContract();
		try {
      await contract.methods.addPromise(title, description, receivingUserId, expiresIn ? expiresIn.unix() : 0)
				.send({ from: GlobalState.getAccount() });
			this.handleAddPromiseFormClose();
    } catch (error) {
      console.error(error);
    }
	}

	completePromise = async (promiseId, isSharingUser) => {
		const contract = GlobalState.getContract();
		try {
			if (isSharingUser) {
				await contract.methods.completePromiseAsSharingUser(promiseId).send({ from: GlobalState.getAccount() });
			} else {
				await contract.methods.completePromiseAsReceivingUser(promiseId).send({ from: GlobalState.getAccount() });
			}
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

	render() {
		return (
			<Box padding={8}>
				<Stack spacing={2} direction="column" justifyContent="center" alignItems="center">
					<Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
            Hello, {this.context.user.name}
          </Typography>
					<Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
						<Tabs
							value={this.state.currentTabIdx}
							onChange={this.handleTabChange}
							variant="fullWidth"
						>
							<Tab label="Your Promises" {...a11yProps(0)} />
							<Tab label="All Promises" {...a11yProps(1)} />
						</Tabs>
					</Box>
					<TabPanel value={this.state.currentTabIdx} index={0}>
						<ViewMyPromises {...this.props} completePromise={this.completePromise} />
					</TabPanel>
					<TabPanel value={this.state.currentTabIdx} index={1}>
						<ViewAllPromises {...this.props} completePromise={this.completePromise} />
					</TabPanel>
				</Stack>
				<Fab color="primary" aria-label="add" sx={{ position: 'absolute', right: 16, bottom: 16 }} onClick={this.handleAddPromiseFormOpen}>
					<AddIcon />
				</Fab>
				<AddPromiseModal open={this.state.addPromiseFormOpen} handleAddPromiseFormClose={this.handleAddPromiseFormClose} addNewPromise={this.addNewPromise} />
			</Box>
		)
	}
}

export { Dashboard };