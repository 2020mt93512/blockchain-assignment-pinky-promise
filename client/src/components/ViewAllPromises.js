import React, { Component } from 'react';
import { Box, Typography, Stack, Switch, FormControlLabel  } from '@mui/material'

import { PinkyPromiseContext } from '../context/PinkyPromiseContext';

import PinkyPromiseCard from './PinkyPromiseCard';

const switchLabel = { inputProps: { 'aria-label': 'Switch demo' } };

class ViewAllPromises extends Component {
	static contextType = PinkyPromiseContext;
	state = { showOnlyIncomplete: false };

	getUserNameFromId = (id) => {
		const userItem = this.context.usersList.find(item => item.id === id);
		return userItem ? userItem.name : null;
	}

	onSwitchChange = (event) => {
		this.setState({ showOnlyIncomplete: event.target.checked });
	}

	render() {
		const filteredAllPromises = this.context.allPromises.filter(item => !this.state.showOnlyIncomplete || (
			!(item.expiresIn !== 0 && Date.now() - item.expiresIn >= 0) &&
				(this.context.user.id === item.sharingUserId ? !item.completedBySharingUser :
					(this.context.user.id === item.receivingUserId ? !item.completedByReceivingUser : false))
		))

		return this.context.allPromises.length > 0 ?
			(<Box>
				<Stack spacing={2}>
					<FormControlLabel
						control={
							<Switch
								{...switchLabel}
								checked={this.state.showOnlyIncomplete}
								onChange={this.onSwitchChange}
							/>
						}
						label="Show only incomplete"
					/>
					{filteredAllPromises.sort((a, b) => b.id - a.id).map(promiseItem => (
						<PinkyPromiseCard
							key={promiseItem.id}
							{...promiseItem}
							userId={this.context.user.id}
							sharingUserName={this.getUserNameFromId(promiseItem.sharingUserId)}
							receivingUserName={this.getUserNameFromId(promiseItem.receivingUserId)}
							completePromise={this.props.completePromise}
						/>
					))}
				</Stack>
			</Box>) :
			(<Box>
				<Typography variant="overline" display="block">
						Such empty, much wow.
					</Typography>
			</Box>);
	}
}

export default ViewAllPromises;