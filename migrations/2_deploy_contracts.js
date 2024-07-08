const BloodDonation = artifacts.require('BloodDonation');

module.exports = function(deployer) {
    deployer.deploy(BloodDonation);
};