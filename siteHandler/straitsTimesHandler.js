const puppeteer = require("puppeteer");
const CREDS = require("../creds/straitsTimes");

const LOGIN_PAGE = "https://acc-reg.sphdigital.com/RegAuth2/gdsLogin.html";
const USERNAME_SELECTOR = "#j_username";
const PASSWORD_SELECTOR =
  "#loginForm > ol:nth-child(1) > li:nth-child(5) > input:nth-child(1)";
const BUTTON_SELECTOR = "button.formbutton:nth-child(1)";

async function straitsTimesHandler(url) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { height: 736, width: 414 },
    args: ["--no-sandbox"],
    userDataDir: "./st_data"
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
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      page.click(BUTTON_SELECTOR)
    ]);

    try {
      await Promise.all([
        page.waitForNavigation({ timeout: 10000 }),
        page.goto(url)
      ]);
    } catch (e) {}

    // Disable Javascript so weird overlays can't be created
    await page.setJavaScriptEnabled(false);

    await page.reload();
    await page.waitFor(2000);

    await page.emulateMedia("screen");

    await page.pdf({ path: "article.pdf", width: 414, height: 736 });
  } catch (e) {
    await page.pdf({ path: "error.pdf", width: 414, height: 736 });
    throw e;
  } finally {
    browser.close();
  }
}

module.exports = straitsTimesHandler;
