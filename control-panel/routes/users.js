const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/authModule');
const users_controller = require('../controllers/usersController');

router.get('/', isLoggedIn, users_controller.index);
router.post('/', isLoggedIn, users_controller.addUser);

module.exports = router;