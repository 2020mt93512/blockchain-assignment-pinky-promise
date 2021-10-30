import React, { Component } from 'react';
import { Box, Stack, Typography } from '@mui/material'

import { PinkyPromiseContext } from '../context/PinkyPromiseContext';

import PinkyPromiseCard from './PinkyPromiseCard';

class ViewMyPromises extends Component {
	static contextType = PinkyPromiseContext;

	getUserNameFromId = (id) => {
		const userItem = this.context.usersList.find(item => item.id === id);
		return userItem ? userItem.name : null;
	}

	render() {
		return this.context.myPromises.length > 0 ?
			(this.context.myPromises.sort((a, b) => b.id - a.id).map(promiseItem => (
				<PinkyPromiseCard
					key={promiseItem.id}
					{...promiseItem}
					userId={this.context.user.id}
					sharingUserName={this.getUserNameFromId(promiseItem.sharingUserId)}
					receivingUserName={this.getUserNameFromId(promiseItem.receivingUserId)}
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