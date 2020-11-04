const express = require('express');

const router = express.Router();

const user = require('./userDb.js');

router.post('/', (req, res) => {
  console.log('post -> new user')
});

router.post('/:id/posts', validateUserId, (req, res) => {
  console.log('post to user by id');
  res.status(200).json({message:"hello"})
});

router.get('/', (req, res) => {
  console.log('get users');
});

router.get('/:id', validateUserId, (req, res) => {
  console.log('get user by id');
  res.status(200).json({ message: "get user by id" });
});

router.get('/:id/posts', validateUserId, (req, res) => {
  console.log('get posts by user id');
  res.status(200).json({
    message: "get posts by user id",
    user: req.user
  });
});

router.delete('/:id', validateUserId, (req, res) => {
  console.log('delete user by id')
});

router.put('/:id', validateUserId, (req, res) => {
  console.log('update user by id')
});

//custom middleware

function validateUserId(req, res, next) {
  console.log('validateUserId');
  user.getById(req.params.id)
    .then(r => {
      if (r && r.name && r.id) {
        req.user = r;
        next();
      }
      else {
        res.status(400).json({message: "invalid user id"})
      }
    })
    .catch(e => {
      console.log(e);
      res.status(500).json({ message: `error retrieving the user's information` });
    });

}

function validateUser(req, res, next) {
  // do your magic!
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
