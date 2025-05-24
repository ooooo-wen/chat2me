const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 動態儲存位置與檔名設定
const createStorage = (folderName) => {
	return multer.diskStorage({
		destination: function (req, file, cb) {
			const uploadPath = `uploads/${folderName}/`;

			// 檢查資料夾是否存在，如果不存在則建立
			if (!fs.existsSync(uploadPath)) {
				fs.mkdirSync(uploadPath, { recursive: true });
			}

			cb(null, uploadPath);
		},
		filename: function (req, file, cb) {
			const ext = path.extname(file.originalname);
			const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
			cb(null, filename);
		}
	});
};

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

// 建立動態 multer 實例
const createUpload = (folderName) => {
	return multer({
		storage: createStorage(folderName),
		limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
		fileFilter: fileFilter
	});
};

// 單一檔案上傳 middleware
const single = (fieldName, folderName = 'default') => {
	return (req, res, next) => {
		const upload = createUpload(folderName);
		const handler = upload.single(fieldName);

		handler(req, res, (err) => {

			console.log(req.file);

			if (err instanceof multer.MulterError) {
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
			next();
		});
	};
};

// 多檔案上傳 middleware
const multi = (fieldName, folderName = 'default') => {
	const maxCount = 10;
	return (req, res, next) => {
		const upload = createUpload(folderName);
		const handler = upload.array(fieldName, maxCount);

		handler(req, res, (err) => {
			console.log(req.files);
			if (err instanceof multer.MulterError) {
				let message = '檔案上傳錯誤';
				if (err.code === 'LIMIT_FILE_SIZE') {
					message = '圖片尺寸須小於1M';
				} else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
					message = '圖片格式錯誤或數量超過限制';
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
			next();
		});
	};
};

module.exports = {
	single,
	multi
};