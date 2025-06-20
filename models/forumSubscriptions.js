const AppDataSource = require('../db');
const subRepo = AppDataSource.getRepository('forumSubscriptions');

/* 追蹤看板 */
exports.subscripForum = async (user, forum) => {
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

/* 取的追蹤看板 */
exports.getSubscriptionsForm = async (id) => {
	const subscription = await subRepo.findOneBy({ subscription_id: id });

	return subscription;
}

/* 刪除追蹤看板 */
exports.deleteSubscriptionsForm = async (id, user_id) => {
	const result = await subRepo.delete({
		subscription_id: id,
		user: { user_id: user_id },
	});

	return result;
}

exports.getSubscribedForumsByUser = async (user_id) => {
	const subscriptions = await subRepo
		.createQueryBuilder('subscription')
		.leftJoinAndSelect('subscription.forum', 'forum')
		.where('subscription.user_id = :user_id', { user_id: user_id })
		.getMany();

	const forumList = subscriptions.map(sub => ({
		forumId: sub.forum.forum_id,
		forumTitle: sub.forum.forum_name,
		type: sub.forum.type,
		description: sub.forum.description
	}));

	return forumList;
};