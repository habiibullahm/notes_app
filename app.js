const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

require("./startup")(app);


app.listen(PORT, () =>
  console.log(`notes_app is running at port ${PORT}`)
);

module.exports = app;
