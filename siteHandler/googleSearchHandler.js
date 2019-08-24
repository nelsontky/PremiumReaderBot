const puppeteer = require("puppeteer");

async function googleSearchHandler(url, ctx) {
  try {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { height: 736, width: 414 }
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19"
  );

  await page.goto(`https://www.google.com/search?q=${url}`);

  // Wait for detected location to confirm loading is done
  await page.waitForSelector("#fbar > div.fbar.b2hzT > div > span");

  const links = await page.$$("div.MUxGbd.v0nnCb");

  // Filter away ads and click on first result
  await links
    .filter(e => e._remoteObject.description === "div.MUxGbd.v0nnCb")[0]
    .click();

  await page.waitForNavigation();

  await page.pdf({ path: "article.pdf", width: 414, height: 736 });
  browser.close();
  } catch (e) {
    ctx.reply("Error, please try again");
  }

}

module.exports = googleSearchHandler;
