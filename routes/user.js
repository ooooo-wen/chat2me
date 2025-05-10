const express = require('express');
const router = express.Router();
const C_user = require('../controllers/user');

router.get('/user/:id', C_user.getUser);


module.exports = router;

