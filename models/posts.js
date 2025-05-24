const AppDataSource = require('../db');
const PostsRepo = AppDataSource.getRepository('Posts');
const PostTagsRepo = AppDataSource.getRepository('PostTags');
const MediaRepo = AppDataSource.getRepository('Media');
const TagsRepo = AppDataSource.getRepository('Tags');

const getPostsByUserId = async (user_id) => {
	const posts = await PostsRepo.find({ where: { user_id } });
	return posts;
};

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

module.exports = {
	getPostsByUserId,
	createPost,
};
