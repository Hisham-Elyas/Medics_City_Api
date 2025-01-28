const http = require("http"); //old way

const app = require("./index");
const scrapeTodayMatches = require("./scrape");
setInterval(() => {
  scrapeTodayMatches.scrapeTodayMatches();
}, 43200000); // Scrape every 12 hours
const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port);
