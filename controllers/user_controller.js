var users = { admin: { username: 'admin', password: '1234' },
	     pepe: { username: 'pepe', password: '5678' }};

exports.autenticar = function(login, password, callback) {
    if (users[login]) {
	if (password == users[login].password) {
	    callback(null, users[login]);
	} else {
	    callback(new Error("Password erróneo"));
	}
    } else {
	callback(new Error("No existe el usuario"));
    }
};