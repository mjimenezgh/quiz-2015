
var path = require('path');

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE

var Sequelize = require('sequelize');

// usar SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
			      { dialect: protocol,
				storage: protocol,
				port: port,
				host: host,
				storage: storage, // solo SQLite .env
				omitNull: true // solo Postgresql
			      }
			     );

var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
var Comment = sequelize.import(path.join(__dirname, 'comment'));

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz;
exports.Comment = Comment;

sequelize.sync().then(function() {
    Quiz.count().then(function(count) { 
	if (count === 0) {
	    Quiz.create({
		pregunta: 'Capital de Italia',
		respuesta: 'Roma',
		tema: 'humanidades'
	    });
	    Quiz.create({
		pregunta: 'Capital de Portugal',
		respuesta: 'Lisboa',
		tema: 'humanidades'
	    }).then(function() { console.log('Base de datos inicializada'); });
	}
    });
});


