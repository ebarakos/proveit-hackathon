module.exports = function(deployer) {
  deployer.deploy(ConvertLib, {gas:2000000});
  deployer.autolink();
  deployer.deploy(MetaCoin, {gas:2000000});
};
