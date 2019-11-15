const $ = require("cheerio");
const puppeteer = require("puppeteer");

const postToTelegraph = require("../utils/postToTelegraph");

async function bloombergHandler(url) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { height: 736, width: 414 },
    args: ["--no-sandbox"],
    userDataDir: "./bloomberg_data"
  });

  try {
    let page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
    );

    await page.setJavaScriptEnabled(false);

    try {
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle2" }),
        page.goto(url)
      ]);
    } catch (e) {}

    const content = await page.content();

    const title = $("title", content).text();

    let body = "";
    $("div.fence-body", content).each((i, e) => {
      body += $(e).text();
    });

    let image = "";
    try {
      // Some articles do not have images
      image = $(".lazy-img__image", content)[0].attribs.src;
    } catch (e) {}

    return await postToTelegraph(title, body, image);
  } catch (e) {
    throw e;
  } finally {
    browser.close();
  }
}

module.exports = bloombergHandler;
