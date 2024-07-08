// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BloodDonation {
    struct Donation {
        address donor;
        address receiver;
        string bloodType;
        uint256 quantity;
        uint256 timestamp;
    }

    Donation[] public donations;
    uint256 public donationCount;

    event NewDonation(address indexed donor, address indexed receiver, string bloodType, uint256 quantity, uint256 timestamp);

    function donateBlood(address _receiver, string memory _bloodType, uint256 _quantity) public {
        Donation memory newDonation = Donation({
            donor: msg.sender,
            receiver: _receiver,
            bloodType: _bloodType,
            quantity: _quantity,
            timestamp: block.timestamp
        });
        
        donations.push(newDonation);
        donationCount++;

        emit NewDonation(msg.sender, _receiver, _bloodType, _quantity, block.timestamp);
    }

    function getDonationCount() public view returns (uint256) {
        return donationCount;
    }

    function getDonation(uint256 index) public view returns (address, address, string memory, uint256, uint256) {
        require(index < donationCount, "Index out of bounds");
        Donation memory donation = donations[index];
        return (donation.donor, donation.receiver, donation.bloodType, donation.quantity, donation.timestamp);
    }
}
