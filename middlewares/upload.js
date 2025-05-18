const multer = require('multer');
const path = require('path');

// 儲存位置與檔名設定
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
		cb(null, filename);
	}
});

// 檔案過濾
const fileFilter = function (req, file, cb) {
	const allowedTypes = /jpeg|jpg|png/;
	const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
	const mime = allowedTypes.test(file.mimetype);
	if (ext && mime) {
		cb(null, true);
	} else {
		cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', '只允許上傳 jpg 或 png 檔案'));
	}
};

const upload = multer({
	storage: storage,
	limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
	fileFilter: fileFilter
});

// 自訂錯誤處理 middleware：單檔上傳
const single = (fieldName) => {
	return (req, res, next) => {
		const handler = upload.single(fieldName);
		handler(req, res, (err) => {
			if (err instanceof multer.MulterError) {
				// multer 錯誤類型處理
				let message = '檔案上傳錯誤';
				if (err.code === 'LIMIT_FILE_SIZE') {
					message = '圖片尺寸須小於1M';
				} else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
					message = '圖片格式錯誤';
				}

				return res.status(400).json({
					status: false,
					message
				});
			} else if (err) {
				return res.status(500).json({
					status: false,
					message: '伺服器錯誤：' + err.message
				});
			}
			next(); // 沒錯誤就進 controller
		});
	};
};

module.exports = {
	single
};
