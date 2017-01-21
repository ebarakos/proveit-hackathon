module.exports = function(deployer) {
  deployer.deploy(CreditContract, {gas:2000000});
};
