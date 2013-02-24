get("/people", [ 
  { name : "Euge" }, 
  { name : "Bob" } 
]);

get("/people/1", {
  name : "Euge",
  address : "1234 Main St."
});
