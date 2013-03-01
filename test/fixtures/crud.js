get("/people", [
  { id : 1 },
  { id : 2 }
]);

post("/people", { 
  id : 2 
});

put("/people/1", { 
  id : 1, 
  name : "Bob"
});

del("/people/1", { });