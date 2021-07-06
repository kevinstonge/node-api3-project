const express = require('express');

const router = express.Router();

const post = require('./postDb.js');

router.use('/:id', validatePostId);

router.get('/', (req, res) => {
  post.get().then(r => {
    res.status(200).json({message: "got posts", posts: r})
  }).catch(e => {
    res.status(500).json({message: "server error: unable to retrieve posts"})
  })
});

router.get('/:id', (req, res) => {
  post.getById(req.params.id).then(r => {
    res.status(200).json({
      message: `successfully got post with id: ${req.params.id}`,
      post: r
    })
  }).catch(e=>res.status(500).json({message: `server error: couldn't get post with id: ${req.params.id}`}))
});

router.delete('/:id', (req, res) => {
  post.delete(req.params.id).then(r => {
    res.status(200).json({message: `post ${req.params.id} deleted:`, deleted_post: r})
  }).catch(e=>{res.status(500).json({message: "server error: unable to delete post"})})
});

router.put('/:id', (req, res) => {
  post.update(req.params.id, req.body).then(r => {
    res.status(200).json({ message: "post updated" });
  }).catch(e => {
    res.status(500).json({message: "server error: unable to update post"})
  })
});

// custom middleware

function validatePostId (req, res, next) {
  post.getById(req.params.id).then(r => {
    if (r) {
      next();
    } else {
      res.status(400).json({message: `post with id: ${req.params.id} does not exist`})
    }
  }).catch(e=>res.status(500).json({message: "server error: unable to retrieve post data"}))
}


module.exports = router;
