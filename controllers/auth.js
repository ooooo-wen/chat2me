const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const M_users = require('../models/users');

exports.signup = async (req, res) => {
	try {
		const name = req.body.name?.trim() || '';
		const email = req.body.email?.trim() || '';
		const password = req.body.password || '';
		let errMsg = {};

		if (!/^[a-zA-Z0-9]{2,10}$/.test(name)) {
			return res.status(400).json({
				message: '最少 2 個字元，最長 10 字元，不得包含特殊字元與空白',
				status: false
			});
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return res.status(400).json({
				message: '需符合 Email 格式',
				status: false
			});
		}

		if (!/^[\S]{8,10}$/.test(password)) {
			return res.status(400).json({
				message: '最短 8 字元，最大 10 字元',
				status: false
			});
		}

		if (await M_users.getUsersByEmail(email)) {
			return res.status(409).json({
				message: "註冊失敗，Email 已被使用",
				status: false
			});
		}

		const post = {
			name,
			email,
			password_hash: await bcrypt.hash(password, 10),
		}

		/* 新增資料庫 */
		const result = M_users.postUsers(post);

		res.status(201).json({
			message: '註冊成功',
			status: true
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: '伺服器錯誤',
			status: false
		});
	}
}

exports.login = async (req, res) => {
	try {
		const email = req.body.email?.trim() || '';
		const password = req.body.password || '';
		let errMsg = {};

		if (!email) {
			return res.status(409).json({
				message: "信箱請勿空白",
				status: false
			});
		}

		if (!password) {
			return res.status(409).json({
				message: "密碼不得為空",
				status: false
			});
		}

		const user = await M_users.getUsersByEmail(email); //抓取使用者

		if (!user) {
			return res.status(401).json({
				message: '此信箱尚未註冊',
				status: false
			});
		}

		const result = await bcrypt.compare(password, user.password_hash);

		if (!result) {
			return res.status(400).json({
				message: '帳號密碼錯誤',
				status: false
			});
		}

		/* 設定 jwt */
		const userInfo = {
			id: user.user_id,
			email: user.email,
			name: user.name
		}

		const token = jwt.sign(userInfo, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES
		});

		// 更新登入時間
		await M_users.updateLastLogin(user.user_id);

		res.status(200).json({
			message: '登入成功',
			status: true,
			data: {
				token
			},
			user: {
				name: user.name
			}
		});

	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: '伺服器錯誤',
			status: false
		});
	}
}