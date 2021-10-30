import React from 'react';

import GlobalState from '../utils/GlobalState';
import { PinkyUserRecord } from '../models/PinkyUserRecord';
import { PinkyPromiseRecord } from '../models/PinkyPromiseRecord';

const pinkyPromiseState = {
	allPromises: [],
	myPromises: [],
	usersList: [],
	user: null,
	loading: false,
	loadBlockchainData: async () => {
		console.error('Programming error: function not implemented yet!');
	},
	setUser: async () => {
		console.error('Programming error: function not implemented yet!');
	},
	registerEventSubscriptions: async () => {
		console.error('Programming error: function not implemented yet!');
	},
	getCurrentUser: async () => {
		console.error('Programming error: function not implemented yet!');
	},
	getUsersList: async () => {
		console.error('Programming error: function not implemented yet!');
	}
};

export const PinkyPromiseContext = React.createContext(pinkyPromiseState);

const PinkyPromiseProvider = ({ children }) => {
  const [state, setState] = React.useState({ allPromises: [], myPromises: [], usersList: [], user: null, loading: false });

	const getAllPinkyPromises = React.useCallback(async () => {
		const contract = GlobalState.getContract();
		try {
      const response = await contract.methods.getAllPromisesViewableByUser().call({ from: GlobalState.getAccount() });
      setState(oldState => ({ ...oldState, allPromises: response.map(PinkyPromiseRecord.toJson) }));
    } catch (error) {
      console.error(error);
    }
	}, []);

	const getMyPinkyPromises = React.useCallback(async () => {
		const contract = GlobalState.getContract();
		try {
      const response = await contract.methods.getPromisesByUserId().call({ from: GlobalState.getAccount() });
      setState(oldState => ({ ...oldState, myPromises: response.map(PinkyPromiseRecord.toJson) }));
    } catch (error) {
      console.error(error);
    }
	}, []);

	const getUsersList = React.useCallback(async () => {
		const contract = GlobalState.getContract();
		try {
			const response = await contract.methods.getViewableUsers().call({ from: GlobalState.getAccount() });
			setState(oldState => ({ ...oldState, usersList: response.map(PinkyUserRecord.toJson) }));
    } catch (error) {
      console.error(error);
    }
	}, []);

	const setUser = React.useCallback((userData) => {
		setState(oldState => ({ ...oldState, user: userData }));
	}, []);

	const registerEventSubscriptions = React.useCallback(async (user) => {
		setUser(user);
		const contract = GlobalState.getContract();

		contract.events.PinkyPromiseRecordAdded({ fromBlock: 0 }).on('data', (event) => {
			console.log('"PinkyPromiseRecordAdded" Event received: ', event.returnValues);
			const promiseAdded = PinkyPromiseRecord.toJson(event.returnValues);
			if (promiseAdded.sharingUserId === user.id || promiseAdded.receivingUserId === user.id) {
				setState(oldState => {
					const { allPromises, myPromises } = oldState;
					const allPromiseItemIdx = allPromises.findIndex(item => item.id === +(promiseAdded.id));
					let newAllPromises = [...allPromises];
					const myPromiseItemIdx = myPromises.findIndex(item => item.id === +(promiseAdded.id));
					let newMyPromises = [...myPromises];
					if (allPromiseItemIdx !== -1) {
						newAllPromises[allPromiseItemIdx] = promiseAdded;
					} else {
						newAllPromises = [...newAllPromises, promiseAdded];
					}
					// add to my promises only if sharing user id matches current user id
					if (user.id === promiseAdded.sharingUserId) {
							if (myPromiseItemIdx !== -1) {
								newMyPromises[myPromiseItemIdx] = promiseAdded;
							} else {
								newMyPromises = [...newMyPromises, promiseAdded];
							}
					}
					return { ...oldState, allPromises: newAllPromises, myPromises: newMyPromises };
				});
			}
		});

		contract.events.PinkyPromiseCompletedBySharingUser({ fromBlock: 0 }).on('data', (event) => {
			console.log('"PinkyPromiseCompletedBySharingUser" Event received: ', event.returnValues);
			const { promiseId, completedBySharingUserAt, imgHash } = event.returnValues;
			setState(oldState => {
				const { allPromises, myPromises } = oldState;
				const allPromiseItemIdx = allPromises.findIndex(item => item.id === +promiseId);
				const myPromiseItemIdx = myPromises.findIndex(item => item.id === +promiseId);
				const newAllPromises = [...allPromises];
				const newMyPromises = [...myPromises];
				if (allPromiseItemIdx !== -1 || myPromiseItemIdx !== -1) {
					if (allPromiseItemIdx !== -1) {
						const newPromise = {
							...newAllPromises[allPromiseItemIdx],
							completedBySharingUserAt: (+completedBySharingUserAt * 1000),
							sharingUserImgHash: imgHash
						};
						newAllPromises.splice(allPromiseItemIdx, 1, newPromise);
					}
					if (myPromiseItemIdx !== -1) {
						const newPromise = {
							...newMyPromises[myPromiseItemIdx],
							completedBySharingUserAt: (+completedBySharingUserAt * 1000),
							sharingUserImgHash: imgHash
						};
						newMyPromises.splice(myPromiseItemIdx, 1, newPromise);
					}
					return { ...oldState, allPromises: newAllPromises, myPromises: newMyPromises };
				}
				return oldState;
			});
		});

		contract.events.PinkyPromiseCompletedByReceivingUser({ fromBlock: 0 }).on('data', (event) => {
			console.log('"PinkyPromiseCompletedByReceivingUser" Event received: ', event.returnValues);
			const { promiseId, completedByReceivingUserAt, imgHash } = event.returnValues;
			setState(oldState => {
				const { allPromises, myPromises } = oldState;
				const allPromiseItemIdx = allPromises.findIndex(item => item.id === +promiseId);
				const myPromiseItemIdx = myPromises.findIndex(item => item.id === +promiseId);
				const newAllPromises = [...allPromises];
				const newMyPromises = [...myPromises];
				if (allPromiseItemIdx !== -1 || myPromiseItemIdx !== -1) {
					if (allPromiseItemIdx !== -1) {
						const newPromise = {
							...newAllPromises[allPromiseItemIdx],
							completedByReceivingUserAt: (+completedByReceivingUserAt) * 1000,
							receivingUserImgHash: imgHash
						};
						newAllPromises.splice(allPromiseItemIdx, 1, newPromise);
					}
					if (myPromiseItemIdx !== -1) {
						const newPromise = {
							...newMyPromises[myPromiseItemIdx],
							completedByReceivingUserAt: (+completedByReceivingUserAt) * 1000,
							receivingUserImgHash: imgHash
						};
						newMyPromises.splice(myPromiseItemIdx, 1, newPromise);
					}
					return { ...oldState, allPromises: newAllPromises, myPromises: newMyPromises };
				}
				return oldState;
			});
		});
	}, [setUser]);

	const loadBlockchainData = React.useCallback(async () => {
		setState(oldState => ({ ...oldState, loading: true }));
		// get user promises
		await getMyPinkyPromises();
		// get all promises
		await getAllPinkyPromises();
		setState(oldState => ({ ...oldState, loading: false }));
	}, [getMyPinkyPromises, getAllPinkyPromises]);

	const getCurrentUser = React.useCallback(async () => {
		const contract = GlobalState.getContract();
		setState(oldState => ({ ...oldState, loading: true }));
		try {
      const response = await contract.methods.getCurrentUser().call({ from: GlobalState.getAccount() });
      const user = PinkyUserRecord.toJson(response);
      if (user.id !== 0) {
        await registerEventSubscriptions(user);
        await loadBlockchainData();
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(error);
      setUser(null);
    } finally {
			setState(oldState => ({ ...oldState, loading: false }));
		}
	}, [registerEventSubscriptions, loadBlockchainData, setUser]);

  return (
		<PinkyPromiseContext.Provider value={{
				...state,
				loadBlockchainData,
				setUser,
				registerEventSubscriptions,
				getCurrentUser,
				getUsersList
			}}
		>
			{children}
		</PinkyPromiseContext.Provider>
	);
};

export { PinkyPromiseProvider };
