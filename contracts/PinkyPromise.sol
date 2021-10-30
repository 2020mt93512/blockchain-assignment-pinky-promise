// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

// to enable return of two-levels of dynamic arrays
pragma experimental ABIEncoderV2;

contract PinkyPromise {
    struct PinkyPromiseRecord {
        uint256 id;
        string title;
        string description;
        uint256 createdAt;
        // the user who created the promise
        uint256 sharingUserId;
        // indicates whether the sharing user has marked the promise as complete
        bool completedBySharingUser;
        // indicates whether the sharing user marked the promise as complete
        uint256 completedBySharingUserAt;
        // the user with who the promise must be shared
        uint256 receivingUserId;
        // indicates whether the receiving user has marked the promise as complete
        bool completedByReceivingUser;
        // indicates whether the receving user marked the promise as complete
        uint256 completedByReceivingUserAt;
        // indicates time beyond with the promise cannot be marked as complete
        uint256 expiresIn;
    }

    struct PinkyUserRecord {
        uint256 id;
        address addr;
        string name;
        // total promises this user has made
        uint256 totalPromises;
    }

    string public name;

    uint256 public usersCount = 0;
    mapping(uint256 => PinkyUserRecord) public users;
    mapping(address => uint256) public userIdByAddr;

    uint256 public promisesCount = 0;
    mapping(uint256 => PinkyPromiseRecord) public promises;

    constructor() public {
        name = "PinkyPromise";
    }

    /**************************************************************************
     *
     * Events
     *
     **************************************************************************/
    event PinkyUserRecordAdded(
        uint256 indexed id,
        address indexed addr,
        string name,
        uint256 totalPromises
    );

    event PinkyPromiseRecordAdded(
        uint256 indexed id,
        string title,
        string description,
        uint256 createdAt,
        uint256 indexed sharingUserId,
        bool completedBySharingUser,
        uint256 completedBySharingUserAt,
        uint256 indexed receivingUserId,
        bool completedByReceivingUser,
        uint256 completedByReceivingUserAt,
        uint256 expiresIn
    );

    event PinkyPromiseCompletedBySharingUser(
        uint256 promiseId,
        uint256 completedBySharingUserAt
    );

    event PinkyPromiseCompletedByReceivingUser(
        uint256 promiseId,
        uint256 completedByReceivingUserAt
    );

    /**************************************************************************
     *
     * User management methods
     *
     **************************************************************************/

    function getCurrentUser() public view returns (PinkyUserRecord memory) {
        require(msg.sender != address(0));

        return users[userIdByAddr[msg.sender]];
    }

    function addUser(string memory _name) public {
        require(msg.sender != address(0));
        require(userIdByAddr[msg.sender] == 0);

        usersCount++;
        users[usersCount] = PinkyUserRecord(usersCount, msg.sender, _name, 0);
        userIdByAddr[msg.sender] = usersCount;

        emit PinkyUserRecordAdded(usersCount, msg.sender, _name, 0);
    }

    function getViewableUsers() public view returns (PinkyUserRecord[] memory) {
        require(msg.sender != address(0));

        uint256 _userId = userIdByAddr[msg.sender];
        uint256 _viewableUsersCount = 0;
        for (uint256 i = 1; i <= usersCount; i++) {
            // returns all users (except current user)
            if (users[i].id != _userId) {
                _viewableUsersCount++;
            }
        }

        PinkyUserRecord[] memory _allViewableUsers = new PinkyUserRecord[](
            _viewableUsersCount
        );
        uint256 count = 0;
        for (uint256 i = 1; i <= usersCount; i++) {
            if (users[i].id != _userId) {
                _allViewableUsers[count++] = users[i];
            }
        }
        return _allViewableUsers;
    }

    /**************************************************************************
     *
     * Promise management methods
     *
     **************************************************************************/

    function addPromise(
        string memory _title,
        string memory _description,
        uint256 _receivingUserId,
        uint256 _expiresIn
    ) public {
        uint256 _sharingUserId = userIdByAddr[msg.sender];
        require(msg.sender != address(0));
        require(_receivingUserId != 0 && _receivingUserId <= usersCount);
        require(_sharingUserId != 0 && _sharingUserId <= usersCount);

        promisesCount++;
        users[_sharingUserId].totalPromises++;
        promises[promisesCount] = PinkyPromiseRecord(
            promisesCount,
            _title,
            _description,
            now,
            _sharingUserId,
            false,
            0,
            _receivingUserId,
            false,
            0,
            _expiresIn
        );

        emit PinkyPromiseRecordAdded(
            promisesCount,
            _title,
            _description,
            now,
            _sharingUserId,
            false,
            0,
            _receivingUserId,
            false,
            0,
            _expiresIn
        );
    }

    function completePromiseAsSharingUser(uint256 _promiseId) public {
        uint256 _userId = userIdByAddr[msg.sender];
        require(_promiseId != 0 && _promiseId <= promisesCount);
        require(_userId != 0 && _userId <= usersCount);
        require(promises[_promiseId].sharingUserId == _userId);
        require(
            promises[_promiseId].expiresIn == 0 ||
                promises[_promiseId].expiresIn >= now
        );
        require(!promises[_promiseId].completedBySharingUser);

        promises[_promiseId].completedBySharingUser = true;
        promises[_promiseId].completedBySharingUserAt = now;

        emit PinkyPromiseCompletedBySharingUser(
            _promiseId,
            promises[_promiseId].completedBySharingUserAt
        );
    }

    function completePromiseAsReceivingUser(uint256 _promiseId) public {
        uint256 _userId = userIdByAddr[msg.sender];
        require(_promiseId != 0 && _promiseId <= promisesCount);
        require(_userId != 0 && _userId <= usersCount);
        require(promises[_promiseId].receivingUserId == _userId);
        require(
            promises[_promiseId].expiresIn == 0 ||
                promises[_promiseId].expiresIn >= now
        );
        require(!promises[_promiseId].completedByReceivingUser);

        promises[_promiseId].completedByReceivingUser = true;
        promises[_promiseId].completedByReceivingUserAt = now;

        emit PinkyPromiseCompletedByReceivingUser(
            _promiseId,
            promises[_promiseId].completedByReceivingUserAt
        );
    }

    function getPromisesByUserId()
        public
        view
        returns (PinkyPromiseRecord[] memory)
    {
        uint256 _userId = userIdByAddr[msg.sender];
        require(_userId != 0 && _userId <= usersCount);

        uint256 count = 0;
        PinkyPromiseRecord[] memory _userPromises = new PinkyPromiseRecord[](
            users[_userId].totalPromises
        );
        for (uint256 i = 1; i <= promisesCount; i++) {
            if (promises[i].sharingUserId == _userId) {
                _userPromises[count++] = promises[i];
            }
        }
        return _userPromises;
    }

    function getAllPromisesViewableByUser()
        public
        view
        returns (PinkyPromiseRecord[] memory)
    {
        uint256 _userId = userIdByAddr[msg.sender];
        require(msg.sender != address(0));

        uint256 _viewablePromisesCount = 0;
        for (uint256 i = 1; i <= promisesCount; i++) {
            if (
                promises[i].sharingUserId == _userId ||
                promises[i].receivingUserId == _userId
            ) {
                _viewablePromisesCount++;
            }
        }

        PinkyPromiseRecord[]
            memory _allViewablePromises = new PinkyPromiseRecord[](
                _viewablePromisesCount
            );
        uint256 count = 0;
        for (uint256 i = 1; i <= promisesCount; i++) {
            if (
                promises[i].sharingUserId == _userId ||
                promises[i].receivingUserId == _userId
            ) {
                _allViewablePromises[count++] = promises[i];
            }
        }
        return _allViewablePromises;
    }
}
