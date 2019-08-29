const puppeteer = require("puppeteer");
const { removeOne, removeAll } = require("../utils/removeElements");

async function incognitoHandler(url, domain) {
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

    await page.setJavaScriptEnabled(false);

    await Promise.all([
      page.waitForNavigation({
        waitUntil: "domcontentloaded"
      }),
      page.goto(`${url}`)
    ]);
    await page.waitFor(1000);

    // Domain specific hacks
    switch (domain) {
      case "baltimoresun.com":
        await removeAll(".trb_ad_st_m", page);
        break;
      case "bostonglobe.com":
        await removeOne("#app-bar", page);
        break;
      case "chicagotribune.com":
        await removeAll(".pb-ad", page);
        break;
      case "economist.com":
        await removeAll(".sticky-outer-wrapper", page);
        // Remove subscription overlay
        await removeAll(".inhouse__subscription-ribbon", page);
        break;
      case "latimes.com":
        await removeAll(".Page-header", page);
        break;
      case "wired.com":
        await removeAll(".header", page);
        break;
      default:
        break;
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

module.exports = incognitoHandler;
