const puppeteer = require("puppeteer");
const { removeOne } = require("../utils/removeElements");
const CREDS = require("../creds/straitsTimes");

const LOGIN_PAGE =
  "https://acc-reg.sphdigital.com/RegAuth2/sphLogin.html?svc=gds&goto=https%3A%2F%2Facc-reg.sphdigital.com%3A443%2FRegAuth2%2FgdsUpdate.html";
const USERNAME_SELECTOR = "#j_username";
const PASSWORD_SELECTOR = "#j_password";
const BUTTON_SELECTOR = ".btn";

async function straitsTimesHandler(url) {
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

    await page.goto(LOGIN_PAGE);

    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(CREDS.username);

    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(CREDS.password);

    await Promise.all([
      page.waitForNavigation({
        timeout: 10000,
        waitUntil: "domcontentloaded"
      }),
      page.click(BUTTON_SELECTOR)
    ]);

    const page2 = await browser.newPage();

    await Promise.all([
      page.waitForNavigation({
        waitUntil: "domcontentloaded"
      }),
      page2.goto(url)
    ]);
    await page.waitFor(1000);

    // Disable Javascript so weird overlays can't be created
    await page2.setJavaScriptEnabled(false);

    await page2.reload();
    // await page2.waitForSelector(".back-to-top");
    // await page.waitFor(1000);

    // Remove up arrow
    // await removeOne(".back-to-top", page2);

    await page2.emulateMedia("screen");

    await page2.pdf({ path: "article.pdf", width: 414, height: 736 });
  } catch (e) {
    await page.pdf({ path: "error.pdf", width: 414, height: 736 });
    throw e;
  } finally {
    browser.close();
  }
}

module.exports = straitsTimesHandler;
