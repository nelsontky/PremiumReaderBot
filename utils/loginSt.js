const puppeteer = require("puppeteer");

const { email, password } = require("./stCreds");

const LOGIN_URL =
  "https://acc-auth.sphdigital.com/SPHAuth/loginForm?svc=st_online";
const EMAIL_FIELD = "#j_username";
const PASSWORD_FIELD = "#j_password";
const LOGIN_BUTTON = ".btn";

async function loginSt() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { height: 736, width: 414 },
    args: ["--no-sandbox"],
    userDataDir: "./st_data"
  });

  try {
    let page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
    );

    try {
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle2" }),
        page.goto(LOGIN_URL)
      ]);
    } catch (e) {}

    await page.type(EMAIL_FIELD, email);
    await page.type(PASSWORD_FIELD, password);
    await page.click(LOGIN_BUTTON);
    await page.waitFor(3000);
  } catch (e) {
    console.log(e);
  } finally {
    console.log("LOGIN SUCCESSFUL");
    browser.close();
  }
};

loginSt();