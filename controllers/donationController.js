const { web3, contract } = require('../services/web3Services');
const userModel = require("../models/userModel");
const DonationRequest = require('../models/DonationRequest');
const Request = require('../models/Request');

// Create a DonationRequest request
exports.createDonationRequest = async (req, res) => {
    const { bloodType, quantity, receiver, phone } = req.body;
    const { userId } = req.body; 
    //console.log(req.body);

    const user = await userModel.findById(userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const donorAddress = user.WalletAddress;

    try {
        const newDonationRequest = new DonationRequest({
            donor: donorAddress,
            receiver,
            bloodType,
            quantity,
            timestamp: Date.now(),
            acknowledged: false,
            phone,
        });

        await newDonationRequest.save();
        res.status(201).json({ message: 'DonationRequest request created', DonationRequest: newDonationRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'DonationRequest request failed' });
    }
};

exports.acknowledgeDonation = async (req, res) => {
    console.log("first");
    const { donationId } = req.params;
    const { userId } = req.body;

    try {
        const donationRequest = await DonationRequest.findById(donationId); // Corrected variable name
        const user = await userModel.findById(userId);

        if (!donationRequest) {
            console.log("second");
            return res.status(404).json({ message: 'Donation request not found' });
        }

        if (donationRequest.receiver.toLowerCase() !== user.WalletAddress.toLowerCase()) {
            console.log("third");
            return res.status(403).json({ message: 'Unauthorized' });
        }

        console.log("fourth");
        try {
            console.log("Fetching accounts...");
            const accounts = await web3.eth.getAccounts();
            console.log("Accounts fetched:", accounts);
        } catch (error) {
            console.error("Error fetching accounts:", error);
            return res.status(500).json({ message: 'Failed to fetch accounts' });
        }

        console.log("fifth");
        const userAccount = accounts.find(acc => acc.toLowerCase() === donationRequest.donor.toLowerCase());

        if (!userAccount) {
            return res.status(400).json({ message: 'Donor blockchain account not found' });
        }

        const receipt = await contract.methods.donateBlood(donationRequest.receiver, donationRequest.bloodType, donationRequest.quantity).send({ from: userAccount, gas: 500000 });

        if (!receipt.events || !receipt.events.NewDonation || !receipt.events.NewDonation.returnValues || !receipt.events.NewDonation.returnValues.timestamp) {
            return res.status(400).json({ message: 'Event data not found in receipt' });
        }

        const timestamp = Number(receipt.events.NewDonation.returnValues.timestamp);

        donationRequest.timestamp = timestamp;
        donationRequest.acknowledged = true;
        await donationRequest.save();

        await DonationRequest.findByIdAndDelete(donationId);
        await Request.findOneAndDelete({ walletAddress: donationRequest.receiver });

        res.status(200).json({ message: 'Donation request acknowledged and added to blockchain', donationRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Acknowledgment failed' });
    }
};


exports.getDonations = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const walletAddress = user.WalletAddress;

        const requests = await DonationRequest.find({ receiver: walletAddress });
        
        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getDonation = async (req, res) => {
    const { RequestId } = req.params;
    try{
        const Request = await Request.findById(RequestId);
        if(!Request){
            return res.status(404).json({ message: 'DonationRequest not found' });
        }
        res.status(200).json(Request);
    }catch (error){
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}