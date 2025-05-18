require('dotenv').config(); //載入環境變數
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const fs = require('fs');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

var app = express();

/* 設定多個允許的來源 */
const allowedOrigins = [
	'https://chat2me.vercel.app',
	'http://localhost:3000',      // 本地開發環境（如果前端在本地）
	'http://127.0.0.1:3000'      // 本地開發環境的另一種格式
];

/* 設定 CORS 允許來自上述來源的請求 */
const corsOptions = {
	origin: function (origin, callback) {
		if (allowedOrigins.indexOf(origin) !== -1 || !origin) {  // 如果是允許的來源，或是沒有 origin（如本地測試），就允許
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'), false);
		}
	},
	methods: ['GET', 'POST', 'PUT', 'DELETE'],  // 設定允許的方法
	credentials: true,  // 若需要允許跨域 cookies，設為 true
};

/* 設定檔案上傳的資料夾 */
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
	fs.mkdirSync(uploadPath);
}

app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/uploads', express.static('uploads')); //可以允許前端看的資料夾


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
