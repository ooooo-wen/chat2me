const AppDataSource = require('../db');
const PostsRepo = AppDataSource.getRepository('Posts');


const getPostsByUserId = async (user_id) => {
    const posts = await PostsRepo.find({ where: { user_id } });
    return posts;
}

module.exports = {
    getPostsByUserId
}