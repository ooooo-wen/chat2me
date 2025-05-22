const { EntitySchema } = require("typeorm");

exports.UserActivityLogs = new EntitySchema({
	name: "UserActivityLogs",
	tableName: "user_activity_logs",
	columns: {
		log_id: {
			type: "bigint",
			primary: true,
			generated: "increment",
			comment: "日誌唯一識別碼",
		},
		activity_type: {
			type: "varchar",
			length: 50,
			nullable: false,
			comment: "活動類型",
		},
		ip_address: {
			type: "varchar",
			length: 45,
			nullable: false,
			comment: "IP地址",
		},
		device_info: {
			type: "varchar",
			length: 255,
			nullable: true,
			comment: "裝置資訊",
		},
		created_at: {
			type: "timestamp",
			nullable: false,
			default: () => "CURRENT_TIMESTAMP",
			comment: "活動時間",
		},
	},
	relations: {
		user: {
			type: "many-to-one",
			target: "Users",
			joinColumn: { name: "user_id", referencedColumnName: "user_id" },
			nullable: false,
			onDelete: "CASCADE",
			comment: "使用者ID",
		},
	},
	indices: [
		{
			name: "IDX_user_activity_logs_user_id",
			columns: ["user"],     // 注意這裡改成 user，不是 user_id
			comment: "用於查詢特定用戶的活動",
		},
		{
			name: "IDX_activity_type",
			columns: ["activity_type"],
			comment: "用於查詢特定類型的活動",
		},
		{
			name: "IDX_created_at",
			columns: ["created_at"],
			comment: "用於時間排序",
		},
	],
});
