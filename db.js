const { DataSource, EntitySchema } = require('typeorm');

const Users = new EntitySchema({
	name: 'Users',
	tableName: 'users',
	columns: {
		user_id: {
			type: 'bigint',
			primary: true,
			generated: 'increment',
			comment: '使用者唯一識別碼',
		},
		email: {
			type: 'varchar',
			length: 255,
			unique: true,
			nullable: false,
			comment: '電子郵件地址，用於登入和通知',
		},
		password_hash: {
			type: 'varchar',
			length: 255,
			nullable: false,
			comment: '加密後的密碼',
		},
		username: {
			type: 'varchar',
			length: 50,
			unique: true,
			nullable: false,
			comment: '使用者名稱/暱稱',
		},
		avatar_url: {
			type: 'varchar',
			length: 255,
			nullable: true,
			comment: '頭像圖片連結',
		},
		registration_date: {
			type: 'timestamp',
			nullable: false,
			comment: '註冊日期',
			createDate: true,
		},
		last_login: {
			type: 'timestamp',
			nullable: true,
			comment: '最後登入時間',
		},
		gender: {
			type: 'enum',
			enum: ['male', 'female', 'other', 'prefer_not_to_say'],
			nullable: true,
			comment: '性別',
		},
		birth_year: {
			type: 'smallint',
			nullable: true,
			comment: '出生年份',
		},
		is_verified: {
			type: 'boolean',
			default: false,
			comment: '是否已驗證身份',
		},
		is_banned: {
			type: 'boolean',
			default: false,
			comment: '是否被禁止使用',
		},
		ban_reason: {
			type: 'text',
			nullable: true,
			comment: '禁止原因',
		},
		ban_until: {
			type: 'timestamp',
			nullable: true,
			comment: '禁止到期時間',
		},
	},
	indices: [
		{
			name: 'IDX_USER_USERNAME',
			columns: ['username'],
		},
		{
			name: 'IDX_USER_EMAIL',
			columns: ['email'],
		},
	],
});

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
		Users
	],
	migrations: [],						//版控
});

module.exports = AppDataSource