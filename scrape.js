const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");

// Enable stealth plugin
puppeteer.use(StealthPlugin());

// Configure realistic user agents
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
];

// Utility functions
const randomDelay = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// // In the humanInteraction function:
// async function humanInteraction(page) {
//   // Random mouse movement
//   // await page.mouse.move(
//   //   randomDelay(100, page.viewport().width),
//   //   randomDelay(100, page.viewport().height)
//   // );

//   // Use traditional timeout
//   await new Promise((resolve) => setTimeout(resolve, randomDelay(500, 2000)));

//   // Random scrolling
//   await page.evaluate(async () => {
//     window.scrollTo({
//       top: Math.random() * document.body.scrollHeight,
//       behavior: "smooth",
//     });
//   });
// }

const scrapeTodayMatches2 = async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--disable-blink-features=AutomationControlled",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  const page = await browser.newPage();

  try {
    // Set random user agent
    await page.setUserAgent(
      userAgents[Math.floor(Math.random() * userAgents.length)]
    );
    // await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1 });

    // Set extra headers
    // await page.setExtraHTTPHeaders({
    //   "Accept-Language": "en-US,en;q=0.9",
    //   Referer: "https://www.google.com/",
    //   "Sec-Fetch-Dest": "document",
    //   "Sec-Fetch-Mode": "navigate",
    // });

    // // Block unnecessary resources
    // await page.setRequestInterception(true);
    // page.on("request", (req) => {
    //   const blockedResources = ["image", "stylesheet", "font", "media"];
    //   blockedResources.includes(req.resourceType())
    //     ? req.abort()
    //     : req.continue();
    // });

    // Navigate to main page
    await page.goto("https://www.ysscores.com/en/today_matches", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // Human-like interactions
    // await humanInteraction(page);
    await page.waitForSelector(".matches-wrapper", { timeout: 60000 });

    // Extract matches
    const matches = await page.evaluate(() => {
      const baseURL = "https://www.ysscores.com";
      return Array.from(document.querySelectorAll(".matches-wrapper"))
        .slice(0, 1) // for test 2 matches only
        .flatMap((championship) => {
          const league = championship
            .querySelector(".champ-title b")
            ?.textContent.trim();
          return Array.from(
            championship.querySelectorAll(".ajax-match-item")
          ).map((match) => ({
            matchLink: new URL(match.getAttribute("href"), baseURL).href,
            league: league || "Unknown League",
            homeTeam:
              match.querySelector(".first-team b")?.textContent.trim() ||
              "Unknown Team",
            awayTeam:
              match.querySelector(".second-team b")?.textContent.trim() ||
              "Unknown Team",
            time:
              match.querySelector(".match-date")?.textContent.trim() || "N/A",
          }));
        });
    });

    console.log(
      `Found ${matches.length} matches. Starting detailed scraping...`
    );

    // Scrape match details
    for (const [index, match] of matches.entries()) {
      try {
        console.log(`Processing match ${index + 1}/${matches.length}`);

        // await humanInteraction(page);
        await page.goto(match.matchLink, {
          waitUntil: "networkidle2",
          timeout: 45000,
          referer: "https://www.ysscores.com/",
        });

        // Scrape details
        match.details = await page.evaluate(() => {
          const infoItems = Array.from(
            document.querySelectorAll(".match-info-item")
          ).map((el) => ({
            title: el.querySelector(".title")?.textContent.trim() || "N/A",
            content: el.querySelector(".content")?.textContent.trim() || "N/A",
          }));

          return {
            matchInfo: infoItems.filter((item) => !item.title.includes("sub")),
            channels: infoItems.filter((item) =>
              item.title.includes("Channel")
            ),
            commentators: infoItems.filter((item) =>
              item.title.includes("Commentator")
            ),
          };
        });

        await new Promise((resolve) => setTimeout(resolve, delay));
      } catch (error) {
        console.error(`Failed to scrape ${match.matchLink}:`, error.message);
        match.details = { error: error.message };
        await page.screenshot({ path: `error_${Date.now()}.png` });
      }
    }

    // Save results
    fs.writeFileSync("matches.json", JSON.stringify(matches, null, 2));
    console.log("Data saved to matches.json");
  } catch (error) {
    console.error("Scraping failed:", error);
    await page.screenshot({ path: `critical_error_${Date.now()}.png` });
  } finally {
    await browser.close();
  }
};

// puppeteer.use(StealthPlugin());
// const jsonData = {
//   "time": "07:45 pm"
// };

