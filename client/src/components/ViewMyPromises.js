import React, { Component } from 'react';
import { Box, Stack, Typography } from '@mui/material'

import { PinkyPromiseRecord } from '../models/PinkyPromiseRecord';

import PinkyPromiseCard from './PinkyPromiseCard';

class ViewMyPromises extends Component {
	state = { promisesList: [] };

	componentDidMount() {
		this.getMyPinkyPromises();
	}

	getMyPinkyPromises = async () => {
		const { contract } = this.props;
		try {
      const response = await contract.methods.getPromisesByUserId().call({ from: this.props.account });
      this.setState({ promisesList: response.map(PinkyPromiseRecord.toJson) });
    } catch (error) {
      console.error(error);
    }
	}

	render() {
		return this.state.promisesList.length > 0 ?
			(this.state.promisesList.map(promiseItem => (
				<PinkyPromiseCard
					key={promiseItem.id}
					{...promiseItem}
					userId={this.props.user.id}
					completePromise={this.props.completePromise}
				/>
			))
		) : (
			<Box>
				<Stack direction="column" spacing={4} justifyContent="center" alignItems="center">
					<Typography variant="overline" display="block">
						No items here.
					</Typography>
					<Typography variant="overline" display="block"component="span">
						Begin by clicking the plus button to add a <Typography color="primary" component="span">Pinky Promise.</Typography>
					</Typography>
				</Stack>
			</Box>
		);
	}
}

export default ViewMyPromises;