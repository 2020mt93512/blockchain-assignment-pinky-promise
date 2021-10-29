import React, { Component } from 'react';
import { Modal, TextField, Button, Box, Stack, Typography, MenuItem } from '@mui/material';

class AddPromiseModal extends Component {
	state = { title: '', description: '', receivingUserId: 0 };

	onTitleChange = (event) => {
		this.setState({ title: event.target.value });
	}

	onDescriptionChange = (event) => {
		this.setState({ description: event.target.value });
	}

	onReceivingUserIdChange = (event) => {
		this.setState({ receivingUserId: event.target.value });
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
						border: '2px solid #000',
						boxShadow: 24,
						p: 4,
					}}>
						<Typography variant="h6" component="h2">
							Add new promise
						</Typography>
						<Stack spacing={2} direction="column" padding={8}>
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
							<Stack spacing={2} direction="row" justifyContent="center">
								<Button variant="outlined" onClick={this.props.handleAddPromiseFormClose}>Cancel</Button>
								<Button
									variant="contained"
									onClick={() => this.props.addNewPromise(this.state.title, this.state.description, this.state.receivingUserId)}
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