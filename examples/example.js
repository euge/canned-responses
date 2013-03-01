var canned = require("../"), server;

server = canned().init(__dirname + "/responses.js").listen(3000)