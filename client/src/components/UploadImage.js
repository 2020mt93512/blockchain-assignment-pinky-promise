import React, { Component } from 'react';
import { create as createIpfsClient } from 'ipfs-http-client'
import { Box, LinearProgress, Typography, Stack, Button } from '@mui/material';
import { withStyles } from '@mui/styles';

import './UploadImage.css';

const ipfs = createIpfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 15,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: "#EEEEEE",
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#1a90ff',
  },
}))(LinearProgress);

class UploadImage extends Component {
	state = {
		currentFile: undefined,
		buffer: undefined,
		byteLength: 0,
		previewImage: undefined,
		progress: 0,
		imgHash: null,
		message: "",
		isError: false
	};

	selectFile = (event) => {
		const file = event.target.files[0];
		const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

		reader.onloadend = () => {
			this.setState({
				buffer: Buffer(reader.result),
				byteLength: reader.result.byteLength,
				currentFile: event.target.files[0],
				previewImage: URL.createObjectURL(event.target.files[0]),
				progress: 0,
				message: ""
			});
    }
  }

	setImgUploadProgress = (progress) => {
		this.setState(oldState => ({
			progress: Math.round((100 * progress) / oldState.byteLength),
		}));
	}

	uploadImage = async () => {
		try {
			const response = await ipfs.add(this.state.buffer, { progress: this.setImgUploadProgress });
			this.setState({ imgHash: response.path });
		} catch (error) {
			console.error(error);
		}
	}

  render() {
    const {
      currentFile,
      previewImage,
      progress,
      message,
      isError
    } = this.state;

    return (
      <div className="mg20">
        <Stack spacing={4} direction="row" justifyContent="space-between" padding={1}>
					<label htmlFor="btn-upload">
						<input
							id="btn-upload"
							name="btn-upload"
							style={{ display: 'none' }}
							type="file"
							accept="image/*"
							onChange={this.selectFile}
						/>
						<Button
							className="btn-choose"
							variant="outlined"
							component="span"
						>
							Choose Image
						</Button>
					</label>
					<div className="file-name">
						{currentFile ? currentFile.name : null}
					</div>
					<Button
						color="primary"
						variant="contained"
						component="span"
						disabled={!currentFile || progress !== 0}
						onClick={this.uploadImage}>
						Upload
					</Button>
				</Stack>


          <Box className="my20" display="flex" alignItems="center">
            {currentFile && (
							<>
								<Box width="100%" mr={1}>
									<BorderLinearProgress variant="determinate" value={progress} />
								</Box>
								<Box minWidth={35}>
									<Typography variant="body2" color="textSecondary">{`${progress}%`}</Typography>
								</Box>
							</>
						)}
          </Box>

          <div className="preview-container">
        		{previewImage ? (
            	<img className="preview my20" src={previewImage} alt="" />
						) : (
							<Typography variant="caption" component="span">
							Preview
						</Typography>
						)}
          </div>

        {message && (
          <Typography variant="subtitle2" className={`upload-message ${isError ? "error" : ""}`}>
            {message}
          </Typography>
        )}

				<Stack direction="row" display="flex" justifyContent="space-around" spacing={2}>
					<Button variant="outlined" onClick={this.props.onClickClose}>
						Close
					</Button>
					<Button
						variant="contained"
						onClick={() => this.props.onClickOk(this.state.imgHash)}
						disabled={!this.state.currentFile || this.state.isError || this.state.progress !== 100}
					>
						Complete Pinky Promise
					</Button>
				</Stack>
      </div>
    );
  }
}

export default UploadImage;