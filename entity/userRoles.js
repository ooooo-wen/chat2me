const { EntitySchema } = require("typeorm");

exports.UserRoles = new EntitySchema({
	name: "UserRoles",
	tableName: "user_roles",
	columns: {
		role_id: {
			type: "int",
			primary: true,
			generated: "increment",
			comment: "角色唯一識別碼",
		},
		role_type: {
			type: "enum",
			enum: ["user", "moderator", "admin", "super_admin"],
			default: "user",
			comment: "角色類型",
		},
		granted_at: {
			type: "timestamp",
			nullable: false,
			default: () => "CURRENT_TIMESTAMP",
			comment: "授權時間",
		},
	},
	relations: {
		user: {
			type: "many-to-one",
			target: "Users",
			joinColumn: { name: "user_id", referencedColumnName: "user_id" },
			nullable: false,
			onDelete: "CASCADE",
			comment: "使用者ID",
		},
		forum: {
			type: "many-to-one",
			target: "Forums",
			joinColumn: { name: "forum_id", referencedColumnName: "forum_id" },
			nullable: true,
			onDelete: "SET NULL",
			comment: "關聯的看板ID (針對版主)",
		},
		granted_by_user: {
			type: "many-to-one",
			target: "Users",
			joinColumn: { name: "granted_by", referencedColumnName: "user_id" },
			nullable: true,
			onDelete: "SET NULL",
			comment: "授權者ID",
		},
	},
	indices: [
		{
			name: "IDX_unique_user_forum_role",
			columns: ["user", "forum", "role_type"],  // 改成 relations 屬性名稱和 columns 名稱
			unique: true,
			comment: "確保角色不重複",
		},
		{
			name: "IDX_user_id",
			columns: ["user"],
			comment: "用於查詢使用者的角色",
		},
		{
			name: "IDX_forum_id",
			columns: ["forum"],
			comment: "用於查詢看板的角色",
		},
	],
});
