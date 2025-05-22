const { EntitySchema } = require("typeorm");

exports.Comments = new EntitySchema({
	name: "Comments",
	tableName: "comments",
	columns: {
		comment_id: {
			type: "bigint",
			primary: true,
			generated: "increment",
			comment: "留言唯一識別碼",
		},
		content: {
			type: "text",
			nullable: false,
			comment: "留言內容",
		},
		created_at: {
			type: "timestamp",
			nullable: false,
			default: () => "CURRENT_TIMESTAMP",
			comment: "留言時間",
		},
		updated_at: {
			type: "timestamp",
			nullable: true,
			onUpdate: "CURRENT_TIMESTAMP",
			comment: "最後編輯時間",
		},
		like_count: {
			type: "int",
			default: 0,
			comment: "按讚數量",
		},
		is_anonymous: {
			type: "boolean",
			default: false,
			comment: "是否匿名留言",
		},
		is_deleted: {
			type: "boolean",
			default: false,
			comment: "是否已刪除",
		},
		// 新增關聯欄位
		post_id: {
			type: "bigint",
			nullable: false,
			comment: "關聯貼文ID",
		},
		user_id: {
			type: "bigint",
			nullable: false,
			comment: "留言者ID",
		},
		parent_comment_id: {
			type: "bigint",
			nullable: true,
			comment: "父留言ID，用於巢狀留言",
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
			comment: "關聯的貼文ID",
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
			comment: "留言者ID",
		},
		parent_comment: {
			type: "many-to-one",
			target: "Comments",
			joinColumn: {
				name: "parent_comment_id",
				referencedColumnName: "comment_id",
			},
			nullable: true,
			onDelete: "SET NULL",
			comment: "父留言ID，用於巢狀留言",
		},
	},
	indices: [
		{
			name: "IDX_comments_post_id",
			columns: ["post_id"],
		},
		{
			name: "IDX_parent_comment_id",
			columns: ["parent_comment_id"],
		},
	],
});
