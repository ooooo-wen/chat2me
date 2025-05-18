const express = require('express');
const router = express.Router();
const C_user = require('../controllers/user');
const { JWT_header } = require('../middlewares/auth');	// 引入 JWT middleware
const upload = require('../middlewares/upload');

router.use(JWT_header); //驗證有無登入

router.get('/user/:id', C_user.getUser);
router.put('/user/:id', C_user.putUser);
router.post('/user/upload', upload.single('image'), C_user.upload);


module.exports = router;