import React, { Component } from "react";

import { TextField, Typography, Button, Stack, Box } from '@mui/material';

class NewUser extends Component {
	state = { name: '' };

	onNameChange = (event) => {
		this.setState({ name: event.target.value });
	}

	render() {
		return (
			<Box padding={8}>
				<Stack spacing={2} direction="column" justifyContent="center" alignItems="center">
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Enter name to continue
          </Typography>
					<Stack spacing={2} direction="column">
							<TextField
								id="name"
								label="Name"
								variant="outlined"
								value={this.state.name}
								onChange={this.onNameChange}
							/>
							<Button variant="contained" onClick={() => this.props.addNewUser(this.state.name)}>Join</Button>
						</Stack>
				</Stack>
			</Box>
		);
	}
}

export default NewUser;