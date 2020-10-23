/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
const { getUser, commentsForResourceId, getAllContent, contentView, addFavourite, addComment, addRating, addResource, updateUser } = require('../db/database_functions/database');

const express = require('express');
const router = express.Router();

module.exports = (db) => {

  // router.get("/", (req, res) => {
  //   let query = `SELECT * FROM resources`;
  //   console.log(query);
  //   db.query(query)
  //     .then(data => {
  //       const resources = data.rows;
  //       res.json({ resources });
  //     })
  //     .catch(err => {
  //       res
  //         .status(500)
  //         .json({ error: err.message });
  //     });
  // });

  //Filter for food
  router.get("/", (req, res) => {
    console.log("im in router get /");
    console.log(getAllContent());
    getAllContent(req.query)
      .then(resources => {
        res.render('index', { resources });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:id/comments", (req, res) => {

    const { id } = req.params;

    commentsForResourceId(id)
      .then((rows) => {
        res.json(rows);
      }

      );
  });
  router.post("/:id/comments", (req, res) => {
    const { id: resourceid } = req.params;
    const userid = 1;
    const { comment } = req.body;
    addComment({ comment, resourceid, userid })
      .then((createdComment) => {
        res.send(createdComment);
      }
      );
  });





  router.get("/new_content", (req, res) => {
    res.render("new_content");// ,templateVars;
  });


  router.post('/new_content', (req, res) => {
    addResource(req.body)
      .then(resource => {
        res.redirect('/api/users');
      });
  });

  // router.post('/:id', (req, res) => {

  //   const { id } = req.params;
  //   console.log("id>>>", id);
  //   contentView(id);
  //   const { comment } = req.body
  //     .then(comment => {
  //       res.send('ind_view', comment);
  //     })
  //     .catch(err => {
  //       console.error(err);
  //       res.send(err);
  //     });
  // });
  //***** YOUR CREATED resource PAGE *****
  router.get("/:id", (req, res) => {
    const { id } = req.params;
    contentView(id)// replace with addComment then use the response to append the the front end if i want to save in database
      .then(resource => {
        const templateVars = {
          resource: resource,

        };
        res.render("ind_view.ejs", templateVars);
      });
  });


  return router;
};

