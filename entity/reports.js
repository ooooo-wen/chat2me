const { EntitySchema } = require("typeorm");

exports.Reports = new EntitySchema({
	name: "Reports",
	tableName: "reports",
	columns: {
		report_id: {
			type: "bigint",
			primary: true,
			generated: "increment",
			comment: "舉報唯一識別碼",
		},
		report_reason: {
			type: "text",
			nullable: false,
			comment: "舉報原因",
		},
		report_status: {
			type: "enum",
			enum: ["pending", "reviewing", "resolved", "rejected"],
			nullable: false,
			default: "pending",
			comment: "處理狀態",
		},
		created_at: {
			type: "timestamp",
			nullable: false,
			default: () => "CURRENT_TIMESTAMP",
			comment: "舉報時間",
		},
		resolved_at: {
			type: "timestamp",
			nullable: true,
			comment: "處理時間",
		},
	},
	relations: {
		reporter: {
			type: "many-to-one",
			target: "Users",
			joinColumn: { name: "reporter_id", referencedColumnName: "user_id" },
			nullable: false,
			onDelete: "CASCADE",
			comment: "舉報者ID",
		},
		reportedPost: {
			type: "many-to-one",
			target: "Posts",
			joinColumn: { name: "reported_post_id", referencedColumnName: "post_id" },
			nullable: true,
			onDelete: "SET NULL",
			comment: "被舉報的貼文ID",
		},
		reportedComment: {
			type: "many-to-one",
			target: "Comments",
			joinColumn: { name: "reported_comment_id", referencedColumnName: "comment_id" },
			nullable: true,
			onDelete: "SET NULL",
			comment: "被舉報的留言ID",
		},
		reportedUser: {
			type: "many-to-one",
			target: "Users",
			joinColumn: { name: "reported_user_id", referencedColumnName: "user_id" },
			nullable: true,
			onDelete: "SET NULL",
			comment: "被舉報的用戶ID",
		},
		resolvedBy: {
			type: "many-to-one",
			target: "Users",
			joinColumn: { name: "resolved_by", referencedColumnName: "user_id" },
			nullable: true,
			onDelete: "SET NULL",
			comment: "處理者ID",
		},
	},
	indices: [
		{
			name: "IDX_report_status",
			columns: ["report_status"],
			comment: "用於查詢待處理舉報",
		},
		{
			name: "IDX_reports_created_at",
			columns: ["created_at"],
			comment: "用於時間排序",
		},
	],
});
