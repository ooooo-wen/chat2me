const { EntitySchema } = require("typeorm");

exports.ForumCategories = new EntitySchema({
	name: "ForumCategories",
	tableName: "forum_categories",
	columns: {
		category_id: {
			type: Number,
			primary: true,
			generated: "increment",
			comment: "分類唯一識別碼",
		},
		category_name: {
			type: String,
			length: 50,
			unique: true,
			nullable: false,
			comment: "分類名稱",
		},
		display_order: {
			type: Number,
			nullable: false,
			comment: "顯示順序",
		},
	},
});
