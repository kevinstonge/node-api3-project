const express = require('express');

const server = express();
server.use(express.json());
function logger(req, res, next) {
  console.log(`req.method: ${req.method}, req.url: ${req.url}, time: ${new Date()}`);
  next();
}
server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});




module.exports = server;
