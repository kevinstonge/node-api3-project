const express = require('express');

const router = express.Router();
router.use(express.json());
const user = require('./userDb.js');

router.use('/:id', validateUserId);

router.post('/', validateUser, (req, res) => {
  user.insert(req.body)
    .then(r => {
      res.status(200).json({
        message: "user created",
        user: r
      })
    })
    .catch(e => {
      res.status(500).json({message: "unable to create user"})
    })
});

router.post('/:id/posts', (req, res) => {
  console.log('post to user by id');
  res.status(200).json({message:"hello"})
});

router.get('/', (req, res) => {
  console.log('get users');
});

router.get('/:id', (req, res) => {
  console.log('get user by id');
  res.status(200).json({ message: "get user by id" });
});

router.get('/:id/posts', (req, res) => {
  console.log('get posts by user id');
  res.status(200).json({
    message: "get posts by user id",
    user: req.user
  });
});

router.delete('/:id', (req, res) => {
  console.log('delete user by id')
});

router.put('/:id', (req, res) => {
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
        res.status(404).json({message: "invalid user id"})
      }
    })
    .catch(e => {
      console.log(e);
      res.status(500).json({ message: `error retrieving the user's information` });
    });

}

function validateUser(req, res, next) {
  if (req.body) {
    if (req.body.name) {
      const minLength = 2
      if (req.body.name.length >= minLength) {
        next();
      } else {
        res.status(400).json({ message: `username must contain at least ${minLength} characters` })
      }
    } else {
      res.status(400).json({message: "bad request: missing user name"})
    }
  }
  else {
    res.status(400).json({message: "bad reqeust: missing user data"})
  }
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
