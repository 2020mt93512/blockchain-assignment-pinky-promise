var PinkyPromise = artifacts.require("./PinkyPromise.sol");

module.exports = function(deployer) {
  deployer.deploy(PinkyPromise);
};
