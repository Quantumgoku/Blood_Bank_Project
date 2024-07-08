const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const authMiddelware = require("../middlewares/authMiddelware");

// Create a donation request
router.post('/donate', authMiddelware, donationController.createDonationRequest); //POST to create a donation request
router.get('/getdonations', authMiddelware, donationController.getDonations); //GET all donations made by a user
router.post('/acknowledge/:donationId', authMiddelware, donationController.acknowledgeDonation); //POST to acknowledge a donation
router.get('/:donationId', authMiddelware, donationController.getDonation); //GET a donation by id

module.exports = router;
