const http = require("http"); //old way
// import http from 'http';
const app = require("./index");
const scrapeTodayMatches = require("./scrape");

// import app from './app';
const port = process.env.PORT || 3000;
const server = http.createServer(app);
// scrapeTodayMatches();
// setInterval(scrapeTodayMatches, 43200000);
const scrape10Seconds = async () => {
  console.log(`Running scrapeTodayMatches at ${new Date().toLocaleString()}`);
  // Your scraping logic here
  try {
    // Simulate some work with a promise or async operation
    console.log("Scraping data...");
  } catch (error) {
    console.error("Error scraping data:", error.message);
  }
};

// Run the method immediately on start
scrape10Seconds();

// Schedule the method to run every 10 seconds (10000 ms)
setInterval(scrape10Seconds, 10000);
server.listen(port);
