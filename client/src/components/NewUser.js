import React, { Component } from "react";
import { TextField, Typography, Button, Stack, Box } from '@mui/material';

import GlobalState from "../utils/GlobalState";
import { PinkyPromiseContext } from "../context/PinkyPromiseContext";

class NewUser extends Component {
	static contextType = PinkyPromiseContext;
	state = { name: '' };

	onNameChange = (event) => {
		this.setState({ name: event.target.value });
	}

	addNewUser = async () => {
    const contract = GlobalState.getContract();
    try {
      await contract.methods.addUser(this.state.name).send({ from: GlobalState.getAccount() });
			await this.context.getCurrentUser();
    } catch (error) {
      console.error(error);
    }
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
							<Button variant="contained" onClick={this.addNewUser}>Join</Button>
						</Stack>
				</Stack>
			</Box>
		);
	}
}

export default NewUser;