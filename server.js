const express = require("express");
const http = require("http");
const mysql = require("mysql");

var port = 8080;
var app = express();

app.use("/assets", express.static("assets"));

app
  .get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
    console.log("File index.html sent!");
  })
  .get("/comics", (req, res) => {
    res.sendFile(__dirname + "/views/comics.html");
    console.log("File comics.html sent!");
  })
  .get("/search", (req, res) => {
    res.sendFile(__dirname + "/views/search.html");
    console.log("File search.html sent!");
  })
  .get("/admin", (req, res) => {
    res.sendFile(__dirname + "/views/admin.html");
    console.log("File admin.html sent!");
  })
  .get("/admin/comics", (req, res) => {
    res.sendFile(__dirname + "/views/admin_comics.html");
    console.log("File admin_comics.html sent!");
  })
  .get("/admin/authors", (req, res) => {
    res.sendFile(__dirname + "/views/admin_authors.html");
    console.log("File admin_authors.html sent!");
  })
  .get("/admin/editors", (req, res) => {
    res.sendFile(__dirname + "/views/admin_editors.html");
    console.log("File admin_edithors.html sent!");
  })
  .get("/listcomics", (req, res) => {
    var co = mysql.createConnection({
      host: "localhost",
      user: "******",
      password: "*****", // '' (nothing) on Windows
      database: "dutafnode",
      port: 3306, // 3306 on Windows
    });
    co.connect();
    co.query(
      "SELECT * FROM bds INNER JOIN editeurs ON editeurs.editeur_id=bds._editeur_id INNER JOIN auteurs ON auteurs.auteur_id=bds._auteur_id",
      function (err, rows, fields) {
        if (err) throw err;
        //res.end(JSON.stringify(rows))
        co.end();
        res.json(rows);
      }
    );
  })
  .get("/listauthors", (req, res) => {
    var co = mysql.createConnection({
      host: "localhost",
      user: "*****",
      password: "*****", // '' (nothing) on Windows
      database: "dutafnode",
      port: 3306, // 3306 on Windows
    });
    co.connect();
    co.query("SELECT * FROM auteurs ", function (err, rows, fields) {
      if (err) throw err;
      //res.end(JSON.stringify(rows))
      co.end();
      res.json(rows);
    });
  })
  .get("/listeditors", (req, res) => {
    var co = mysql.createConnection({
      host: "localhost",
      user: "*****",
      password: "*****", // '' (nothing) on Windows
      database: "dutafnode",
      port: 3306, // 3306 on Windows
    });
    co.connect();
    co.query("SELECT * FROM editeurs ", function (err, rows, fields) {
      if (err) throw err;
      //res.end(JSON.stringify(rows))
      co.end();
      res.json(rows);
    });
  })
  .get("/searchcomics/:theText", (req, res) => {
    var co = mysql.createConnection({
      host: "localhost",
      user: "*****",
      password: "*****", // '' (nothing) on Windows
      database: "dutafnode",
      port: 3306, // 3306 on Windows
    });
    co.connect();
    var theText = req.params.theText; // get the route parameter
    co.query(
      'SELECT * FROM bds INNER JOIN editeurs ON editeurs.editeur_id=bds._editeur_id INNER JOIN auteurs ON auteurs.auteur_id=bds._auteur_id WHERE bd_titre LIKE "%' +
        theText +
        '%" OR bd_serie LIKE "%' +
        theText +
        '%" OR auteur_nom LIKE "%' +
        theText +
        '%" OR editeur_nom LIKE "%' +
        theText +
        '%"',
      function (err, rows, fields) {
        if (err) throw err;
        //res.end(JSON.stringify(rows))
        co.end();
        res.json(rows);
      }
    );
  })
  .get("/adminComics/delete/:theComicsCode", (req, res) => {
    var co = mysql.createConnection({
      host: "localhost",
      user: "*****",
      password: "*****", // '' (nothing) on Windows
      database: "dutafnode",
      port: 3306, // 3306 on Windows
    });
    co.connect();
    var theCode = req.params.theComicsCode; // get the route parameter
    co.query(
      "DELETE FROM bds WHERE bd_id=" + theCode,
      function (err, rows, fields) {
        if (err) throw err;
        //res.end(JSON.stringify(rows))
        co.end();
        res.end("La BD " + theCode + " a été supprimée !");
      }
    );
  })
  .get(
    "/adminComics/add/:t/:s/:p/:i/:a/:e", // title, serie, price, isbn, author and editor
    (req, res) => {
      var co = mysql.createConnection({
        host: "localhost",
        user: "*****",
        password: "*****", // '' (nothing) on Windows
        database: "dutafnode",
        port: 3306, // 3306 on Windows
      });
      co.connect();
      // get the route parameters
      var title = req.params.t;
      var serie = req.params.s;
      var price = req.params.p;
      var isbn = req.params.i;
      var editor = req.params.e;
      var author = req.params.a;
      co.query(
        "INSERT INTO bds " +
          "(bd_titre, bd_serie, bd_prix, bd_isbn, _auteur_id, _editeur_id) " +
          "VALUES " +
          '("' +
          title +
          '", "' +
          serie +
          '", ' +
          price +
          ', "' +
          isbn +
          '", ' +
          author +
          ", " +
          editor +
          ")",
        function (err, rows, fields) {
          if (err) throw err;
          //res.end(JSON.stringify(rows))
          co.end();
          res.end("Une nouvelle BD a été ajoutée!");
        }
      );
    }
  )
  .get("/adminAuthors/delete/:theAuthorsCode", (req, res) => {
    var co = mysql.createConnection({
      host: "localhost",
      user: "*****",
      password: "*****", // '' (nothing) on Windows
      database: "dutafnode",
      port: 3306, // 3306 on Windows
    });
    co.connect();
    var theCode = req.params.theAuthorsCode; // get the route parameter
    co.query(
      "DELETE FROM auteurs WHERE auteur_id=" + theCode,
      function (err, rows, fields) {
        if (err) throw err;
        //res.end(JSON.stringify(rows))
        co.end();
        res.send("L'auteur " + theCode + " a été supprimé !");
      }
    );
  })
  .get(
    "/adminAuthors/add/:n/:p/:na/:a", // nom, prenom, nationalite, age
    (req, res) => {
      var co = mysql.createConnection({
        host: "localhost",
        user: "*****",
        password: "*****", // '' (nothing) on Windows
        database: "dutafnode",
        port: 3306, // 3306 on Windows
      });
      co.connect();
      // get the route parameters
      var nom = req.params.n;
      var prenom = req.params.p;
      var nat = req.params.na;
      var age = req.params.a;
      co.query(
        "INSERT INTO auteurs " +
          "(auteur_nom, auteur_prenom, auteur_nat, auteur_age)" +
          "VALUES " +
          '("' +
          nom +
          '", "' +
          prenom +
          '", "' +
          nat +
          '", ' +
          age +
          ")",
        function (err, rows, fields) {
          if (err) throw err;
          //res.end(JSON.stringify(rows))
          co.end();
          res.end("Un nouvel auteur a été ajouté!");
        }
      );
    }
  )
  .get("/adminEditors/delete/:theEditorsCode", (req, res) => {
    var co = mysql.createConnection({
      host: "localhost",
      user: "*****",
      password: "*****", // '' (nothing) on Windows
      database: "dutafnode",
      port: 3306, // 3306 on Windows
    });
    co.connect();
    var theCode = req.params.theEditorsCode; // get the route parameter
    co.query(
      "DELETE FROM editeurs WHERE editeur_id=" + theCode,
      function (err, rows, fields) {
        if (err) throw err;
        //res.end(JSON.stringify(rows))
        co.end();
        res.end("L'éditeur " + theCode + " a été supprimé !");
      }
    );
  })
  .get(
    "/adminEditors/add/:n/:p/:t", // nom, pays, tel
    (req, res) => {
      var co = mysql.createConnection({
        host: "localhost",
        user: "*****",
        password: "*****", // '' (nothing) on Windows
        database: "dutafnode",
        port: 3306, // 3306 on Windows
      });
      co.connect();
      // get the route parameters
      var nom = req.params.n;
      var pays = req.params.p;
      var tel = req.params.t;
      co.query(
        "INSERT INTO editeurs " +
          "(editeur_nom, editeur_pays, editeur_tel)" +
          "VALUES " +
          '("' +
          nom +
          '", "' +
          pays +
          '", ' +
          tel +
          ")",
        function (err, rows, fields) {
          if (err) throw err;
          //res.end(JSON.stringify(rows))
          co.end();
          res.end("Un nouvel editeur a été ajouté!");
        }
      );
    }
  )
  .listen(port, () => {
    console.log("Listening on port " + port + "...");
  });
