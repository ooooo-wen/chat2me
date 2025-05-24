const M_posts = require('../models/posts');

const createPost = async (req, res) => {
	try {
		const { forum_id, title, content, img_url = [], tag } = req.body;
		const user_id = req.user.id;

		if (!forum_id || !title || !content || typeof tag === 'undefined') {
			return res.status(400).json({ message: '缺少必要欄位：forum_id, title, content, tag' });
		}

		// 類型檢查
		if (typeof forum_id !== 'number') {
			return res.status(400).json({ message: 'forum_id 必須是數值' });
		}

		if (typeof title !== 'string' || title.trim() === '') {
			return res.status(400).json({ message: 'title 必須是非空字串' });
		}

		if (typeof content !== 'string' || content.trim() === '') {
			return res.status(400).json({ message: 'content 必須是非空字串' });
		}

		if (!Array.isArray(tag)) {
			return res.status(400).json({ message: 'tag 必須是陣列' });
		}

		if (!Array.isArray(img_url)) {
			return res.status(400).json({ message: 'img_url 必須是陣列' });
		}

		// 實際新增貼文
		const newPost = await M_posts.createPost({
			user_id,
			forum_id,
			title,
			content,
			img_url,
			tag
		});

		res.status(201).json({ message: '新增文章成功', status: true });
		console.log(newPost);
	} catch (error) {
		console.log(error);
		console.log(req.body);
		res.status(500).json({
			message: '伺服器錯誤',
			status: false
		});
	}
};

module.exports = {
	createPost
};
