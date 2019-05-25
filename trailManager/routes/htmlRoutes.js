const db = require("../models");
const axios = require("axios");

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    db.Example.findAll({}).then(function (dbExamples) {
      res.render("index", {
        msg: "Welcome!",
        examples: dbExamples
      });
    });
  });

  app.get("/trail", function (req, res) {
    // console.log(req.query);
    var minLengthValue = req.query.minLengthInput;
    if (!minLengthValue) {
      minLengthValue = '10'
    }
    // Salt Lake City 40.7608° N, 111.8910° W
    const apiKey = encodeURIComponent('200472533-7cad91d48c212e1fc15dd52e7b19b2ad');
    const lat = encodeURIComponent('40.7608');
    const long = encodeURIComponent('-111.8910');
    const maxDistance = encodeURIComponent('100');
    const maxResults = encodeURIComponent('100');
    const minLength = encodeURIComponent(minLengthValue);
    const apiSort = 'quality';
    const apiUrl = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=${maxDistance}&maxResults=${maxResults}&minLength=${minLength}&sort=${apiSort}&key=${apiKey}`;
    console.log(apiUrl);
    // TODO: Tranform the data to remove entries below the maximum length we require, which is not provided by the API
    // Pull data from Trails API
    // https://www.hikingproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&key=200472533-7cad91d48c212e1fc15dd52e7b19b2ad
    axios.get(apiUrl)
      .then(function (response) {

        // console.log(response.data.trails);
        res.render("trail", response.data);
      })
      .catch(function (err) {
        console.log(err);
      })
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function (req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function (dbExample) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
