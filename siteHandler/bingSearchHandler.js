const puppeteer = require("puppeteer");
const { removeAll } = require("../utils/removeElements");

const FIRST_LINK = "#b_results > li.b_algo > div.b_algoheader";

async function bingSearchHandler(url, domain) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { height: 736, width: 414 },
    args: ["--no-sandbox"]
  });

  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
    );
    // Disable Javascript so weird overlays can't be created
    await page.setJavaScriptEnabled(false);
    await page.goto(`https://www.bing.com/search?q=${url}`);
    await page.waitForSelector(FIRST_LINK);

    await Promise.all([
      page.waitForNavigation({
        timeout: 10000,
        waitUntil: "domcontentloaded"
      }),
      page.click(FIRST_LINK)
    ]);

    // Domain specific hacks
    if (domain === "ft.com") {
      // Removes cookies prompt
      await removeAll(".cookie-banner", page);
    }

    await page.emulateMedia("screen");

    await page.pdf({ path: "article.pdf", width: 414, height: 736 });
  } catch (e) {
    await page.pdf({ path: "error.pdf", width: 414, height: 736 });
    throw e;
  } finally {
    browser.close();
  }
}

module.exports = bingSearchHandler;
