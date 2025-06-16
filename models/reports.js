const AppDataSource = require('../db');
const reportsRepo = AppDataSource.getRepository('Reports');

exports.createReportForPost = async ({ reporterId, postId, reason }) => {
	const report = reportsRepo.create({
		report_reason: reason,
		report_status: 'pending',
		reporter: { user_id: reporterId },
		reportedPost: { post_id: postId },
	});

	return await reportsRepo.save(report);
};