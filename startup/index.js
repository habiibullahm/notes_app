module.exports = function (app) {
    require("./config")();
    require("./cors")(app);
    require("./logger")(app);
    require("./routes")(app)
    require("./parser")(app);
}