const AppDataSource = require('../db');
const saveRepo = AppDataSource.getRepository('SavedPosts');

exports.savePost = async (user_id, post_id) => {
	const existing = await saveRepo.findOne({
		where: {
			user: { user_id: user_id },
			post: { post_id: post_id },
		},
	});
	if (existing) return null;

	const saved = saveRepo.create({
		user: { user_id: user_id },
		post: { post_id: post_id },
	});

	return await saveRepo.save(saved);
};

exports.unsavePost = async (user_id, post_id) => {
	const existing = await saveRepo.findOne({
		where: {
			user: { user_id: user_id },
			post: { post_id: post_id },
		},
	});
	if (!existing) return null;

	return await saveRepo.remove(existing);
};