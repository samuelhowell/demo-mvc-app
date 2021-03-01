const express = require('express');
const router = express.Router();
const api_controller = require('../controllers/apiController');
const {authApi} = require('../middleware/authModule');

// post new loan
router.post('/loans/', authApi, api_controller.loanApply);

// get loan status
router.get('/loans/:id', authApi, api_controller.getStatus);

module.exports = router;