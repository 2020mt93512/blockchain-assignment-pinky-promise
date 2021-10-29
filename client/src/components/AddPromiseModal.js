import React, { Component } from 'react';
import * as moment from 'moment';
import { Modal, TextField, Button, Box, Stack, Typography, MenuItem } from '@mui/material';
import AdapterMoment from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';

class AddPromiseModal extends Component {
	state = { title: '', description: '', receivingUserId: 0, expiresIn: null };

	onTitleChange = (event) => {
		this.setState({ title: event.target.value });
	}

	onDescriptionChange = (event) => {
		this.setState({ description: event.target.value });
	}

	onReceivingUserIdChange = (event) => {
		this.setState({ receivingUserId: event.target.value });
	}

	onExpiresInChange = (newValue) => {
		this.setState({ expiresIn: newValue });
	}

	render() {
		return (
			<Modal
					open={this.props.open}
					onClose={this.props.handleAddPromiseFormClose}
					aria-labelledby="add-promise"
				>
					<Box sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						height: 500,
						width: 700,
						bgcolor: 'background.paper',
						boxShadow: 24,
						p: 4,
					}}>
						<Typography variant="h6" component="div">
							Add a new <Typography variant="h6" color="primary" component="span">Pinky Promise</Typography>
						</Typography>
						<Stack spacing={4} direction="column" padding={2}>
							<TextField
								id="title"
								label="Title"
								variant="outlined"
								value={this.state.title}
								onChange={this.onTitleChange}
							/>
							<TextField
								id="description"
								label="Description"
								variant="outlined"
								value={this.state.description}
								onChange={this.onDescriptionChange}
							/>
							<TextField
								id="select-receiving-user-id"
								select
								label="Select Receiving User Id"
								value={this.state.receivingUserId}
								onChange={this.onReceivingUserIdChange}
								disabled={!this.props.usersList.length}
							>
								{this.props.usersList.map((user) => (
									<MenuItem key={user.addr} value={user.id}>
										{user.name} ({user.addr})
									</MenuItem>
								))}
							</TextField>
							<LocalizationProvider dateAdapter={AdapterMoment}>
								<DateTimePicker
									renderInput={(props) => <TextField {...props} helperText={this.state.expiresIn ? moment(this.state.expiresIn).fromNow() : 'No Expiry'} />}
									label="Expires In"
									value={this.state.expiresIn}
									onChange={this.onExpiresInChange}
								/>
							</LocalizationProvider>
							<Stack spacing={2} direction="row" justifyContent="center">
								<Button variant="outlined" onClick={this.props.handleAddPromiseFormClose}>Cancel</Button>
								<Button
									variant="contained"
									onClick={() => this.props.addNewPromise(this.state.title, this.state.description, this.state.receivingUserId, this.state.expiresIn)}
									disabled={!this.state.title || !this.state.description || !this.state.receivingUserId}
								>
									Add
								</Button>
							</Stack>
						</Stack>
					</Box>
				</Modal>
		);
	}
}

export default AddPromiseModal;