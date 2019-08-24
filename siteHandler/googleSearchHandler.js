const puppeteer = require("puppeteer");

async function googleSearchHandler(url, domain) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { height: 736, width: 414 }
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19"
  );

  // Disable Javascript so weird overlays can't be created
  await page.setJavaScriptEnabled(false);

  await page.goto(`https://www.google.com/search?q=site:${url}`);

  // Wait for Google settings button to appear to confirm loading is done
  await page.waitForSelector("#mCljob > div:nth-child(1) > a");

  const links = await page.$$("div.BNeawe.vvjwJb.AP7Wnd");

  // Filter away ads and click on first result
  await links
    .filter(e => e._remoteObject.description === "div.BNeawe.vvjwJb.AP7Wnd")[0]
    .click();

  await page.waitForNavigation();

  // Domain specific hacks
  if (domain === "wsj.com") {
    // Removes WSJ top bar
    await page.evaluate(sel => {
      let topBar = document.querySelector(sel);
      topBar.parentNode.removeChild(topBar);
    }, "#full-header");
  }

  await page.emulateMedia("screen");

  await page.pdf({ path: "article.pdf", width: 414, height: 736 });
  browser.close();
}

module.exports = googleSearchHandler;
