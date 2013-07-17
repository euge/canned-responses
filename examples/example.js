var CannedResponses = require("../");
var canned = new CannedResponses(__dirname + "/responses.js", function index(req, res) {
  res.send('\
    <html>\
      <body>\
        My canned responses server! Hit some other urls<br/>\
        <a target="_new" href="/name">/name</a><br/>\
        <a target="_new" href="/stuff">/stuff</a><br/>\
        <a target="_new" href="/monkey">/monkey</a><br/>\
      </body>\
    </html>')
});

canned.server.listen(3000);