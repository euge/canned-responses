var connect         = require("connect"),
    CannedResponses = require("../");

connect()
  .use((new CannedResponses("responses.js")).middleware)
  .listen(3000);
 