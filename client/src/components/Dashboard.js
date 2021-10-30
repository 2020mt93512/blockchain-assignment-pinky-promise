import React, { Component } from 'react';
import { Tabs, Tab, Typography, Stack, Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import TabPanel from './TabPanel';
import ViewAllPromises from './ViewAllPromises';
import ViewMyPromises from './ViewMyPromises';
import AddPromiseModal from './AddPromiseModal';
import GlobalState from '../utils/GlobalState';
import { PinkyPromiseContext } from '../context/PinkyPromiseContext';
import CompletePromiseModal from './CompletePromiseModal';

const a11yProps = (index) => ({
	id: `simple-tab-${index}`,
	'aria-controls': `simple-tabpanel-${index}`,
});

class Dashboard extends Component {
	static contextType = PinkyPromiseContext;
	state = { currentTabIdx : 0, addPromiseFormOpen: false, completePromiseFormOpen: false, completingPromiseId: null, isSharingUserCompleting: false };

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

	completePromise = async (imgHash) => {
		const contract = GlobalState.getContract();
		console.log(this.state);
		try {
			if (this.state.isSharingUserCompleting) {
				await contract.methods.completePromiseAsSharingUser(this.state.completingPromiseId, imgHash)
					.send({ from: GlobalState.getAccount() });
			} else {
				await contract.methods.completePromiseAsReceivingUser(this.state.completingPromiseId, imgHash)
					.send({ from: GlobalState.getAccount() });
			}
			this.handleCompletePromiseFormClose();
    } catch (error) {
      console.error(error);
    }
	}

  handleTabChange = (_, newValue) => {
    this.setState({ currentTabIdx: newValue });
  };

	handleAddPromiseFormOpen = async () => {
		await this.context.getUsersList();
		this.setState({ addPromiseFormOpen: true });
	};

	handleAddPromiseFormClose = () => {
		this.setState({ addPromiseFormOpen: false });
	};

	onClickCompletePromise = (promiseId, isSharingUser) => {
		this.setState({ completePromiseFormOpen: true, completingPromiseId: promiseId, isSharingUserCompleting: isSharingUser });
	}

	handleCompletePromiseFormClose = () => {
		this.setState({ completePromiseFormOpen: false });
	}

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
						<ViewMyPromises {...this.props} onClickCompletePromise={this.onClickCompletePromise} />
					</TabPanel>
					<TabPanel value={this.state.currentTabIdx} index={1}>
						<ViewAllPromises {...this.props} onClickCompletePromise={this.onClickCompletePromise} />
					</TabPanel>
				</Stack>
				<Fab color="primary" aria-label="add" sx={{ position: 'absolute', right: 16, bottom: 16 }} onClick={this.handleAddPromiseFormOpen}>
					<AddIcon />
				</Fab>
				<AddPromiseModal open={this.state.addPromiseFormOpen} onClickClose={this.handleAddPromiseFormClose} onClickOk={this.addNewPromise} />
				<CompletePromiseModal
					open={this.state.completePromiseFormOpen}
					onClickClose={this.handleCompletePromiseFormClose}
					onClickOk={this.completePromise}
				/>
			</Box>
		)
	}
}

export { Dashboard };