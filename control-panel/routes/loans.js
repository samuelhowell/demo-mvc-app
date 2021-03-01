const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/authModule');
const {index, chartWidget} = require('../controllers/loansController');

router.get('/', isLoggedIn, index);
router.get('/widget', isLoggedIn, chartWidget);

module.exports = router;