const { EntitySchema } = require("typeorm");

exports.UserFollows = new EntitySchema({
	name: "UserFollows",
	tableName: "user_follows",
	columns: {
		follow_id: {
			type: "bigint",
			primary: true,
			generated: "increment",
			comment: "追蹤關係唯一識別碼",
		},
		created_at: {
			type: "timestamp",
			nullable: false,
			default: () => "CURRENT_TIMESTAMP",
			comment: "追蹤時間",
		},
	},
	relations: {
		follower: {
			type: "many-to-one",
			target: "Users",
			joinColumn: {
				name: "follower_id",
				referencedColumnName: "user_id",
			},
			nullable: false,
			onDelete: "CASCADE",
			comment: "追蹤者ID",
		},
		following: {
			type: "many-to-one",
			target: "Users",
			joinColumn: {
				name: "following_id",
				referencedColumnName: "user_id",
			},
			nullable: false,
			onDelete: "CASCADE",
			comment: "被追蹤者ID",
		},
	},
	indices: [
		{
			name: "UQ_follower_following",
			columns: ["follower", "following"],
			unique: true,
			comment: "確保追蹤關係不重複",
		},
		{
			name: "IDX_follower",
			columns: ["follower"],
			comment: "用於查詢用戶追蹤了誰",
		},
		{
			name: "IDX_following",
			columns: ["following"],
			comment: "用於查詢誰追蹤了該用戶",
		},
	],
});
