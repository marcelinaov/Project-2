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

  app.get("/calendar", function (req, res) {
    db.Example.findAll({}).then(function (dbExamples) {
      res.render("calendar", {

      });
    });
  });

  app.get("/trail", function (req, res) {
    // console.log(req.query);
    const availableHours = req.query.availableHours || 10;
    // Salt Lake City 40.7608° N, 111.8910° W
    const apiKey = encodeURIComponent('200472533-7cad91d48c212e1fc15dd52e7b19b2ad');
    const lat = encodeURIComponent('40.7608');
    const long = encodeURIComponent('-111.8910');
    const maxDistance = encodeURIComponent('100');
    const maxResults = encodeURIComponent('100');
    const apiSort = 'quality';
    // Calculate minLength value based on available hours, estimating walking speed of 2.5
    const maxLength = availableHours * 2.5;
    const apiUrl = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=${maxDistance}&maxResults=${maxResults}&sort=${apiSort}&key=${apiKey}`;
    console.log(apiUrl);
    // TODO: Tranform the data to remove entries below the maximum length we require, which is not provided by the API
    // Pull data from Trails API
    // https://www.hikingproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&key=200472533-7cad91d48c212e1fc15dd52e7b19b2ad
    axios.get(apiUrl)
      .then(function (response) {
        // Process the response data, removing any trails with a length longer than our max
        // const trails = response.data.trails.filter(entry => entry.length <= maxLength);
        const trails = [];
        for (entry of response.data.trails) {
          if (entry.length <= maxLength) trails.push(entry);
        }
        // trails.sort((a, b) => +a.length + +b.length);
        // console.log(response.data.trails);
        res.render("trail", { trails: trails });
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
