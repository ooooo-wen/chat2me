const express = require('express');
const router = express.Router();
const C_article = require('../controllers/article');
const { JWT_header } = require('../middlewares/auth');	// 引入 JWT middleware
const upload = require('../middlewares/upload');

router.get('/popular', C_article.getHotPost);
router.get('/latest', C_article.getLatestPost);
router.get('/:id', C_article.getPost);
router.post('/', JWT_header, C_article.createPost);
router.post('/upload', JWT_header, upload.multi('image', 'post'), C_article.upload);
router.delete('/:id', JWT_header, C_article.deletePost);
router.put('/:id', JWT_header, C_article.putPost);
router.post('/like', JWT_header, C_article.like);
router.delete('/like/:id', JWT_header, C_article.unlike);
router.post('/collection', JWT_header, C_article.save);
router.delete('/collection/:id', JWT_header, C_article.unsave);


module.exports = router;