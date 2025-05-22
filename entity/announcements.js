const { EntitySchema } = require("typeorm");

exports.Announcements = new EntitySchema({
	name: "Announcements",
	tableName: "announcements",
	columns: {
		announcement_id: {
			type: "int",
			primary: true,
			generated: "increment",
			comment: "公告唯一識別碼",
		},
		title: {
			type: "varchar",
			length: 255,
			nullable: false,
			comment: "公告標題",
		},
		content: {
			type: "text",
			nullable: false,
			comment: "公告內容",
		},
		created_at: {
			type: "timestamp",
			nullable: false,
			default: () => "CURRENT_TIMESTAMP",
			comment: "發布時間",
		},
		expires_at: {
			type: "timestamp",
			nullable: true,
			comment: "到期時間",
		},
		is_active: {
			type: "boolean",
			nullable: false,
			default: true,
			comment: "是否啟用",
		},
	},
	indices: [
		{
			name: "IDX_active_expires",
			columns: ["is_active", "expires_at"],
			comment: "用於查詢有效公告",
		},
	],
});
