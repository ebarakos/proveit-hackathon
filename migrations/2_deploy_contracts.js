module.exports = function(deployer) {
  deployer.autolink();
  deployer.deploy(CreditContract, {gas:2000000});
};
