const { EntitySchema } = require("typeorm");

exports.PostLikes = new EntitySchema({
	name: "PostLikes",
	tableName: "post_likes",
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
	},
	relations: {
		post: {
			type: "many-to-one",
			target: "Posts",
			joinColumn: {
				name: "post_id",
				referencedColumnName: "post_id",
			},
			nullable: false,
			onDelete: "CASCADE",
			comment: "被讚的貼文ID",
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
			name: "UQ_post_user",
			columns: ["post", "user"],
			unique: true,
			comment: "確保一個使用者只能讚一次",
		},
		{
			name: "IDX_post_likes_post_id",
			columns: ["post"],
		},
		{
			name: "IDX_post_likes_user_id",
			columns: ["user"],
		},
	],
});
