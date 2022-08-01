/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
const mongoose = require('mongoose');

const libSchema = new mongoose.Schema({
    title: {type: String, required: true},
    comments: [String],
    commentcount: Number
  });

  const libModel = mongoose.model('Lib', libSchema);

module.exports = function (app) {



  app.route('/api/books')

    .get(function (req, res){
      libModel.find({}, (err, data) => {
        if (err) return console.error(err);
        res.json(data);
      });
    })

    .post((req, res) => {
      let title = req.body.title;

      if (!title) return res.send('missing required field title');

      libModel.create({title: title, comments: [], commentcount: 0}, (err, data) => {
        if (err) return console.error(err);
        return res.send(data);
      });
    })

    .delete((req, res) => {
      libModel.deleteMany({}, (err, data) => {
        if (err) return console.error(err);
        return res.send('complete delete successful');
      });
    });



  app.route('/api/books/:id')

    .get((req, res) => {
      let bookid = req.params.id;
      libModel.findById(bookid, (err, data) => {
        if (err) return console.error(err);
        if (!data) return res.send('no book exists');
        return res.send(data);
      });
    })

    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) return res.send('missing required field comment');

      libModel.findById(bookid, (err, data) => {
        if (err) return console.error(err);
        if (!data) return res.send('no book exists');
        data.comments.push(comment);
        data.commentcount = data.comments.length;
        data.save((err, newData) => {
          if (err) return console.error(err);
          return res.send(newData);
        });
      });
    })

    .delete((req, res) => {
      let bookid = req.params.id;

      libModel.deleteOne({_id: bookid}, (err, data) => {
        if (err) return console.error(err);
        if (!data || !data.deletedCount) return res.send('no book exists');
        return res.send('delete successful');
      });
    });
};
