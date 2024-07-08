require('dotenv').config();
const Request = require('../models/Request');
const userModel = require('../models/userModel');
const twilio = require('twilio');

// Initialize Twilio client with environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token
const client = new twilio(accountSid, authToken);

function formatPhoneNumber(phone) {
    // Example: prepend country code +91 for Indian numbers
    if (!phone.startsWith('+')) {
        return `+91${phone}`; // Change +91 to your relevant country code
    }
    return phone;
}

exports.createRequest = async (req, res) => {
    const { email, bloodType, quantity, walletAddress, phone } = req.body;

    if (!bloodType || !quantity || !walletAddress || !phone || !email) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const newRequest = new Request({
            email,
            bloodType,
            quantity,
            walletAddress,
            phone,
            timestamp: Date.now(),
        });

        await newRequest.save();
        console.log('New request saved:', newRequest);

        console.log('Fetching users except the requester...');
        const users = await userModel.find({ phone: { $ne: phone } });
        console.log('Users fetched for notification:', users);

        if (users.length === 0) {
            console.log('No users found for notification.');
        } else {
            for (const user of users) {
                try {
                    const formattedPhone = formatPhoneNumber(user.phone);
                    const message = await client.messages.create({
                        body: `New blood request created. Type: ${bloodType}, Quantity: ${quantity}, Contact: ${phone}`,
                        to: formattedPhone,
                        from: process.env.TWILIO_PHONE_NUMBER
                    });
                    console.log(`Message sent to ${user.phone}: ${message.sid}`);
                } catch (error) {
                    console.error(`Failed to send message to ${user.phone}:`, error);
                }
            }
        }

        res.status(201).json({ message: 'Request created and notifications sent', request: newRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getRequests = async (req, res) => {
    try {
        const requests = await Request.find();
        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
