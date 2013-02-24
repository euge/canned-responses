var connect  = require("connect"),
    Playback = require("../");

connect()
  .use((new Playback("playbackConfig.js")).middleware)
  .listen(3000);
 