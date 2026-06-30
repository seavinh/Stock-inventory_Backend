const express = require('express');
const router = express.Router();
const {loginUser} = require('../controller/auth.Controller');


router.post('/', loginUser);

module.exports = router;