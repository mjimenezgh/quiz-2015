
var models = require('../models/models.js');

exports.load = function(req, res, next, quizId) {
    models.Quiz.find({
	where:  { id: Number(quizId) },
	include: [{ model: models.Comment }]
    }).then(function(quiz) {
	if (quiz) {
	    req.quiz = quiz;
	    next();
	} else {
	    next(new Error("No existe quizId: " + quizId));
	}
    }).catch(function(error) { next(error); });
};

// GET /quizes
exports.index = function(req, res) {
    if (req.query.search) {
	models.Quiz.findAll({ where: { pregunta: { like: '%' + req.query.search.trim().replace(/\s/g, '%') + '%' }},
			      order: 'pregunta' }).then(function(quizes) {
	    res.render('quizes/index', { quizes: quizes, errors: [] });
	});
    } else {
	models.Quiz.findAll().then(function(quizes) {
	    res.render('quizes/index', { quizes: quizes, errors: [] });
	}).catch(function(error) { next(error); });
    }
};


// GET /quizes/:quizId
exports.show = function(req, res) {
    models.Quiz.find(req.params.quizId).then(function(quiz) {
	res.render('quizes/show', { quiz: req.quiz, errors: [] });
    });
};

// GET /quizes/:quizId/answer
exports.answer = function(req, res) {
    var resultado = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
	resultado = 'Correcto';
    }
    res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: [] });
};


// GET /quizes/new
exports.new = function(req, res) {
    var quiz = models.Quiz.build({ // objeto Quiz no persistente
	pregunta: "Pregunta",
	respuesta: "Respuesta",
	tema: "Tema"
    });
    res.render('quizes/new', { quiz: quiz, errors: [] });

};

// POST /quizes/create
exports.create = function(req, res) {
    var quiz = models.Quiz.build(req.body.quiz);

    quiz.validate()
	.then(function(err) {
	    if (err) {
		res.render('quizes/new', {quiz: quiz, errors: err.errors});
	    } else {
		quiz.save({fields: ["pregunta", "respuesta", "tema"]})
		    .then(function() {
			res.redirect('/quizes');
		    });
	    }
	});
};

// GET /quizes/:quizId/edit
exports.edit = function(req, res) {
    var quiz = req.quiz;
    res.render('quizes/edit', { quiz: quiz, errors: [] });
};


// PUT /quizes/:quizId
exports.update = function(req, res) {
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    req.quiz.tema = req.body.quiz.tema;
    req.quiz
	.validate()
	.then(function(err) {
	    if (err) {
		res.render('quizes/edit', { quiz: req.quiz, errors: err.errors });
	    } else {
		req.quiz
		    .save( {fields: ["pregunta", "respuesta", "tema"]} )
		    .then(function() { res.redirect('/quizes'); });
	    }
	});
};

// DELETE /quizes/:quizId
exports.destroy = function(req, res) {
    req.quiz.destroy().then(function() {
	res.redirect('/quizes');
    }).catch(function(error) { next(error); });
};

// GET /quizes/statistics
exports.statistics = function(req, res) {
    models.Quiz.count().then(function(count) {
	req.stats = new Object;
	req.stats.quizes = new Object;
	req.stats.quizes.count = count;
	models.Comment.count().then(function(count) {
	    req.stats.comments = new Object;
	    req.stats.comments.count = count;
	    models.Quiz.findAll({ include: [{ model: models.Comment }] }).then(function(quizes) {
		req.stats.without_comments = 0;
		req.stats.with_comments = 0;
		for (i in quizes) {
		    if (quizes[i].Comments.length == 0) {
			req.stats.without_comments++;
		    } else {
			req.stats.with_comments++;
		    }
		}
		res.render('quizes/statistics', { stats: req.stats, errors: [] });
	    });

	});
    });
}
			    
