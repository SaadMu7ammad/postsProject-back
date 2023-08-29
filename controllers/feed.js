const Post = require('../models/post');
const { validationResult } = require('express-validator');
exports.getPosts = (req, res, next) => {
  Post.find()
    .then((result) => {
      res
        .status(200)
        .json({ message: 'fetched posts successfully', posts: result });
    })
    .catch((err) => {
      err.statusCode = 500;
      next(err);
    });

  //dummy response
  // res.status(200).json({
  //   posts: [
  //     {
  //       _id: '1',
  //       title: 'First Post',
  //       content: 'This is the first post!',
  //       imageUrl: 'images/duck.png',
  //       creator: {
  //         name: 'saad muhammad',
  //       },
  //       createdAt: new Date(),
  //     },
  //   ],
  // });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('validation failed ,data entered not correct');
    error.statusCode = 422;
    throw err;
    // return res.status(422).json({
    //   message: 'validation failed ,data entered not correct',
    //   error: errors.array(),
    // });
  }
  // console.log('hhhherer');
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: 'images/duck.png',
    creator: { name: 'Saaddoonn' },
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: 'Post created successfully!',
        post: {
          _id: new Date().toISOString(),
          title: title,
          content: content,
          creator: {
            name: 'saadoon',
          },
          createdAt: new Date(),
        },
      });
    })
    .catch((err) => {
      // console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postID;
  Post.findById(postId)
    .then((result) => {
      if (!result) {
        const error = new Error('could not find a post');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'post fetched', post: result });
    })
    .catch((err) => {
      console.log(err);
      err.statusCode = 500;
      next(err);
    });
};
