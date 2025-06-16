const express = require('express');
const router = express.Router();
const C_user = require('../controllers/user');
const { JWT_header } = require('../middlewares/auth');	// 引入 JWT middleware
const upload = require('../middlewares/upload');

router.use(JWT_header); //驗證有無登入

router.get('/profile', C_user.profile);
router.get('/article', C_user.article);
router.get('/forum', C_user.forum);
router.get('/:id', C_user.getUser);
router.put('/:id', C_user.putUser);
router.post('/upload', upload.single('image', 'user'), C_user.upload);


module.exports = router;