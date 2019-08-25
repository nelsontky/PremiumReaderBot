const puppeteer = require("puppeteer");
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
  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
    );

    await page.goto(LOGIN_PAGE);

    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(CREDS.username);

    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(CREDS.password);

    await page.click(BUTTON_SELECTOR);

    await page.waitForNavigation();

    await page.goto(url);
    // Wait for head to appear to confirm loading
    await page.waitForSelector("head");
    // Disable Javascript so weird overlays can't be created
    await page.setJavaScriptEnabled(false);
    await page.reload();

    await page.emulateMedia("screen");

    await page.pdf({ path: "article.pdf", width: 414, height: 736 });
    browser.close();
  } catch (e) {
    browser.close();
    throw e;
  }
}

module.exports = straitsTimesHandler;