// code away!
require('dotenv').config();
const server = require("./server.js");
const PORT = process.env.PORT || 4000;
const MOTD = process.env.MOTD || "default motd";
server.listen(PORT, () => { console.log(`listening on port: ${PORT}`); console.log(MOTD)})