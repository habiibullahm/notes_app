const express = require("express");
const morgan = require("morgan");
const app = express();
const PORT = process.env.PORT || 5000;
const routes = require("./routes");
const cors = require("cors");

require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/api/v1", routes)


app.listen(PORT, () =>
  console.log(`notes_app is running at port ${PORT}`)
);

module.exports = app;
