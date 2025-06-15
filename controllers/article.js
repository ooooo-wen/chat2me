const M_posts = require('../models/posts');
const dayjs = require('dayjs');

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

const getPost = async (req, res) => {
	try {
		const { id } = req.params;
		const post = await M_posts.getPost(id);

		if (!post) {
			return res.status(404).json({ status: false, message: "找不到貼文" });
		}

		/* 整理 tag */
		const tags = (post.postTags || []).map(pt => pt.tag?.tag_name).filter(Boolean);

		/* 整理留言資料 */
		const topLevelComments = post.comments
			.filter(c => !c.parent_comment) // 第一層留言
			.map((c, index) => {
				const level = `B${index + 1}`;

				const replies = post.comments
					.filter(r => r.parent_comment?.comment_id === c.comment_id)
					.map((r, rIdx) => ({
						name: r.user?.name || '匿名',
						avator: r.user?.avatar_url || null,
						content: r.content,
						level: `${level}-${rIdx + 1}`,
						date: dayjs(r.created_at).format('YYYY-MM-DD HH:mm'),
					}));

				return {
					name: c.user?.name || '匿名',
					avator: c.user?.avatar_url || null,
					content: c.content,
					level,
					date: dayjs(c.created_at).format('YYYY-MM-DD HH:mm'),
					reply: replies
				};
			});

		const response = {
			status: true,
			data: {
				forumTitle: post.forum.forum_name,
				followed: false, // 可根據登入使用者補上
				articleTitle: post.title,
				articleContent: post.content,
				tags,
				postDate: dayjs(post.created_at).format('YYYY-MM-DD'),
				count: {
					like: post.like_count,
					collect: 0, // 可另外查詢使用者收藏資料
					comment: post.comment_count || post.comments.length,
				},
				comments: topLevelComments
			}
		};
		res.status(200).json(response);

	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: '伺服器錯誤',
			status: false
		});
	}
}

const deletePost = async (req, res) => {
	const { dbUser } = req;         // 登入的使用者
	const { id } = req.params;      // 要刪除的文章 ID

	try {
		/* 先找出該文章 */
		const post = await M_posts.getPost(id);

		if (!post) {
			return res.status(404).json({
				status: false,
				message: '找不到貼文'
			});
		}

		// 檢查這篇文章是不是使用者自己的
		if (post.user_id !== dbUser.user_id) {
			return res.status(403).json({
				status: false,
				message: '你沒有權限刪除這篇文章'
			});
		}

		/* 刪除文章 */
		await M_posts.deletePost(id);

		return res.status(200).json({
			status: true,
			message: '刪除成功'
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			status: false,
			message: '伺服器錯誤'
		});
	}
};

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
	getLatestPost,
	getPost,
	deletePost
};
