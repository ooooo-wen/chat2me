const { EntitySchema } = require("typeorm");

exports.PostTags = new EntitySchema({
	name: "PostTags",
	tableName: "post_tags",
	columns: {
		post_tag_id: {
			type: "bigint",
			primary: true,
			generated: "increment",
			comment: "關聯唯一識別碼",
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
			comment: "貼文ID",
		},
		tag: {
			type: "many-to-one",
			target: "Tags",
			joinColumn: {
				name: "tag_id",
				referencedColumnName: "tag_id",
			},
			nullable: false,
			onDelete: "CASCADE",
			comment: "標籤ID",
		},
	},
	indices: [
		{
			name: "UQ_post_tag",
			columns: ["post", "tag"],
			unique: true,
			comment: "確保一篇貼文不會重複同一標籤",
		},
		{
			name: "IDX_post_tags_post_id",
			columns: ["post"],
			comment: "用於查詢貼文的所有標籤",
		},
		{
			name: "IDX_tag_id",
			columns: ["tag"],
			comment: "用於查詢標籤相關的所有貼文",
		},
	],
});
