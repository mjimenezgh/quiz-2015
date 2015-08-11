
var models = require('../models/models.js');

// GET /quizes/:quizId(\\d+)/comments/new
exports.new = function(req, res) {
    res.render('comments/new.ejs', { quizId: req.params.quizId, errors: [] });
};

exports.create = function(req, res) {
    var comment = models.Comment.build(
	{ texto: req.body.comment.texto,
	  QuizId: req.params.quizId
	});
    comment.validate()
	.then(function(err) {
	    if (err) {
		res.render('comments/new', {
		    comment: comment,
		    quizId: req.params.quizId });
	    } else {
		comment.save()
		    .then(function() {
			res.redirect('/quizes/' + req.params.quizId);
		    });
	    } 
	}).catch(function(error) { next(error); });
};