var canned = require("../"),
    server = new canned(__dirname + "/responses.js").server;

server.listen(3000);