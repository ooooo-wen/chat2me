const express = require('express');
const router = express.Router();
const C_article = require('../controllers/article');
const { JWT_header } = require('../middlewares/auth');	// 引入 JWT middleware

router.use(JWT_header); //驗證有無登入



router.post('/', C_article.createPost);


module.exports = router;