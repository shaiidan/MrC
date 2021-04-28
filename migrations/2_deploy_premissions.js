const Permissions = artifacts.require("Permissions");

module.exports = function(deployer) {
  deployer.deploy(Permissions);
};