function addHour(timeStr) {
  // Validate time format and values
  // console.log(timeStr);
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  // if (!match) throw new Error("Invalid time format");
  if (!match) return timeStr;

  const [_, hours, minutes, period] = match;
  const hoursInt = parseInt(hours, 10);
  const minutesInt = parseInt(minutes, 10);

  if (hoursInt < 1 || hoursInt > 12 || minutesInt < 0 || minutesInt > 59) {
    return timeStr;
  }

  // Convert to 24-hour format
  let hours24 = hoursInt;
  if (period.toLowerCase() === "pm" && hours24 !== 12) {
    hours24 += 12;
  } else if (period.toLowerCase() === "am" && hours24 === 12) {
    hours24 = 0;
  }

  // Add 1 hour
  const date = new Date(1970, 0, 1, hours24, minutesInt);
  date.setHours(date.getHours() + 1);

  // Convert back to 12-hour format
  const newHours24 = date.getHours();
  const newMinutes = date.getMinutes().toString().padStart(2, "0");
  const newPeriod = newHours24 >= 12 ? "PM" : "AM";
  let newHours12 = newHours24 % 12;
  newHours12 = newHours12 === 0 ? 12 : newHours12;

  return `${newHours12}:${newMinutes} ${newPeriod}`;
}

const filterMatches = () => {
  const inputFilePath = "matches.json"; // Input file with all matches
  const outputFilePath = "filter_matches.json"; // Filtered matches output file

  try {
    // Read the input JSON file
    const data = fs.readFileSync(inputFilePath, "utf-8");
    const matches = JSON.parse(data);

    // Filter matches
    const filteredMatches = matches.map((match) => {
      // Extract Match Info details
      // const matchTime = addHour(
      //   match.details?.matchInfo.find((info) => info.title === "Match Time")
      //     ?.content || "N/A"
      // );
      const matchTime =
        match.details?.matchInfo.find((info) => info.title === "Match Time")
          ?.content || "N/A";
      const matchDate =
        match.details?.matchInfo.find((info) => info.title === "Match Date")
          ?.content || "N/A";

      // Filter and map channels and commentators
      let channelsAndCommentators = [];
      channelsAndCommentators =
        match.details?.matchInfo
          .filter(
            (info) => info.title === "Channel" || info.title === "Commentator"
          )
          .map((info) => {
            if (info.title === "Channel") {
              return { Channel: info.content };
            }
            if (info.title === "Commentator") {
              return { Commentator: info.content };
            }
          }) || [];

      // Fallback to matchInfo if no valid channels or commentators in channelsAndCommentators
      if (!channelsAndCommentators || channelsAndCommentators.length === 0) {
        match.details?.channelsAndCommentators.forEach((entry) => {
          const { channel, commentator } = entry;
          if (channel) {
            channelsAndCommentators.push({ Channel: channel });
          }
          if (commentator) {
            channelsAndCommentators.push({ Commentator: commentator });
          }
        });
      }

      const mergeChannelsAndCommentators = (channelsAndCommentators) => {
        const merged = [];
        for (let i = 0; i < channelsAndCommentators.length; i += 2) {
          const channelObj = channelsAndCommentators[i];
          const commentatorObj = channelsAndCommentators[i + 1];

          if (channelObj?.Channel && commentatorObj?.Commentator) {
            merged.push({
              Channel: channelObj.Channel,
              Commentator: commentatorObj.Commentator,
            });
          }
        }
        return merged.slice(0, 2);
      };
      channelsAndCommentators = mergeChannelsAndCommentators(
        channelsAndCommentators
      );
      // const timeplusOneh = addOneHour(matchTime);
      // Return the filtered match structure
      return {
        league: match.league,
        leagueLogo: match.leagueLogo,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        homeTeamLogo: match.homeTeamLogo,
        awayTeamLogo: match.awayTeamLogo,
        time: match.time,
        matchTime,
        matchDate,

        channelsAndCommentators,
      };
    });

    // Save filtered matches to a new file
    fs.writeFileSync(
      outputFilePath,
      JSON.stringify(filteredMatches, null, 2),
      "utf-8"
    );
    console.log(`Filtered matches saved to ${outputFilePath}`);
  } catch (error) {
    console.error("Error processing matches:", error.message || error);
  }
};

