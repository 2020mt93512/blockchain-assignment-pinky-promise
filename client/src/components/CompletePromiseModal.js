import React, { Component } from 'react';
import { Modal, Box, Stack, Typography } from '@mui/material';

import UploadImage from './UploadImage';

import { PinkyPromiseContext } from '../context/PinkyPromiseContext';

class CompletePromiseModal extends Component {
	static contextType = PinkyPromiseContext;

	render() {
		return (
			<Modal
					open={this.props.open}
					onClose={this.props.handleCompletePromiseFormClose}
					aria-labelledby="complete-promise"
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
							Capture your <Typography variant="h6" color="primary" component="span">Pinky Promise</Typography>!
						</Typography>
						<Stack>
							<UploadImage onClickOk={this.props.onClickOk} onClickClose={this.props.onClickClose} />
						</Stack>
					</Box>
				</Modal>
		);
	}
}

export default CompletePromiseModal;