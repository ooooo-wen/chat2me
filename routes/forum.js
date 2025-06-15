const express = require('express');
const router = express.Router();
const C_forum = require('../controllers/forum');
const { JWT_header } = require('../middlewares/auth');	// 引入 JWT middleware

router.get('/classification', C_forum.getAll);
router.get('/popular', C_forum.popular);
router.post('/', C_forum.postForum);
router.post('/follow', JWT_header, C_forum.follow);



module.exports = router;