get("/name", function(req, res) {
  res.send({
    name : "bob",
    age : 23
  });
});

get("/stuff", function(req, res) {
  res.send({
    name : "hahah",
    address : "1234 sjdasd"
  });
});

get("/monkey", function(req, res) {
  res.set({
    'X-Monkey-Header': '12345'
  });
  res.status(323);
  res.send({ value : Math.random(10) });
});
