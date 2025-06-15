const { EntitySchema } = require("typeorm");

exports.Tags = new EntitySchema({
	name: "Tags",
	tableName: "tags",
	columns: {
		tag_id: {
			type: "int",
			primary: true,
			generated: "increment",
			comment: "標籤唯一識別碼",
		},
		tag_name: {
			type: "varchar",
			length: 50,
			nullable: false,
			unique: true,
			comment: "標籤名稱",
		},
		usage_count: {
			type: "int",
			nullable: false,
			default: 0,
			comment: "使用次數",
		},
	},
	indices: [
		{
			name: "IDX_tag_name",
			columns: ["tag_name"],
		},
		{
			name: "IDX_usage_count",
			columns: ["usage_count"],
			comment: "用於熱門標籤排序",
		},
	],
	relations: {
		postTags: {
			type: "one-to-many",
			target: "PostTags",
			inverseSide: "tag", // 對應 PostTags 裡的 tag 關聯
		},
	},
});
