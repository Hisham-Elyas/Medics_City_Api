const http = require('http'); //old way
// import http from 'http';
const app = require('./app');
// import app from './app';
const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port);
