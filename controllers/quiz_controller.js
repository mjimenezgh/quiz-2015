
var models = require('../models/models.js');

// GET /quizes
exports.index = function(req, res) {
    models.Quiz.findAll().then(function(quizes) {
	res.render('quizes/index.ejs', { quizes: quizes });
    });
};

// GET /quizes/:quizId
exports.show = function(req, res) {
    models.Quiz.find(req.params.quizId).then(function(quiz) {
	res.render('quizes/show', { quiz: quiz });
    });
};

// GET /quizes/:quizId/answer
exports.answer = function(req, res) {
    models.Quiz.find(req.params.quizId).then(function(quiz) {
	if (req.query.respuesta == quiz.respuesta) {
	    res.render('quizes/answer', { quiz: quiz, respuesta: 'Correcto' });
	} else {
	    res.render('quizes/answer', { quiz: quiz, respuesta: 'Incorrecto' });
	}
    });
};

// GET /quizes/new
exports.new = function(req, res) {
    var quiz = models.Quiz.build({ // objeto Quiz no persistente
	pregunta: "Pregunta",
	respuesta: "Respuesta"
    });
    res.render('quizes/new', { quiz: quiz });

};

// POST /quizes/create
exports.create = function(req, res) {
    var quiz = models.Quiz.build(req.body.quiz);

    quiz.save({fields: ["pregunta", "respuesta"]}).then(function() {
	res.redirect('/quizes');
    });
};