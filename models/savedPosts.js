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

exports.getSavedPostsByUser = async (user_id) => {
	const savedPosts = await saveRepo
		.createQueryBuilder('saved')
		.leftJoinAndSelect('saved.post', 'post')
		.leftJoinAndSelect('post.forum', 'forum')
		.where('saved.user_id = :user_id', { user_id })
		.andWhere('post.is_deleted = false')
		.orderBy('saved.created_at', 'DESC')
		.getMany();

	// 整理成格式
	const articleList = savedPosts.map(sp => ({
		articleId: sp.post.post_id,
		forumTitle: sp.post.forum?.forum_name || '',
		content: sp.post.content,
	}));

	return articleList;
}