const express = require('express');
const router = express.Router();
const { createRequest, getRequests } = require('../controllers/requestController');
const authMiddelware = require("../middlewares/authMiddelware");

router.post('/create', authMiddelware, createRequest); //POST to create a request
router.get('/', authMiddelware, getRequests); //GET all requests made by any user

module.exports = router;
