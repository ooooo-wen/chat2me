const M_users = require('../models/users');

exports.getUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await M_users.getUserById(id);

		if (!user) {
			return res.status(400).json({
				message: '發生錯誤',
				status: false
			});
		}

		const new_user = {
			id: Number(user.user_id),
			name: user.username,
			email: user.email,
			description: "個人自我介紹描述",
			imageUrl: user.avatar_url || "https://fakeimg.pl/250x100/"
		};

		res.status(200).json({
			status: true,
			data: new_user
		});

	} catch (error) {
		res.status(500).json({
			message: '伺服器錯誤',
			status: false
		});
	}
}