const { EntitySchema } = require("typeorm");

exports.Forums = new EntitySchema({
	name: "Forums",
	tableName: "forums",
	columns: {
		forum_id: {
			type: "int",
			primary: true,
			generated: "increment",
			comment: "看板唯一識別碼",
		},
		forum_name: {
			type: "varchar",
			length: 50,
			unique: true,
			nullable: false,
			comment: "看板名稱",
		},
		description: {
			type: "text",
			nullable: true,
			comment: "看板描述",
		},
		type: {
			type: "text",
			nullable: true,
			comment: "看板類別",
		},
		creation_date: {
			type: "timestamp",
			nullable: false,
			default: () => "CURRENT_TIMESTAMP",
			comment: "建立日期",
		},
		subscriber_count: {
			type: "int",
			default: 0,
			comment: "訂閱人數",
		},
		post_count: {
			type: "int",
			default: 0,
			comment: "貼文數量",
		},
		is_official: {
			type: "boolean",
			default: false,
			comment: "是否為官方看板",
		},
		is_nsfw: {
			type: "boolean",
			default: false,
			comment: "是否為限制級內容",
		},
	},
	relations: {
		category: {
			type: "many-to-one",
			target: "ForumCategories",
			joinColumn: {
				name: "category_id",
				referencedColumnName: "category_id",
			},
			nullable: true,
			onDelete: "SET NULL",
			comment: "看板分類ID",
		},
	},
	indices: [
		{
			name: "IDX_forum_name",
			columns: ["forum_name"],
		},
		{
			name: "IDX_category",
			columns: ["category"],  // 用關聯名
		},
	],
});
