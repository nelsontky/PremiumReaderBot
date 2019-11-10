const $ = require("cheerio");
const puppeteer = require("puppeteer");
const rp = require("request-promise");

const postToTelegraph = require("../utils/postToTelegraph");
const { readDb, writeToDb } = require("../utils/jsonTools");

const logoutOtherBrowser = "#btnMysphMsg";

async function straitsTimesHandler(url) {
  // Checks if ST link generated before
  const request = await rp(url);
  const heading = $(".node-header", request).text();
  const db = await readDb();
  if (db[heading] != undefined) {
    // url has been generated before
    return db[heading];
  }

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { height: 736, width: 414 },
    args: ["--no-sandbox"],
    userDataDir: "./st_data"
  });

  try {
    let page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
    );

    try {
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle2" }),
        page.goto(url)
      ]);
    } catch (e) {}

    // Try to logout from other browsers if present
    try {
      await Promise.all([
        await page.click(logoutOtherBrowser),
        await page.waitFor(3000)
      ]);
    } catch (e) {}

    await page.waitFor(3000);

    const content = await page.content();

    const title = $(".node-header", content).text();
    let body = "";
    $(".odd.field-item > p", content).each((i, e) => {
      body += $(e).text() + "\n";
    });
    const image = $("img.img-responsive", content)[0].attribs.src;
    const link = await postToTelegraph(title, body, image);

    // Write to db
    db[title] = link;
    writeToDb(db);

    return link;
  } catch (e) {
    throw e;
  } finally {
    browser.close();
  }
}

module.exports = straitsTimesHandler;
