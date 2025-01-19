const http = require("http"); //old way
// import http from 'http';
const app = require("./index");
const scrapeTodayMatches = require("./scrape");

// import app from './app';
const port = process.env.PORT || 3000;
const server = http.createServer(app);
// scrapeTodayMatches();
// setInterval(scrapeTodayMatches, 43200000);
server.listen(port);
