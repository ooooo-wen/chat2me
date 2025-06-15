const M_fourns = require('../models/forum');
const M_users = require('../models/users');
const M_sub = require('../models/forumSubscriptions');

exports.getAll = async (req, res) => {
	try {
		const forums = await M_fourns.getForums();

		res.status(200).json({
			status: true,
			data: forums
		});
	} catch (error) {
		console.log(error);
		console.log(req.body);
		res.status(500).json({
			message: '伺服器錯誤',
			status: false
		});
	}
}

exports.popular = async (req, res) => {
	try {

		const forums = await M_fourns.getPopular();

		res.status(200).json({
			status: true,
			data: forums
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: '伺服器錯誤',
			status: false
		});
	}
}

exports.postForum = async (req, res) => {
	try {
		const { forum_name, type, description, is_official, is_nsfw } = req.body;

		// 驗證必填欄位
		if (
			typeof forum_name !== 'string' ||
			forum_name.trim() === '' ||
			typeof is_official !== 'boolean' ||
			typeof is_nsfw !== 'boolean'
		) {
			return res.status(400).json({
				message: 'forum_name, is_official, is_nsfw 為必填且格式需正確',
			});
		}

		const forum = await M_fourns.postForum({
			type,
			forum_name,
			description,
			is_official,
			is_nsfw,
		});

		console.log(forum);

		return res.status(201).json({
			"message": "新增看版成功",
			"status": true
		});
	} catch (error) {
		if (error.code === 'DUPLICATE_FORUM') {
			return res.status(409).json({
				status: false,
				message: error.message
			});
		}

		console.error('建立看板失敗：', error);
		return res.status(500).json({ message: '伺服器錯誤，請稍後再試' });
	}
};

exports.follow = async (req, res) => {
	try {
		const { forumId, userId } = req.body;
		const user = await M_users.getUserById(userId);
		const forum = await M_fourns.getForumById(forumId);

		if (!user || !forum) {
			return res.status(400).json({
				status: false,
				message: "發生錯誤"
			});
		}

		const result = await M_sub.subscripForum(user, forum);
		if (result.exists) {
			return res.status(409).json({
				status: false,
				message: '已經有追蹤看板了'
			});
		}

		res.status(201).json({
			status: true,
			message: "追蹤成功"
		});
	} catch (err) {
		console.log(error);
		res.status(500).json({
			message: '伺服器錯誤',
			status: false
		});
	}
}

exports.deleteFlow = async (req, res) => {
	try {

		const { id } = req.params;
		const { user_id } = req.dbUser;
		const subscription = await M_sub.getSubscriptionsForm(id);

		if (!subscription) {
			return res.status(404).json({
				status: false,
				message: '找不到訂閱紀錄',
			});
		}

		const result = await M_sub.deleteSubscriptionsForm(id, user_id);

		res.status(200).json({
			status: true,
			message: '取消追蹤成功',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: '伺服器錯誤',
			status: false
		});
	}
}