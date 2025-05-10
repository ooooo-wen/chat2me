const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
	name: "Post",
	tableName: "posts",
	columns: {
		post_id: {
			primary: true,
			type: "bigint",
			generated: "increment",
			comment: "貼文唯一識別碼"
		},
		user_id: {
			type: "bigint",
			nullable: false,
			comment: "發文者ID"
		},
		forum_id: {
			type: "int",
			nullable: false,
			comment: "發布看板ID"
		},
		title: {
			type: "varchar",
			length: 255,
			nullable: false,
			comment: "貼文標題"
		},
		content: {
			type: "text",
			nullable: false,
			comment: "貼文內容"
		},
		created_at: {
			type: "timestamp",
			nullable: false,
			default: () => "CURRENT_TIMESTAMP",
			comment: "發布時間"
		},
		updated_at: {
			type: "timestamp",
			nullable: true,
			comment: "最後更新時間"
		},
		view_count: {
			type: "int",
			default: 0,
			comment: "瀏覽次數"
		},
		like_count: {
			type: "int",
			default: 0,
			comment: "按讚數量"
		},
		comment_count: {
			type: "int",
			default: 0,
			comment: "留言數量"
		},
		is_anonymous: {
			type: "boolean",
			default: false,
			comment: "是否匿名發布"
		},
		is_pinned: {
			type: "boolean",
			default: false,
			comment: "是否置頂"
		},
		is_deleted: {
			type: "boolean",
			default: false,
			comment: "是否已刪除"
		},
		delete_reason: {
			type: "varchar",
			length: 255,
			nullable: true,
			comment: "刪除原因"
		}
	},
	relations: {
		user: {
			type: "many-to-one",
			target: "User",
			joinColumn: { name: "user_id" },
			onDelete: "CASCADE"
		},
		forum: {
			type: "many-to-one",
			target: "Forum",
			joinColumn: { name: "forum_id" },
			onDelete: "CASCADE"
		}
	},
	indices: [
		{
			columns: ["forum_id", "created_at"],
			name: "IDX_forum_created",
			synchronize: true,
			comment: "用於看板貼文列表"
		},
		{
			columns: ["user_id", "created_at"],
			name: "IDX_user_created",
			synchronize: true,
			comment: "用於用戶發文列表"
		},
		{
			columns: ["title"],
			name: "IDX_title_search",
			synchronize: true,
			comment: "用於標題搜尋"
		}
	]
});
