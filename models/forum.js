const AppDataSource = require('../db');
const ForumsRepo = AppDataSource.getRepository('Forums');

exports.createForum = async (data) => {
    const { forum_name, description = null, is_official, is_nsfw } = data;

    // 驗證 forum_name 是否重複
    const exists = await ForumsRepo.findOneBy({ forum_name });
    if (exists) {
        const err = new Error('看板名稱已存在');
        err.code = 'DUPLICATE_FORUM';
        throw err;
    }

    // 建立 entity
    const newForum = ForumsRepo.create({
        forum_name,
        description,
        is_official,
        is_nsfw,
    });

    // 儲存到資料庫
    const saved = await ForumsRepo.save(newForum);
    return saved;
};