const AppDataSource = require('../db');
const { Not } = require('typeorm');
const UsersRepo = AppDataSource.getRepository('Users');

const getUsers = async () => {
	const users = await UsersRepo.find();

	return users;
}

const getUserById = async (id) => {
	const user = await UsersRepo.findOne({ where: { user_id: id } });
	return user;
};

const repeatName = async (id, name) => {
	const exists = await UsersRepo.findOne({
		where: {
			name: name,
			user_id: Not(id)
		},
		attributes: ['user_id'], // 僅選擇 id 欄位，減少資料庫負載
	});
	return !!exists; // 將查詢結果轉換為布林值 (true 表示存在，false 表示不存在)
}


const getUsersByEmail = async (email) => {
	const form = await UsersRepo.findOne({
		where: {
			email: email
		}
	});

	return form;
}

/* 更新登入時間 */
const updateLastLogin = async (id) => {
	const result = await UsersRepo.update(
		{ user_id: id },
		{ last_login: new Date() } // 用 JavaScript 的當下時間
	);
}

/* 新增使用者資料 */
const postUsers = async (data) => {
	const result = await UsersRepo.save(data);
	return result;
}

/* 更新使用者資料 */
const putUser = async (data) => {
	return await UsersRepo.save(data);
}

module.exports = {
	getUsers,
	postUsers,
	putUser,
	getUserById,
	repeatName,
	getUsersByEmail,
	updateLastLogin
}