const express = require('express');
const router = express.Router();
const C_forum = require('../controllers/forum');

router.get('/classification', C_forum.getAll);
router.post('/', C_forum.postForum);



module.exports = router;