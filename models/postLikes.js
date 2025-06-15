const AppDataSource = require('../db');
const likeRepo = AppDataSource.getRepository('PostLikes');

/* 按讚 */
exports.likePost = async (user_id, post_id) => {
	// 先檢查有沒有讚過
	const existing = await likeRepo.findOne({
		where: {
			user: { user_id: user_id },
			post: { post_id: post_id },
		},
	});

	if (existing) return null;

	// 新增一筆讚
	const newLike = likeRepo.create({
		user: { user_id: user_id },
		post: { post_id: post_id },
	});
	return await likeRepo.save(newLike);
};

/* 取消按讚 */
exports.unlikePost = async (user_id, post_id) => {
	const existing = await likeRepo.findOne({
		where: {
			user: { user_id: user_id },
			post: { post_id: post_id },
		},
	});
	if (!existing) return null;

	return await likeRepo.remove(existing);
};