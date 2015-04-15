var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/courseBlog');

var app = express();

var logger = require('./logger');
app.use(logger);
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

var postsSchema = mongoose.Schema({
    title: String,
    body: String
});

var Posts = mongoose.model('Posts', postsSchema);

app.get('/posts', function (request, response) {
    Posts.find(function (error, posts) {
        if (error) response.send(error);
        response.json({posts: posts});
    });
});

app.get('/posts/:post_id', function (request, response) {
    Posts.findById(request.params.post_id, function (error, post) {
        if (error) response.send(error);
        response.json({posts: post});
    });
});

app.post('/posts', function (request, response) {
    var post = new Posts({
        title: request.body.post.title,
        body: request.body.post.body
    });
    post.save(function(error) {
        if (error) response.send(error);
        response.status(201).json({posts: post});
    });
});

app.put('/posts/:post_id', function (request, response) {
    // use our Posts model to find the post we want
    Posts.findById(request.params.post_id, function (error, post) {
        if (error) response.send(error);

        // update the post info
        post.title = request.body.post.title,
        post.body = request.body.post.body

        // save the post
        post.save(function (error) {
            if (error) response.send(error);
            response.status(201).json({posts: post});
        });
    });
});

app.delete('/posts/:post_id', function (request, response) {
    Posts.remove({
        _id: request.params.post_id
    }, function(error, post) {
        if (error) response.send(err);
        response.status(201).json({posts: Posts});
    });
});

app.listen(3700, function () {
    console.log('Listening on port 3700');
});

