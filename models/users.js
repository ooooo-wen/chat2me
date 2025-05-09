const AppDataSource = require('../db');
const UsersRepo = AppDataSource.getRepository('Users');

const getUsers = async () => {
	const users = await UsersRepo.find();
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


const postUsers = async (data) => {
	const result = await UsersRepo.save(data);
	return result;
}

module.exports = {
	postUsers,
	getUsersByEmail,
	updateLastLogin
}