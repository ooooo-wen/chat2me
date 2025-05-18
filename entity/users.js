const { EntitySchema } = require('typeorm');

exports.Users = new EntitySchema({
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
		description: {
			type: "text",
			nullable: true,
			comment: "個人自我介紹描述"
		},
		name: {
			type: 'varchar',
			length: 50,
			unique: true,
			nullable: false,
			comment: '使用者名稱/暱稱',
		},
		avatar_url: {
			type: 'text',
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
			columns: ['name'],
		},
		{
			name: 'IDX_USER_EMAIL',
			columns: ['email'],
		},
	],
});