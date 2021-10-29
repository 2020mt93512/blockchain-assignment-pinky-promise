import React, { Component } from 'react';
import { Box, Typography } from '@mui/material'

import { PinkyPromiseRecord } from '../models/PinkyPromiseRecord';

import PinkyPromiseCard from './PinkyPromiseCard';

class ViewAllPromises extends Component {
	state = { promisesList: [] };

	componentDidMount() {
		this.getAllPinkyPromises();
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
				<Typography variant="overline" display="block">
						Such empty, much wow.
					</Typography>
			</Box>
		);
	}
}

export default ViewAllPromises;