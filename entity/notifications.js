const { EntitySchema } = require("typeorm");

exports.Notifications = new EntitySchema({
	name: "Notifications",
	tableName: "notifications",
	columns: {
		notification_id: {
			type: "bigint",
			primary: true,
			generated: "increment",
			comment: "通知唯一識別碼",
		},
		notification_type: {
			type: "enum",
			enum: ["like", "comment", "follow", "mention", "system"],
			nullable: false,
			comment: "通知類型",
		},
		reference_id: {
			type: "bigint",
			nullable: true,
			comment: "相關的貼文或留言ID",
		},
		content: {
			type: "text",
			nullable: true,
			comment: "通知內容",
		},
		is_read: {
			type: "boolean",
			nullable: false,
			default: false,
			comment: "是否已讀",
		},
		created_at: {
			type: "timestamp",
			nullable: false,
			default: () => "CURRENT_TIMESTAMP",
			comment: "通知時間",
		},
	},
	relations: {
		user: {
			type: "many-to-one",
			target: "Users",
			joinColumn: {
				name: "user_id",
				referencedColumnName: "user_id",
			},
			nullable: false,
			onDelete: "CASCADE",
			comment: "接收通知的使用者ID",
		},
		actor: {
			type: "many-to-one",
			target: "Users",
			joinColumn: {
				name: "actor_id",
				referencedColumnName: "user_id",
			},
			nullable: true,
			onDelete: "SET NULL",
			comment: "觸發通知的使用者ID",
		},
	},
	indices: [
		{
			name: "IDX_user_is_read",
			columns: ["user", "is_read"],
			comment: "用於查詢用戶的未讀通知",
		},
		{
			name: "IDX_notifications_created_at",
			columns: ["created_at"],
			comment: "用於時間排序",
		},
	],
});
