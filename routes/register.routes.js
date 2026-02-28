const express = require('express');
const router = express.Router();
const {registerUser} = require("../controller/auth.Controller");



router.post('/', registerUser);

module.exports = router;