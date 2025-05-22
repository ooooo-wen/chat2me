const { EntitySchema } = require("typeorm");

exports.Messages = new EntitySchema({
	name: "Messages",
	tableName: "messages",
	columns: {
		message_id: {
			type: "bigint",
			primary: true,
			generated: "increment",
			comment: "訊息唯一識別碼",
		},
		content: {
			type: "text",
			nullable: false,
			comment: "訊息內容",
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
			comment: "發送時間",
		},
		is_deleted_by_sender: {
			type: "boolean",
			nullable: false,
			default: false,
			comment: "發送者是否刪除",
		},
		is_deleted_by_receiver: {
			type: "boolean",
			nullable: false,
			default: false,
			comment: "接收者是否刪除",
		},
	},
	relations: {
		sender: {
			type: "many-to-one",
			target: "Users",
			joinColumn: { name: "sender_id", referencedColumnName: "user_id" },
			nullable: false,
			onDelete: "CASCADE",
			comment: "發送者ID",
		},
		receiver: {
			type: "many-to-one",
			target: "Users",
			joinColumn: { name: "receiver_id", referencedColumnName: "user_id" },
			nullable: false,
			onDelete: "CASCADE",
			comment: "接收者ID",
		},
	},
	indices: [
		{
			name: "IDX_sender_receiver",
			columns: ["sender", "receiver"],
			comment: "用於查詢兩人的對話",
		},
		{
			name: "IDX_receiver_is_read",
			columns: ["receiver", "is_read"],
			comment: "用於查詢未讀訊息",
		},
		{
			name: "IDX_messages_created_at",
			columns: ["created_at"],
			comment: "用於時間排序",
		},
	],
});
