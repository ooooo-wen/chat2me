const AppDataSource = require('../db');
const PostsRepo = AppDataSource.getRepository('Posts');
const PostTagsRepo = AppDataSource.getRepository('PostTags');
const MediaRepo = AppDataSource.getRepository('Media');
const TagsRepo = AppDataSource.getRepository('Tags');

const getPostsByUserId = async (user_id) => {
	const posts = await PostsRepo.find({ where: { user_id } });
	return posts;
};

/* 取得熱門文章 20 筆資料 */
const getHotPosts = async (cursor, limit) => {
	const posts = await PostsRepo
		.createQueryBuilder('post')
		.leftJoinAndSelect('post.user', 'user')		// 關聯 user
		.leftJoinAndSelect('post.forum', 'forum')	// 關聯 看板
		.where('post.is_deleted = :isDeleted', { isDeleted: false })
		.orderBy('post.like_count', 'DESC') // 熱門依據
		.skip(cursor)
		.take(limit)
		.getMany();

	return posts;
}

/* 取得最新文章 20 筆資料 */
const getLatestPosts = async (cursor, limit) => {
	const posts = await PostsRepo
		.createQueryBuilder('post')
		.leftJoinAndSelect('post.user', 'user')      // 關聯 user
		.leftJoinAndSelect('post.forum', 'forum')    // 關聯 看板
		.where('post.is_deleted = :isDeleted', { isDeleted: false })
		.orderBy('post.created_at', 'DESC')          // 依據建立時間排序，最新的在前
		.skip(cursor)
		.take(limit)
		.getMany();

	return posts;
}

/* 新增貼文 */
const createPost = async ({ user_id, forum_id, title, content, img_url = [], tag = [] }) => {
	// 新增主貼文
	const post = await PostsRepo.save({ user_id, forum_id, title, content });

	// 儲存圖片（關聯貼文）
	const imageEntities = img_url.map((url) => ({
		url,
		media_type: 'image',
		post: { post_id: post.post_id },
	}));

	if (imageEntities.length > 0) {
		await MediaRepo.save(imageEntities);
	}

	// 儲存標籤（先查 tag 是否存在，沒有就創，然後建立關聯）
	const tagEntities = [];

	for (const tagName of tag) {
		let tagEntity = await TagsRepo.findOne({ where: { tag_name: tagName } });

		if (!tagEntity) {
			tagEntity = await TagsRepo.save({ tag_name: tagName });
		}

		tagEntities.push({
			post: { post_id: post.post_id },
			tag: { tag_id: tagEntity.tag_id },
		});
	}

	if (tagEntities.length > 0) {
		await PostTagsRepo.save(tagEntities);
	}

	return post;
};

/* 上傳圖片 */
const upload = async (files) => {
	if (!files || files.length === 0) {
		throw new Error('未上傳任何檔案');
	}

	const imageUrls = [];

	for (const file of files) {
		const url = `${file.destination}${file.filename}`;

		const media = MediaRepo.create({
			media_type: 'image',
			url,
			thumbnail_url: null,
		});

		await MediaRepo.save(media);
		imageUrls.push(url);
	}

	return imageUrls;
};

module.exports = {
	getPostsByUserId,
	createPost,
	upload,
	getHotPosts,
	getLatestPosts
};
