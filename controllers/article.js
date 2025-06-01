const M_posts = require('../models/posts');

const getHotPost = async (req, res) => {
	try {
		const cursor = parseInt(req.query.cursor) || 0;
		const limit = parseInt(req.query.limit) || 20;
		const posts = await M_posts.getHotPosts(cursor, limit);
		// console.log(posts);

		const articleList = posts.map((post) => ({
			id: post.post_id,
			forumTitle: post.forum.forum_name,
			name: post.user.name,
			articleTitle: post.title,
			articleContent: post.content,
			icon: post.forum.forum_name,
			count: {
				like: post.like_count,
				collect: 0, // collect 還沒實作
				comment: post.comment_count,
			},
			postDate: post.created_at.toISOString().split('T')[0],
		}));

		res.status(200).json({
			status: true,
			data: articleList
		});
	} catch (error) {
		console.log(error);
		console.log(req.body);
		res.status(400).json({
			message: '發生錯誤',
			status: false
		});
	}
}

const getLatestPost = async (req, res) => {
	try {
		const cursor = parseInt(req.query.cursor) || 0;
		const limit = parseInt(req.query.limit) || 20;
		const posts = await M_posts.getLatestPosts(cursor, limit);
		// console.log(posts);

		const articleList = posts.map((post) => ({
			id: post.post_id,
			forumTitle: post.forum.forum_name,
			name: post.user.name,
			articleTitle: post.title,
			articleContent: post.content,
			icon: post.forum.forum_name,
			count: {
				like: post.like_count,
				collect: 0, // collect 還沒實作
				comment: post.comment_count,
			},
			postDate: post.created_at.toISOString().split('T')[0],
		}));

		res.status(200).json({
			status: true,
			data: articleList
		});
	} catch (error) {
		console.log(error);
		console.log(req.body);
		res.status(400).json({
			message: '發生錯誤',
			status: false
		});
	}
}

const createPost = async (req, res) => {
	try {
		const { forum_id, title, content, img_url = [], tag } = req.body;
		const user_id = req.user.id;

		if (!forum_id || !title || !content || typeof tag === 'undefined') {
			return res.status(400).json({ message: '缺少必要欄位' });
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

const upload = async (req, res) => {
	try {
		const files = req.files;

		if (!files || files.length === 0) {
			return res.status(400).json({
				status: false,
				message: '未上傳任何檔案',
			});
		}

		console.log(files);

		const imageUrls = await M_posts.upload(files);

		return res.status(200).json({
			message: '上傳成功',
			status: true,
			data: {
				imageUrl: imageUrls
			}
		});
	} catch (error) {
		console.error('上傳錯誤:', error);
		return res.status(500).json({
			message: '伺服器錯誤',
			status: false,
		});
	}
}

module.exports = {
	createPost,
	upload,
	getHotPost,
	getLatestPost
};
