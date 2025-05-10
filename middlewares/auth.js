const jwt = require('jsonwebtoken');
const util = require('util');

const verifyToken = util.promisify(jwt.verify);

exports.JWT_header = async (req, res, next) => {
	try {
		const authHeader = req.headers['authorization'];

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({
				message: '缺少或格式錯誤的 Authorization 標頭',
				status: false
			});
		}

		const token = authHeader.split(' ')[1]; // 取得 token

		const payload = await verifyToken(token, process.env.JWT_SECRET);

		// 驗證成功，把 payload 存到 req.user
		req.user = payload;

		next();

	} catch (err) {
		console.error('JWT 驗證失敗:', err);

		return res.status(403).json({
			message: 'JWT 驗證失敗',
			status: false
		});
	}
};
