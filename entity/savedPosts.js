const { EntitySchema } = require("typeorm");

exports.SavedPosts = new EntitySchema({
	name: "SavedPosts",
	tableName: "saved_posts",
	columns: {
		saved_id: {
			type: "bigint",
			primary: true,
			generated: "increment",
			comment: "收藏唯一識別碼",
		},
		created_at: {
			type: "timestamp",
			nullable: false,
			default: () => "CURRENT_TIMESTAMP",
			comment: "收藏時間",
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
			comment: "收藏者ID",
		},
		post: {
			type: "many-to-one",
			target: "Posts",
			joinColumn: {
				name: "post_id",
				referencedColumnName: "post_id",
			},
			nullable: false,
			onDelete: "CASCADE",
			comment: "被收藏的貼文ID",
		},
	},
	indices: [
		{
			name: "UQ_user_post",
			columns: ["user", "post"],
			unique: true,
			comment: "確保收藏關係不重複",
		},
		{
			name: "IDX_saved_posts_user_id",
			columns: ["user"],
			comment: "用於查詢用戶的所有收藏",
		},
		{
			name: "IDX_post_id",
			columns: ["post"],
			comment: "用於查詢貼文被多少人收藏",
		},
	],
});
