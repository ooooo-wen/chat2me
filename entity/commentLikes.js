const { EntitySchema } = require("typeorm");

exports.CommentLikes = new EntitySchema({
	name: "CommentLikes",
	tableName: "comment_likes",
	columns: {
		like_id: {
			type: "bigint",
			primary: true,
			generated: "increment",
			comment: "點讚唯一識別碼",
		},
		created_at: {
			type: "timestamp",
			nullable: false,
			default: () => "CURRENT_TIMESTAMP",
			comment: "點讚時間",
		},
		// 新增外鍵欄位
		comment_id: {
			type: "bigint",
			nullable: false,
			comment: "被讚的留言ID",
		},
		user_id: {
			type: "bigint",
			nullable: false,
			comment: "點讚的使用者ID",
		},
	},
	relations: {
		comment: {
			type: "many-to-one",
			target: "Comments",
			joinColumn: {
				name: "comment_id",
				referencedColumnName: "comment_id",
			},
			nullable: false,
			onDelete: "CASCADE",
			comment: "被讚的留言ID",
		},
		user: {
			type: "many-to-one",
			target: "Users",
			joinColumn: {
				name: "user_id",
				referencedColumnName: "user_id",
			},
			nullable: false,
			onDelete: "CASCADE",
			comment: "點讚的使用者ID",
		},
	},
	indices: [
		{
			name: "UQ_comment_user",
			columns: ["comment_id", "user_id"],
			unique: true,
			comment: "確保一個使用者只能讚一次",
		},
		{
			name: "IDX_comment_id",
			columns: ["comment_id"],
		},
		{
			name: "IDX_comment_likes_user_id",
			columns: ["user_id"],
		},
	],
});