const scrapeTodayMatches = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // await page.setUserAgent(
    //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    // );
    await page.setUserAgent(
      userAgents[Math.floor(Math.random() * userAgents.length)]
    );
    await page.goto("https://www.ysscores.com/en/today_matches", {
      waitUntil: "networkidle2",
      timeout: 30000,
      referer: "https://www.google.com/",
    });

    await page.waitForSelector(".matches-wrapper", { timeout: 60000 });

    // Extract matches
    const matches = await page.evaluate(() => {
      const baseURL = "https://www.ysscores.com";
      return (
        Array.from(document.querySelectorAll(".matches-wrapper"))
          // .slice(0, 1) // for test 2 matches only
          .flatMap((championship) => {
            const leagueName =
              championship
                .querySelector(".champ-title b")
                ?.textContent.trim() || "Unknown League";
            const leagueNameLogo =
              championship.querySelector(".champ-title img")?.src || "No Logo";
            const matchItems = Array.from(
              championship.querySelectorAll(".ajax-match-item")
            );

            return matchItems.map((match) => ({
              matchLink: match.getAttribute("href") || "No Link",
              league: leagueName,
              leagueLogo: leagueNameLogo,
              homeTeam:
                match.querySelector(".first-team b")?.textContent.trim() ||
                "Unknown Team",
              awayTeam:
                match.querySelector(".second-team b")?.textContent.trim() ||
                "Unknown Team",
              awayTeamLogo:
                match.querySelector(".second-team img")?.src || "No Logo",
              homeTeamLogo:
                match.querySelector(".first-team img")?.src || "No Logo",
              time:
                match.querySelector(".match-date")?.textContent.trim() ||
                "Time not available",
            }));
          })
      );
    });

    console.log(
      `Scraped ${matches.length} matches. Starting detailed scraping...`
    );

    for (const [index, match] of matches.entries()) {
      if (!match.matchLink) {
        console.log(
          `Skipping match with no link: ${match.homeTeam} vs ${match.awayTeam}`
        );
        continue;
      }

      try {
        console.log(`Processing match ${index + 1}/${matches.length}`);
        await page.goto(match.matchLink, {
          waitUntil: "networkidle2",
          timeout: 30000,
        });
        // await page.screenshot({
        //   path: `${Date.now()}_error.png`,
        //   fullPage: true,
        // });
        // Scrape detailed match info
        const matchDetails = await page.evaluate(() => {
          // Extract all key-value pairs from "Match Info"
          const matchInfo = Array.from(
            document.querySelectorAll(".match-info-item") // match-info-item
          ).map((info) => ({
            title: info.querySelector(".title")?.textContent.trim() || "N/A",
            content:
              info.querySelector(".content")?.textContent.trim() || "N/A",
          }));

          // Extract all channels and commentators
          const channelsAndCommentators = Array.from(
            document.querySelectorAll(".match-info-item.sub")
          ).map((item) => ({
            channel:
              item.querySelector(".title")?.textContent.trim() ||
              "Channel not available",
            commentator:
              item.querySelector(".content a")?.textContent.trim() ||
              "Commentator not available",
          }));

          return {
            matchInfo,
            channelsAndCommentators,
          };
        });

        match.details = matchDetails;
      } catch (error) {
        console.error(`Error scraping details for ${match.matchLink}:`, error);
        match.details = { error: "Failed to retrieve details" };
      }
    }

    // console.log("Detailed Matches:");
    // matches.forEach((match) => {
    //   console.log(`Match: ${match.homeTeam} vs ${match.awayTeam}`);
    //   console.log(`League: ${match.league}`);
    //   console.log("Match Info:");
    //   (match.details?.matchInfo || []).forEach((info) =>
    //     console.log(`  ${info.title}: ${info.content}`)
    //   );
    //   console.log("Channels and Commentators:");
    //   (match.details?.channelsAndCommentators || []).forEach((info) => {
    //     console.log(
    //       `  Channel: ${info.channel}, Commentator: ${info.commentator}`
    //     );
    //   });
    //   console.log("====================================");
    // });

    // Save the data to a JSON file
    const filePath = "matches.json";
    fs.writeFileSync(filePath, JSON.stringify(matches, null, 2), "utf-8");
    console.log("Data saved to matches.json");
    // Run the filter function
    filterMatches();
  } catch (error) {
    console.error("Error scraping matches:", error);
  } finally {
    await browser.close();
  }
};

// Run the scraper
// scrapeTodayMatches2();
scrapeTodayMatches();

// filterMatches();

module.exports = scrapeTodayMatches;
