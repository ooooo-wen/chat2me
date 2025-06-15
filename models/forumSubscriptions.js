const AppDataSource = require('../db');
const subRepo = AppDataSource.getRepository('forumSubscriptions');

exports.subscribeForum = async (user, forum) => {
	const existing = await subRepo.findOne({
		where: {
			user: { user_id: user.user_id },
			forum: { forum_id: forum.forum_id },
		},
	});

	if (existing) {
		return { exists: true };
	}

	const newSub = subRepo.create({ user, forum });
	const saved = await subRepo.save(newSub);

	return { exists: false, data: saved };
}