const AppDataSource = require('../db');
const { Not } = require('typeorm');
const UsersRepo = AppDataSource.getRepository('Users');
const PostsRepo = AppDataSource.getRepository('Posts');
const ForumsRepo = AppDataSource.getRepository('Forums');
const FollowsRepo = AppDataSource.getRepository('UserFollows');
const PostLikesRepo = AppDataSource.getRepository('PostLikes');
const SavedPostsRepo = AppDataSource.getRepository('SavedPosts');


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

/* 個人牆 */
const profile = async (user_id) => {
	const user = await UsersRepo.findOne({
		where: { user_id },
		select: {
			user_id: true,
			name: true,
			avatar_url: true
		}
	});
	if (!user) return null;

	const followedCount = await FollowsRepo.count({
		where: { following: { user_id } }
	});

	const posts = await PostsRepo
		.createQueryBuilder('post')
		.leftJoinAndSelect('post.forum', 'forum')
		.leftJoinAndSelect('post.user', 'user')
		.where('post.user_id = :userId', { userId: user_id })
		.andWhere('post.is_deleted = false')
		.orderBy('post.created_at', 'DESC')
		.getMany();

	// 統計每篇文章的按讚數
	const postIds = posts.map(p => p.post_id);
	const likeCounts = await PostLikesRepo
		.createQueryBuilder('like')
		.select('like.post_id', 'post_id')
		.addSelect('COUNT(*)', 'likeCount')
		.where('like.post_id IN (:...ids)', { ids: postIds })
		.groupBy('like.post_id')
		.getRawMany();

	const likeMap = {};
	likeCounts.forEach(item => {
		likeMap[item.post_id] = parseInt(item.likeCount);
	});

	// 統計每篇收藏的文章
	const collectCounts = await SavedPostsRepo
		.createQueryBuilder('saved')
		.select('saved.post_id', 'post_id')
		.addSelect('COUNT(*)', 'collectCount')
		.where('saved.post_id IN (:...ids)', { ids: postIds })
		.groupBy('saved.post_id')
		.getRawMany();

	const collectMap = {};
	collectCounts.forEach(item => {
		collectMap[item.post_id] = parseInt(item.collectCount);
	});


	const articleList = posts.map(post => ({
		forumTitle: post.forum?.title || '',
		name: post.user?.name || '',
		articleTitle: post.title,
		articleContent: post.content,
		icon: post.user?.avatar_url || '',
		count: {
			like: likeMap[post.post_id] || 0,
			collect: collectMap[post.post_id] || 0,
			comment: post.comment_count
		},
		postDate: post.created_at.toISOString().split('T')[0]
	}));

	return {
		user: {
			id: user.user_id,
			name: user.name,
			imageUrl: user.avatar_url,
			followedCount,
			articleCount: articleList.length,
			articleList
		}
	};
}

module.exports = {
	getUsers,
	postUsers,
	putUser,
	getUserById,
	repeatName,
	getUsersByEmail,
	updateLastLogin,
	profile
}