import * as React from 'react';
import * as moment from 'moment';
import { Stack, Box, Card, CardContent, Typography, CardActions, IconButton} from '@mui/material';
import { green, red, blue, orange } from '@mui/material/colors';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoneIcon from '@mui/icons-material/Done';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import TimerIcon from '@mui/icons-material/Timer';
import TimerOffIcon from '@mui/icons-material/TimerOff';

const getBorderColor = (hasExpired, userMarkedComplete, otherUserMarkedComplete, isComplete) => {
	if (hasExpired) {
		return `2px solid ${red.A700}`;
	}
	if (isComplete) {
		return `2px solid ${green.A700}`;
	}
	if (!userMarkedComplete && otherUserMarkedComplete) {
		return `2px solid ${orange[300]}`;
	}
	if (userMarkedComplete && !otherUserMarkedComplete) {
		return `2px solid ${blue.A700}`;
	}

	return null;
};

const PinkyPromiseCard = ({
	id,
	title,
	description,
	createdAt,
	sharingUserId,
	receivingUserId,
	completedBySharingUser,
	completedByReceivingUser,
	completedBySharingUserAt,
	completedByReceivingUserAt,
	userId,
	completePromise,
	expiresIn,
	sharingUserName,
	receivingUserName
}) => {
	const expiresInAgo = !Number.isNaN(expiresIn) && expiresIn !== 0 ? moment(new Date(expiresIn)).fromNow() : '0';
	const hasExpired = expiresIn !== 0 && Date.now() - expiresIn >= 0;
	const canUserMarkComplete = !hasExpired && (userId === sharingUserId || userId === receivingUserId);
	const userMarkedComplete = userId === sharingUserId ?
		completedBySharingUser
		: userId === receivingUserId ?
			completedByReceivingUser : false;
	const otherUserMarkedComplete = userId === sharingUserId ?
		completedByReceivingUser
		: userId === receivingUserId ?
			completedBySharingUser : false;
	const sharingUserCompletedAgo = completedBySharingUserAt !== 0 ?
		moment(new Date(completedBySharingUserAt)).fromNow() : '0';
	const receivingUserCompletedAgo = completedByReceivingUserAt !== 0 ?
		moment(new Date(completedByReceivingUserAt)).fromNow() : '0';
	const isComplete = completedBySharingUser && completedByReceivingUser;

	const border = getBorderColor(hasExpired, userMarkedComplete, otherUserMarkedComplete, isComplete);

  return (
		<Box marginBottom={2} style={{ opacity: isComplete || hasExpired ? 0.6 : 1 }}>
			<Card sx={{ minWidth: 500, border }}>
				<CardContent>
					<Stack direction="row" justifyContent="space-between">
						<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
							Pinky Promise
						</Typography>
						<Typography variant="h5" component="div">
							#{id}
						</Typography>
					</Stack>
					<Typography variant="h5" component="div">
						{title}
					</Typography>
					<Typography sx={{ mb: 1.5, fontSize: 12 }} color="text.secondary">
						{moment(new Date(createdAt)).fromNow()}
					</Typography>
					<Typography variant="body2">
						{description}
					</Typography>
				</CardContent>
				<CardActions disableSpacing>
					<Stack direction="row" spacing={2} paddingLeft={1}>
						<Stack direction="column" justifyContent="center">
							<Typography sx={{ fontSize: 12 }} color="text.secondary">
								{sharingUserName ? sharingUserName : 'You'}
							</Typography>
							<Typography sx={{ fontSize: 10 }} color={completedBySharingUserAt && sharingUserCompletedAgo !== '0' ? green[500] : red[500]}>
								{completedBySharingUserAt && sharingUserCompletedAgo !== '0' ?
									sharingUserCompletedAgo : 'Not completed yet'
								}
							</Typography>
						</Stack>
						<DoubleArrowIcon />
						<Stack direction="column" justifyContent="center">
							<Typography sx={{ fontSize: 12 }} color="text.secondary">
								{receivingUserName ? receivingUserName : 'You'}
							</Typography>
							<Typography sx={{ fontSize: 10 }} color={completedByReceivingUserAt && receivingUserCompletedAgo !== '0' ? green[500] : red[500] }>
								{completedByReceivingUserAt && receivingUserCompletedAgo !== '0' ?
									receivingUserCompletedAgo : 'Not completed yet'
								}
							</Typography>
						</Stack>
						<Stack direction="row" spacing={1} paddingLeft={8} alignItems="center">
							{!hasExpired ? (
								<>
									<TimerIcon />
									<Typography sx={{ fontSize: 12 }} color="text.secondary">
										{expiresInAgo !== '0' ? expiresInAgo : 'No Expiry'}
									</Typography>
								</>
							) : (
								<>
									<TimerOffIcon />
									<Typography sx={{ fontSize: 12 }} color={red[500]}>
										{expiresInAgo !== '0' ? expiresInAgo : 'No Expiry'}
									</Typography>
								</>
							)}
						</Stack>
					</Stack>
					{canUserMarkComplete ? (
						userMarkedComplete ? (
							<CheckCircleOutlineIcon sx={{ marginLeft: 'auto' }} color="success" />
						) : (
							<IconButton
								sx={{ marginLeft: 'auto' }}
								color="default"
								onClick={() => completePromise(id, userId === sharingUserId)}
								aria-label="mark-complete"
							>
								<DoneIcon />
							</IconButton>
						)
					) : (
						isComplete ? (
							<CheckCircleOutlineIcon sx={{ marginLeft: 'auto' }} color="success" />
						) : null
					)}
				</CardActions>
			</Card>
		</Box>
  );
}

export default PinkyPromiseCard;