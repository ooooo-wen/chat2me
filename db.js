const { DataSource } = require('typeorm');
const { Users } = require('./entity/users');
const { Posts } = require('./entity/posts');


const AppDataSource = new DataSource({
	type: "postgres",					// 資料庫類型
	host: process.env.DB_HOST,			// 資料庫位置
	port: process.env.DB_PORT,          // port
	username: process.env.DB_USERNAME,	// 帳號
	password: process.env.DB_PASSWORD,	// 密碼
	database: process.env.DB_DATABASE,	// 資料庫名稱
	synchronize: true,					// 每次執行都覆蓋
	logging: false,						// 在 console 顯示指令
	entities: [							//選擇有用的 entities (entity)
		Users,
		Posts
	],
	migrations: [],						//版控
});

module.exports = AppDataSource