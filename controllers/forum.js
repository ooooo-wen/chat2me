const M_fourns = require('../models/forum');

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