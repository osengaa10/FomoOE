var Fomo = artifacts.require("./Fomo.sol");
var FomoOE = artifacts.require("./FomoOE.sol");

module.exports = function(deployer) {
  deployer.deploy(Fomo);
};

module.exports = function(deployer) {
  deployer.deploy(FomoOE);
};