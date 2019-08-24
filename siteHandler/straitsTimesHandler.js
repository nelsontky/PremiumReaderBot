const puppeteer = require("puppeteer");
const CREDS = require("../creds/straitsTimes");

const LOGIN_PAGE =
  "https://acc-reg.sphdigital.com/RegAuth2/sphLogin.html?svc=gds&goto=https%3A%2F%2Facc-reg.sphdigital.com%3A443%2FRegAuth2%2FgdsUpdate.html";
const LOGIN_BUTTON =
  "#cx-embedded-ab > div:nth-child(1) > div:nth-child(2) > a:nth-child(2)";
const USERNAME_SELECTOR = "#j_username";
const PASSWORD_SELECTOR = "#j_password";
const BUTTON_SELECTOR = ".btn";
const LOGOUT_SELECTOR = ".nav-logout > a:nth-child(1)";

async function straitsTimesHandler(url) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { height: 736, width: 414 }
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19"
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
}

module.exports = straitsTimesHandler;
