const { EntitySchema } = require("typeorm");

exports.Media = new EntitySchema({
	name: "Media",
	tableName: "media",
	columns: {
		media_id: {
			type: "bigint",
			primary: true,
			generated: "increment",
			comment: "媒體唯一識別碼",
		},
		media_type: {
			type: "enum",
			enum: ["image", "video", "gif", "audio", "document"],
			nullable: false,
			comment: "媒體類型",
		},
		url: {
			type: "varchar",
			length: 255,
			nullable: false,
			comment: "媒體檔案連結",
		},
		thumbnail_url: {
			type: "varchar",
			length: 255,
			nullable: true,
			comment: "縮圖連結",
		},
		created_at: {
			type: "timestamp",
			nullable: false,
			default: () => "CURRENT_TIMESTAMP",
			comment: "上傳時間",
		},
	},
	relations: {
		post: {
			type: "many-to-one",
			target: "Posts",
			joinColumn: { name: "post_id", referencedColumnName: "post_id" },
			nullable: true,
			onDelete: "CASCADE",
			comment: "關聯的貼文ID",
		},
		comment: {
			type: "many-to-one",
			target: "Comments",
			joinColumn: { name: "comment_id", referencedColumnName: "comment_id" },
			nullable: true,
			onDelete: "CASCADE",
			comment: "關聯的留言ID",
		},
	},
	indices: [
		{ name: "IDX_post", columns: ["post"] },
		{ name: "IDX_comment", columns: ["comment"] },
	],
});
