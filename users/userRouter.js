const express = require('express');

const router = express.Router();
const user = require('./userDb.js');
const post = require('../posts/postDb.js');
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

router.post('/:id/posts', validatePost, (req, res) => {
  post.insert(req.body).then(r => {
    res.status(200).json({
      message: "post created",
      post: r
    });
  }).catch(e=>res.status(500).json({message: "server error: unable to create post"}))
});

router.get('/', (req, res) => {
  user.get().then(r => {
    res.status(200).json({ messsage: "got user list", users: r });  
  }).catch(e => {
    res.status(500).json({message: "server error: unable to get user list"})
  })
});

router.get('/:id', (req, res) => {
  user.getById(req.params.id).then(r=>{
    res.status(200).json({
      message: "got user by id",
      user: r
    });
  }).catch(e => {
    res.status(500).json({message: "error retrieving user information"})
  })
});

router.get('/:id/posts', (req, res) => {
  user.getUserPosts(req.params.id).then(r => {
    res.status(200).json({
      message: "get posts by user id",
      posts: r
    })
  })
    .catch(e => {
    res.status(500).json({message: "error retrieving user's posts"})
  })
});

router.delete('/:id', (req, res) => {
  user.remove(req.params.id).then(r => {
    res.status(200).json({message: "deleted user"}).catch(e=>res.status(500).json({message: "server error: unable to delete user"}))
  })
});

router.put('/:id', (req, res) => {
  user.update(req.params.id, req.body).then(r => {
    res.status(200).json({message: "user updated", user: r}).catch(e=>res.status(500).json({message: "server error: unable to update user"}))
  })
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

 
function validatePost (req, res, next) {
  if (req.body) {
    if (req.body.text) {
      const minLength = 5;
      if (req.body.text.length >= minLength) {
        req.body.user_id = req.params.id;
        next();
      } else {
        res.status(400).json({message: `bad request: text must contain at least ${minLength} characters`})
      }
    } else {
      res.status(400).json({message: "bad request: missing post text"})
    }
  } else {
    res.status(400).json({message: "bad request: missing post data"})
  }
}

module.exports = router;
