const http = require("http"); //old way

const app = require("./index");
const scrapeTodayMatches = require("./scrape");

scrapeTodayMatches();
// setInterval(scrapeTodayMatches, 43200000);

const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port);
