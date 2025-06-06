const express = require('express');
const router = express.Router();
const C_article = require('../controllers/article');
const { JWT_header } = require('../middlewares/auth');	// 引入 JWT middleware
const upload = require('../middlewares/upload');

router.get('/popular', C_article.getHotPost);
router.get('/latest', C_article.getLatestPost);
router.post('/', JWT_header, C_article.createPost);
router.post('/upload', JWT_header, upload.multi('image', 'post'), C_article.upload);


module.exports = router;