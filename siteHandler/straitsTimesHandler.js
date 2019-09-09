const puppeteer = require("puppeteer");

async function straitsTimesHandler(url) {
  const browser = await puppeteer.launch({
    headless: !true,
    defaultViewport: { height: 736, width: 414 },
    args: ["--no-sandbox"],
    userDataDir: "./st_data"
  });

  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
    );

    try {
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle2" }),
        page.goto(url)
      ]);
    } catch (e) {}

    // Disable Javascript so weird overlays can't be created
    /*
    await page.setJavaScriptEnabled(false);

    await page.reload();
    await page.waitFor(2000);

    await page.emulateMedia("screen");

    await page.pdf({ path: "article.pdf", width: 414, height: 736 });
    */
  } catch (e) {
    await page.pdf({ path: "error.pdf", width: 414, height: 736 });
    throw e;
  } finally {
    // browser.close();
  }
}

module.exports = straitsTimesHandler;
