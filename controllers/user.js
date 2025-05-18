const M_users = require('../models/users');
const path = require('path');

/* 取得個人資料 */
exports.getUser = async (req, res) => {
	try {
		const { id } = req.params;

		if (req.user.id !== id) {
			return res.status(403).json({
				message: '沒有權限訪問',
				status: false
			});
		}

		const user = await M_users.getUserById(id);

		if (!user) {
			return res.status(400).json({
				message: '發生錯誤',
				status: false
			});
		}

		const new_user = {
			id: Number(user.user_id),
			name: user.name,
			email: user.email,
			description: user.description || "個人自我介紹描述",
			imageUrl: user.avatar_url || "https://fakeimg.pl/250x100/"
		};

		res.status(200).json({
			status: true,
			data: new_user
		});

	} catch (error) {
		console.log(error);
		console.log(req.params);
		res.status(500).json({
			message: '伺服器錯誤',
			status: false
		});
	}
}

/* 修改個人資料 */
exports.putUser = async (req, res) => {
	try {
		const { id } = req.params;
		const name = (req.body.name ?? '').trim();
		const description = (req.body.description ?? '').trim();

		if (!id || !name || !description) {
			return res.status(400).json({
				message: '欄位格式錯誤',
				status: false
			});
		}

		if (req.user.id !== id) {
			return res.status(403).json({
				message: '沒有權限訪問',
				status: false
			});
		}

		if (await M_users.repeatName(id, name) && name !== req.user.name) {
			return res.status(409).json({
				message: '該名稱已存在資料庫',
				status: false
			});
		}

		const user = req.dbUser;

		user.name = name;
		user.description = description;

		/* 更新資料庫 */
		const result = await M_users.putUser(user);
		console.log(result);

		res.status(200).json({
			message: '更新成功',
			status: true
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

/* 上傳個人圖片 */
exports.upload = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: '請上傳符合條件的圖片檔案' });
		}
		const filePath = `/uploads/${req.file.filename}`; // 提供給前端與儲存資料庫
		const user = req.dbUser;
		user.avatar_url = filePath;
		const result = await M_users.putUser(user);

		res.status(200).json({
			message: '檔案上傳成功',
			filePath: filePath
		});
	} catch (error) {
		console.log(error);
		console.log(req.body);
		res.status(500).json({
			message: '伺服器錯誤',
			status: false
		});
	}
};
