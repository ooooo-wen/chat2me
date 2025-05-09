const express = require('express');
const router = express.Router();
const C_auth = require('../controllers/auth');

router.post('/signup', C_auth.signup);
router.post('/login', C_auth.login);



module.exports = router;