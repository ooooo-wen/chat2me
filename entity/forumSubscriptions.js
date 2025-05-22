const { EntitySchema } = require("typeorm");

exports.forumSubscriptions = new EntitySchema({
	name: "forumSubscriptions",
	tableName: "forum_subscriptions",
	columns: {
		subscription_id: {
			type: "bigint",
			primary: true,
			generated: "increment",
			comment: "訂閱唯一識別碼",
		},
		created_at: {
			type: "timestamp",
			nullable: false,
			default: () => "CURRENT_TIMESTAMP",
			comment: "訂閱時間",
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
			comment: "訂閱者ID",
		},
		forum: {
			type: "many-to-one",
			target: "Forums",
			joinColumn: {
				name: "forum_id",
				referencedColumnName: "forum_id",
			},
			nullable: false,
			onDelete: "CASCADE",
			comment: "被訂閱的看板ID",
		},
	},
	indices: [
		{
			name: "UQ_user_forum",
			columns: ["user", "forum"],
			unique: true,
			comment: "確保訂閱關係不重複",
		},
		{
			name: "IDX_user",
			columns: ["user"],
			comment: "用於查詢用戶訂閱的所有看板",
		},
		{
			name: "IDX_forum",
			columns: ["forum"],
			comment: "用於查詢看板的所有訂閱者",
		},
	],
});
