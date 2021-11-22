// This code basically runs on node
// It gathers all the required packages
// It gets the http, express packages using node require module
// Has the separate functions hooked for listening the requests, error handling and so on..
// After making any changes to server.js or app.js or any server code we need to constantly restart the server
// which is annoying, so install the package called nodemon
// Nodemon basically detects the changes, it automatically restarts the serves upon any file save
// npm install --save-dev nodemon

const app = require("./backend/app");
const debug = require("debug")("node-angular");
//import http package using node require
const http = require("http");

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "9086");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
